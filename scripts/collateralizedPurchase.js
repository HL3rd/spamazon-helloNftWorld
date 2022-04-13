require('dotenv').config();
const ALCHEMY_KEY = process.env.REACT_APP_ALCHEMY_KEY;
const PRIVATE_KEY = process.env.REACT_APP_PRIVATE_KEY;

const { ethers } = require('hardhat');

// Barter.sol Contract setup
const BARTER_CONTRACT_ADDRESS = "0xc24afecb277Dd2f5b50b5B51f1fC9d5b8234101A";
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
  const testSellerAddr = "0x6E9190A074371C3A1b96120D2b1A3834D9d51F64"; // receives the NFT token
  const testNftContractAddr = "0x08207fe7f1f7c9f1c39e4720b9f7bfe2afd01907"; // NFT contract address
  const testTokenId = 11;  // NFT token id
  const testItemValueETH = 1;
  const testItemValueWei = ethers.utils.parseEther(`${testItemValueETH}`)
  console.log( `Item value in wei = ${testItemValueWei}`);
  
  // Approve trade before attempting exchange using OpenZeppelin
  // OpenZeppelin IERC721 functions are embedded in NFT contract so the ABI is functional
  const ierc721Abi = IERC721Contract.abi;
  const ierc721Contract = new ethers.Contract(testNftContractAddr, ierc721Abi, signer);
  const tx_1 = await ierc721Contract.approve(BARTER_CONTRACT_ADDRESS, testTokenId);
  console.log(`approve transaction: ${tx_1.hash}`);
  
  // Barter.sol, now approved, trigger the NFT exchange
  const tx_2 = await barterContract.collateralizedPurchase(
    testBuyerAddr,
    testSellerAddr,
    testNftContractAddr,
    testTokenId,
    testItemValueWei,
    {
      from: testBuyerAddr,
      gasLimit: 8000000
    });
  console.log(`collateralized purchase transaction: ${tx_2.hash}`);
  console.log(`Contract ${BARTER_CONTRACT_ADDRESS} now holds NFT ${testNftContractAddr}, tokenId ${testTokenId} as collateral for ${testSellerAddr}`); 
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });