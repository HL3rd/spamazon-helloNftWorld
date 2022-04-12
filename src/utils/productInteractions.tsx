import { Product } from '../constants/class-objects';
import { ethers } from 'ethers';

const BARTER_CONTRACT_ADDRESS = "0xF908424ee606CCcF49d71a87Ab7AB874a39e9CbD";
const barterContractInfo = require('../artifacts/Barter.json');
const IERC721ContractInfo = require('../artifacts/IERC721.json');

const STORE_WALLET_ADDRESS = "0x2929C3c9805dD1A16546251b9b0B65583FD302c8"

declare var window: any;

export const ethPriceInUSD = async () => {
  const options = {
    method: 'GET',
  };
  const resp = await fetch('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD', options);
  const data = await resp.json();
  return data.USD;
}

const openSeaCollectionFloorPrice = async (nft:any) => {

  const address = nft.address;

  const options = {
    method: 'GET',
  };

  const assetResp = await fetch(`https://testnets-api.opensea.io/api/v1/asset/${nft.asset_contract.address}/${nft.token_id}/`, options)
  const assetData = await assetResp.json();

  const floorPrice = assetData.collection.stats.floor_price ? assetData.stats.floor_price : 0;

  return floorPrice;
}

export const canPurchaseCheck = async (nft:any, product:Product) => {

  const floorPriceETH = await openSeaCollectionFloorPrice(nft);
  const usdEthPrice = await ethPriceInUSD();
  const floorPriceUSD = floorPriceETH * usdEthPrice;
  const usdPrice = product.price / 100;

  if (floorPriceUSD > usdPrice) {
    // Execute transfer

  } else {
    // Failed, cannot purchase
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
 export const transferNft = async (nft:any) => {

  const buyerAddr = window.ethereum.selectedAddress;

  if (!buyerAddr) { console.log(`Error, no selected wallet address`); return; }

  // Provider
  // @ts-ignore
  // const alchemyProvider = new ethers.providers.AlchemyProvider(network="rinkeby", ALCHEMY_KEY);
  // Signer
  // const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);

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
  const tx_1 = await ierc721Contract.approve(BARTER_CONTRACT_ADDRESS, nftTokenId);
  console.log(`approve transaction: ${tx_1.hash}`);
  
  // Barter.sol, now approved, trigger the NFT exchange
  const tx_2 = await barterContract.exchangeNFT(buyerAddr, selletAddr, nftContractAddr, nftTokenId, {from: buyerAddr, gasLimit: 5000000});
  console.log(`exchangeNFT transaction: ${tx_2.hash}`);
  console.log(`Should now check ${selletAddr} to see if NFT ${nftContractAddr} with tokenId ${nftTokenId} transferred`); 
}