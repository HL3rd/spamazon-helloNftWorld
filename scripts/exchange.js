require('dotenv').config();
const ALCHEMY_KEY = process.env.REACT_APP_ALCHEMY_KEY;
const PRIVATE_KEY = process.env.REACT_APP_PRIVATE_KEY;

const { ethers } = require('hardhat');

// Barter.sol Contract setup
const BARTER_CONTRACT_ADDRESS = "0xF908424ee606CCcF49d71a87Ab7AB874a39e9CbD";
const contract = require('../artifacts/contracts/Barter.sol/Barter.json');
const IERC721Contract = require('../artifacts/@openzeppelin/contracts/token/ERC721/IERC721.sol/IERC721.json');

// Provider
const alchemyProvider = new ethers.providers.AlchemyProvider(network="rinkeby", ALCHEMY_KEY);

// Signer
const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);

// contract instance
const barterContract = new ethers.Contract(BARTER_CONTRACT_ADDRESS, contract.abi, signer);

async function main() {
  
  const testBuyerAddr = "0x52554BfE4baC4aE605Af27A2e131480F2D219Fe6"; // transfers the NFT token
  const testNftContractAddr = "0x08207fe7f1f7c9f1c39e4720b9f7bfe2afd01907"; // NFT contract address
  const testTokenId = 8; // NFT token id
  const testSellerAddr = "0x6E9190A074371C3A1b96120D2b1A3834D9d51F64"; // receives the NFT token
  
  // Approve trade before attempting exchange using OpenZeppelin
  // OpenZeppelin IERC721 functions are embedded in NFT contract so the ABI is functional
  const ierc721Abi = IERC721Contract.abi;
  const ierc721Contract = new ethers.Contract(testNftContractAddr, ierc721Abi, signer);
  const tx_1 = await ierc721Contract.approve(BARTER_CONTRACT_ADDRESS, testTokenId);
  console.log(`approve transaction: ${tx_1.hash}`);
  
  // Barter.sol, now approved, trigger the NFT exchange
  const tx_2 = await barterContract.exchangeNFT(testBuyerAddr, testSellerAddr, testNftContractAddr, testTokenId, {from: testBuyerAddr, gasLimit: 5000000});
  console.log(`exchangeNFT transaction: ${tx_2.hash}`);
  console.log(`Should now check ${testSellerAddr} to see if NFT ${testNftContractAddr} with tokenId ${testTokenId} transferred`); 
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });