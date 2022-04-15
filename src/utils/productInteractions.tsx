import { Product } from '../constants/class-objects';
import { ethers } from 'ethers';
import { db, FieldValue } from '../utils/firebase';
import { getCurrentTimestamp } from '../utils/format';
import { openSeaCollectionFloorPrice } from '../queries/NftData';

const BARTER_CONTRACT_ADDRESS = "0xc24afecb277Dd2f5b50b5B51f1fC9d5b8234101A";
const barterContractInfo = require('../artifacts/Barter.json');
const IERC721ContractInfo = require('../artifacts/IERC721.json');

const WETH_CONTRACT_ADDRESS = "0xc778417E063141139Fce010982780140Aa0cD5Ab";
const IERC20Contract = require('../artifacts/IERC20.json');

const STORE_WALLET_ADDRESS = "0x2929C3c9805dD1A16546251b9b0B65583FD302c8"

declare var window: any;

/**
 * 
 * @param nft 
 * @param product 
 * @param ethPrice 
 * @returns 
 * 
 * Based on floor price of NFT collection in USD compared to the product price,
 * function will return success or failure if an instant purchase can take place
 * 
 */
export const canPurchaseCheck = async (nft:any, product:Product, ethPrice:any) => {
  
  console.log(`FINAL ETH PRICE AT PURCHASE CHECK : ${ethPrice}`);

  const floorPriceETH = await openSeaCollectionFloorPrice(nft);
  const floorPriceUSD = floorPriceETH * ethPrice;
  // const floorPriceUSD = 100000;
  const prodPriceUSD = product.price / 100;

  console.log(`GOT THIS FLOOR PRICE: ${floorPriceETH} = ${floorPriceUSD}`)

  if (floorPriceUSD > prodPriceUSD) {
    // Execute transfer
    console.log(`Can execute the trade!`);
    return {
      success: true,
      floorPriceETH,
      floorPriceUSD,
      status: `About to transfer dis NFT`
    }
  } else {
    // Fail to transfer due to insuffient funds
    console.log(`Insufficient market value`);
    return {
      success: false,
      floorPriceETH,
      floorPriceUSD,
      status: `Insufficient market value: the floor price of this NFT (${floorPriceETH}ETH , $${floorPriceUSD}) is not enough to barter with this product (${prodPriceUSD})`
    }
  }
};

/**
 * 
 * @param nft 
 * @returns 
 * 
 * Function triggers transfer of NFT from buyer wallet to store wallet
 * 
 */
 export const instantBarterNFT = async (nft:any) => {

  const buyerAddr = window.ethereum.selectedAddress;

  if (!buyerAddr) {
    return {
      success: false,
      status: `Error connecting your Wallet. Please try again.`
    }
  }

  try {  
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();

    // contract instance
    const barterContract = new ethers.Contract(BARTER_CONTRACT_ADDRESS, barterContractInfo.abi, signer);

    const nftContractAddr = nft.asset_contract.address; // NFT contract address
    const nftTokenId = nft.token_id; // NFT token id
    const selletAddr = STORE_WALLET_ADDRESS; // receives the NFT token

    // Approve trade before attempting exchange using OpenZeppelin
    // OpenZeppelin IERC721 functions are embedded in NFT contract so the ABI is functional
    const ierc721Abi = IERC721ContractInfo.abi;
    const ierc721Contract = new ethers.Contract(nftContractAddr, ierc721Abi, signer);
    await ierc721Contract.approve(BARTER_CONTRACT_ADDRESS, nftTokenId);
    
    // Barter.sol, now approved, trigger the NFT exchange
    const tx_2 = await barterContract.exchangeNFT(buyerAddr, selletAddr, nftContractAddr, nftTokenId, {from: buyerAddr, gasLimit: 5000000});

    return {
      success: true,
      status: `Hash: ${tx_2.hash} \n Successfully transferred NFT ${nftContractAddr} with tokenId ${nftTokenId} to ${selletAddr}`
    }

  } catch (error) {

    return {
      success: false,
      status: `An error occurred while exchanging your NFT: ${error}`
    }

  }
}

/**
 * 
 * @param nft 
 * @returns 
 * 
 * Function triggers transfer of NFT from buyer wallet to Barter contract
 * Barter.sol will hold the NFT as collateral until proper amount is paid to the store
 * 
 */
 export const collateralizeNFT = async (nft:any, product:Product, ethPrice:any) => {

  const buyerAddr = window.ethereum.selectedAddress;

  if (!buyerAddr) {
    return {
      success: false,
      status: `Error connecting your Wallet. Please try again.`
    }
  }

  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();

    const itemValueETH = (product.price / 100) / ethPrice;
    const itemValueWei = ethers.utils.parseEther(`${itemValueETH}`);
    console.log( `Item value in wei = ${itemValueWei}`);

    const nftContractAddr = nft.asset_contract.address; // NFT contract address
    const nftTokenId = nft.token_id; // NFT token id

    // Approve trade before attempting exchange using OpenZeppelin
    // OpenZeppelin IERC721 functions are embedded in NFT contract so the ABI is functional
    const ierc721Abi = IERC721ContractInfo.abi;
    const ierc721Contract = new ethers.Contract(nftContractAddr, ierc721Abi, signer);
    await ierc721Contract.approve(BARTER_CONTRACT_ADDRESS, nftTokenId);

    // Barter contract instance
    const barterContract = new ethers.Contract(BARTER_CONTRACT_ADDRESS, barterContractInfo.abi, signer);
    
    // Barter.sol, now approved, trigger the NFT exchange
    const tx_2 = await barterContract.collateralizedPurchase(
      buyerAddr,
      STORE_WALLET_ADDRESS,
      nftContractAddr,
      nftTokenId,
      itemValueWei,
      {
        from: buyerAddr,
        gasLimit: 8000000
      }
    );

    setOutstandingBalanceDoc(nft, product, ethPrice, signer);

    return {
      success: true,
      status: `Hash: ${tx_2.hash} \n Successfully transferred NFT ${nftContractAddr} with tokenId ${nftTokenId} to ${BARTER_CONTRACT_ADDRESS}`
    }

  } catch (error) {
    return {
      success: false,
      status: `An error occurred while exchanging your NFT: ${error}`
    }
  }
}

/**
 * 
 * @param nft 
 * @param product 
 * @param ethPrice 
 * @param signer 
 * 
 * Function writes the transaction above to a Firestore document for tracking
 * 
 */
export const setOutstandingBalanceDoc = async (nft:any, product:Product, ethPrice:any, signer:ethers.providers.JsonRpcSigner) => {

  const walletAddress = await signer.getAddress();
  const currTimestamp = getCurrentTimestamp();

  const productPriceEth = (product.price / 100) / ethPrice;

  const newOutstandingDocRef = db.collection("outstandingNftBalance").doc();

  const nftBalanceData = {
    balanceRemaining: productPriceEth,
    balanceStart: productPriceEth,
    buyerAddress: walletAddress,
    createdAt: currTimestamp,
    id: newOutstandingDocRef.id,
    nftContractAddress: nft.asset_contract.address,
    nftTokenId: nft.token_id,
    product: {
      description: product.description,
      id: product.id,
      isListed: product.isListed,
      name: product.name,
      price: product.price,
      productImageUrls: product.productImageUrls,
      quantity: product.quantity,
    },
    sellerAddress: STORE_WALLET_ADDRESS,
  }
  newOutstandingDocRef.set(nftBalanceData, { merge: true })
    .then(() => { })
    .catch((err:Error) => { })
};

/**
 * 
 * @param nft 
 * @returns 
 * 
 * Function allows user to repay in WETH to receive NFT again
 * 
 */
 export const repayStore = async (nft:any, paymentInETH:any) => {

  const buyerAddr = window.ethereum.selectedAddress;

  if (!buyerAddr) {
    return {
      success: false,
      status: `Error connecting your Wallet. Please try again.`
    }
  }

  try {  
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();

    const nftContractAddr = nft.asset_contract.address; // NFT contract address
    const nftTokenId = nft.token_id; // NFT token id

    const paymentInWei = ethers.utils.parseEther(`${paymentInETH}`);
    console.log( `Item value in wei = ${paymentInWei}`);

    // Approve trade before attempting exchange using OpenZeppelin
    const ierc20Abi = IERC20Contract.abi;
    const wethContract = new ethers.Contract(WETH_CONTRACT_ADDRESS, ierc20Abi, signer);
    await wethContract.approve(BARTER_CONTRACT_ADDRESS, paymentInWei);

    // Barter contract instance
    const barterContract = new ethers.Contract(BARTER_CONTRACT_ADDRESS, barterContractInfo.abi, signer);
    
    // TODO: ADD FIRESTORE FUNCTION TO RECORD THIS PAYMENT AND UPDATE THE BALANCE OF A PRODUCT

    // WETH addr now approved, trigger the WETH transfer
    const transferTx = await barterContract.repay(
      buyerAddr,
      nftContractAddr,
      nftTokenId,
      paymentInWei,
      { from: buyerAddr, gasLimit: 9000000 }
    );
    console.log(`repay transaction hash: ${transferTx.hash}`);
    console.log(`Buyer ${buyerAddr} paid ${paymentInETH} ETH to store ${STORE_WALLET_ADDRESS}`);

    return {
      success: true,
      status: `Hash: ${transferTx.hash} \n Successfully transferred NFT ${nftContractAddr} with tokenId ${nftTokenId} to ${BARTER_CONTRACT_ADDRESS}`
    }

  } catch (error) {

    return {
      successs: false,
      status: `An error occurred while exchanging your NFT: ${error}`
    }

  }
}

/**
 * 
 * @param nft 
 * @param product 
 * @param ethPrice 
 * @param signer 
 * 
 * Function decrements balance remaining on the outstanding balance
 * 
 */
 export const updateAndPayOutstandingBalance = async (paymentEth:any, docId:string) => {

  db.collection("outstandingNftBalance").doc(docId)
    .update({
      balanceRemaining: FieldValue.increment(-paymentEth),
     })
    .then(() => { })
    .catch((err:Error) => { })
};
