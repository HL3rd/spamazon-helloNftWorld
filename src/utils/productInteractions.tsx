import { Product } from '../constants/class-objects';
import { ethers } from 'ethers';

const BARTER_CONTRACT_ADDRESS = "0xc24afecb277Dd2f5b50b5B51f1fC9d5b8234101A";
const barterContractInfo = require('../artifacts/Barter.json');
const IERC721ContractInfo = require('../artifacts/IERC721.json');

const WETH_CONTRACT_ADDRESS = "0xc778417E063141139Fce010982780140Aa0cD5Ab";
const IERC20Contract = require('../artifacts/@openzeppelin/contracts/token/ERC20/IERC20.sol/IERC20.json');

const STORE_WALLET_ADDRESS = "0x2929C3c9805dD1A16546251b9b0B65583FD302c8"

declare var window: any;

/**
 * 
 * @returns ETH price in USD
 * 
 */
export const getETHPriceInUSD = async () => {
  const options = {
    method: 'GET',
  };
  const resp = await fetch('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD', options);
  const data = await resp.json();
  return data.USD;
}

/**
 * 
 * @param nft 
 * @returns 
 * 
 * Calls the OpenSea API to retrieve NFT collection slug
 * Then calls ethe OpenSea API with the slug to collect floor_price
 * 
 */
const openSeaCollectionFloorPrice = async (nft:any) => {
  const options = {
    method: 'GET'
  };

  // Query the asset to retrieve slug
  const assetResp = await fetch(`https://testnets-api.opensea.io/api/v1/asset/${nft.asset_contract.address}/${nft.token_id}/`, options)
  const assetData = await assetResp.json();

  const slug = assetData.collection.slug;

  console.log(`SLUG: ${slug}`);

  // Use collection slug to query proper eth floor price
  const collectionResp = await fetch(`https://testnets-api.opensea.io/api/v1/collection/${slug}/stats`, options);
  const collectionData = await collectionResp.json();

  console.log(`Got back this data from OpenSea: ${JSON.stringify(collectionData)}`);

  const floorPrice = collectionData.stats ? collectionData.stats.floor_price : 0;
  
  return floorPrice;
}

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
  
  console.log(`FINAL ETH PRICE AT PURCASE CHECK : ${ethPrice}`);

  // TODO: Place this call for ETH USD Price in Checkout page
  const floorPriceETH = await openSeaCollectionFloorPrice(nft);
  const floorPriceUSD = floorPriceETH * ethPrice;
  const prodPriceUSD = product.price / 100;

  if (floorPriceUSD > prodPriceUSD) {
    // Execute transfer
    console.log(`Can execute the trade!`);
    return {
      success: true,
      status: `About to transfer dis NFT`
    }
  } else {
    // Fail to transfer due to insuffient funds
    console.log(`Insufficient market value`);
    return {
      success: false,
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
 export const exchangeNFT = async (nft:any) => {

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
      successs: false,
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

    const nftContractAddr = nft.asset_contract.address; // NFT contract address
    const nftTokenId = nft.token_id; // NFT token id

    const testItemValueETH = (product.price / 100) / ethPrice;
    const testItemValueWei = ethers.utils.parseEther(`${testItemValueETH}`);
    console.log( `Item value in wei = ${testItemValueWei}`);

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
      testItemValueWei,
      {
        from: buyerAddr,
        gasLimit: 8000000
      }
    );

    return {
      success: true,
      status: `Hash: ${tx_2.hash} \n Successfully transferred NFT ${nftContractAddr} with tokenId ${nftTokenId} to ${BARTER_CONTRACT_ADDRESS}`
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