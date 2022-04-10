const ALCHEMY_KEY = process.env.REACT_APP_ALCHEMY_KEY;
const PRIVATE_KEY = process.env.REACT_APP_PRIVATE_KEY;

const { ethers } = require('hardhat');

// Barter.sol Contract setup
const BARTER_CONTRACT_ADDRESS = "0xF908424ee606CCcF49d71a87Ab7AB874a39e9CbD";
const contract = require('../artifacts/contracts/Barter.sol/Barter.json');

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
  const testContractAddr = "0x08207fe7f1f7c9f1c39e4720b9f7bfe2afd01907";
  const testTokenId = "1"; // Life is good

  
  console.log(`Sending NFT: ${testContractAddr}, id ${testTokenId} over to ${testSellerAddr}`);
  const tx = await barterContract.exchangeNFT(testBuyerAddr, testSellerAddr, testContractAddr, testTokenId, {gasLimit: 5000000});
  await tx.wait();
  console.log(`Should now check ${testSellerAddr} to see if NFT ${testContractAddr} with tokenId ${testTokenId} transferred`); 

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });