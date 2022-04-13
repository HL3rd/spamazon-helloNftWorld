require('dotenv').config();
const ALCHEMY_KEY = process.env.REACT_APP_ALCHEMY_KEY;
const PRIVATE_KEY = process.env.REACT_APP_PRIVATE_KEY;

const { ethers } = require('hardhat');

// Buyer and seller
const BUYER_ADDRESS = "0x52554BfE4baC4aE605Af27A2e131480F2D219Fe6";

// Barter.sol Contract setup
const BARTER_CONTRACT_ADDRESS = "0xc24afecb277Dd2f5b50b5B51f1fC9d5b8234101A";
const NFT_CONTRACT_ADDRESS = "0x08207fe7f1f7c9f1c39e4720b9f7bfe2afd01907";
const TOKEN_ID = 11;

const contract = require('../artifacts/contracts/Barter.sol/Barter.json');

// Provider
const alchemyProvider = new ethers.providers.AlchemyProvider(network="rinkeby", ALCHEMY_KEY);

// Signer
const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);

// contract instance
const barterContract = new ethers.Contract(BARTER_CONTRACT_ADDRESS, contract.abi, signer);

/**
 * returns value owed on a specific NFT used as collateral
 */
async function main () {

  // Barter.sol, now approved, trigger the WETH transfer
  const amountInWei = await barterContract.valueBorrowedOneNFT(
    BUYER_ADDRESS,
    NFT_CONTRACT_ADDRESS,
    TOKEN_ID,
  );

  const amountInETH = amountInWei / Math.pow(10, 18);
  
  console.log(`Buyer ${BUYER_ADDRESS} still owes ${amountInWei} Wei (${amountInETH} ETH) \n on NFT ${NFT_CONTRACT_ADDRESS}, ${TOKEN_ID}`);

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });