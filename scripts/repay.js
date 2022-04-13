require('dotenv').config();
const ALCHEMY_KEY = process.env.REACT_APP_ALCHEMY_KEY;
const PRIVATE_KEY = process.env.REACT_APP_PRIVATE_KEY;

const { ethers } = require('hardhat');

// Barter.sol Contract setup
const BARTER_CONTRACT_ADDRESS = "0xc24afecb277Dd2f5b50b5B51f1fC9d5b8234101A";
const contract = require('../artifacts/contracts/Barter.sol/Barter.json');

const WETH_CONTRACT_ADDRESS = "0xc778417E063141139Fce010982780140Aa0cD5Ab";
const IERC20Contract = require('../artifacts/@openzeppelin/contracts/token/ERC20/IERC20.sol/IERC20.json');

// Provider
const alchemyProvider = new ethers.providers.AlchemyProvider(network="rinkeby", ALCHEMY_KEY);

// Signer
const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);

// contract instance
const barterContract = new ethers.Contract(BARTER_CONTRACT_ADDRESS, contract.abi, signer);

async function main() {
  
  const testBuyerAddr = "0x52554BfE4baC4aE605Af27A2e131480F2D219Fe6";
  const testSellerAddr = "0x6E9190A074371C3A1b96120D2b1A3834D9d51F64";
  const testNftContractAddr = "0x08207fe7f1f7c9f1c39e4720b9f7bfe2afd01907"; // NFT contract address
  const testTokenId = 11;  // NFT token id
  const testItemValueETH = 1;
  const testPayCount = 3;
  const testPaymentValueWei = ethers.utils.parseEther(`${testItemValueETH / testPayCount}`);
  console.log( `payment value in wei = ${testPaymentValueWei}`);
  
  // Approve trade before attempting exchange using OpenZeppelin
  const ierc20Abi = IERC20Contract.abi;
  const wethContract = new ethers.Contract(WETH_CONTRACT_ADDRESS, ierc20Abi, signer);
  const tx_1 = await wethContract.approve(BARTER_CONTRACT_ADDRESS, testPaymentValueWei);
  console.log(`approve transaction hash: ${tx_1.hash}`);
  
  // WETH addr now approved, trigger the WETH transfer
  const tx_2 = await barterContract.repay(
    testBuyerAddr,
    testNftContractAddr,
    testTokenId,
    testPaymentValueWei,
    { from: testBuyerAddr, gasLimit: 9000000 }
  );
  console.log(`repay transaction hash: ${tx_2.hash}`);
  console.log(`Buyer ${testBuyerAddr} paid ${testItemValueETH / testPayCount} ETH \n to ${testSellerAddr} via contract ${BARTER_CONTRACT_ADDRESS}`); 
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });