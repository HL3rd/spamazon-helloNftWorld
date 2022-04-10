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

  // Need:
  /**
   * Need:
   * - Test seller address to send: 0x6E9190A074371C3A1b96120D2b1A3834D9d51F64
   * - Buyer address (currentWallet: 0x52554BfE4baC4aE605Af27A2e131480F2D219Fe6)
   * - NFTContractAddress
   * - TokenID
   * function exchangeNFT(
        address _buyer,
        address _seller,
        address _collection, 
        uint256 _tokenID
   * )
   * 
   */

  const testBuyerAddr = "0x52554BfE4baC4aE605Af27A2e131480F2D219Fe6";
  const testSellerAddr = "0x6E9190A074371C3A1b96120D2b1A3834D9d51F64";
  const testNftContractAddr = "0x08207fe7f1f7c9f1c39e4720b9f7bfe2afd01907";
  const testTokenId = 1; // Life is good

  // Approve trade before attempting exchange
  const ierc721Abi = IERC721Contract.abi;
  const ierc721Interface = new ethers.utils.Interface(ierc721Abi);
  const ierc721Contract = new ethers.Contract(testNftContractAddr, ierc721Abi, signer);

  const firsty = await ierc721Contract.approve(BARTER_CONTRACT_ADDRESS, testTokenId, {from: testBuyerAddr});
  console.log(`Go this first approval transaction: ${JSON.stringify(firsty)}`);
  
  console.log(`Sending NFT: ${testNftContractAddr}, id ${testTokenId} over to ${testSellerAddr}`);
  const tx = await barterContract.exchangeNFT(testBuyerAddr, testSellerAddr, testNftContractAddr, testTokenId, {from: testBuyerAddr, gasLimit: 5000000});
  await tx.wait();
  console.log(`Should now check ${testSellerAddr} to see if NFT ${testNftContractAddr} with tokenId ${testTokenId} transferred`); 

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });