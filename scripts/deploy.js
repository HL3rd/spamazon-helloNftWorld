/**
 * NOTE: MyNFT was a test contract that was deployed to create NFT test data
 * The deployments for Math.sol and Barter.sol were done in another project.
 * Since the contracts are already deployed on Rinkeby, there was no need to deploy
 * them again here.
 */

const { ethers } = require("hardhat");

async function main() {
  // Grab the contract factory 
  const MyNFT = await ethers.getContractFactory("MyNFT");

  // Start deployment, returning a promise that resolves to a contract object
  const myNFT = await MyNFT.deploy(); // Instance of the contract 
  console.log("Contract deployed to address:", myNFT.address);
}

main()
 .then(() => process.exit(0))
 .catch(error => {
   console.error(error);
   process.exit(1);
 });