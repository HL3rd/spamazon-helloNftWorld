const API_KEY = process.env.REACT_APP_ALCHEMY_KEY;
const PRIVATE_KEY = process.env.REACT_APP_PRIVATE_KEY;

const BARTER_ADDRESS = "0xF908424ee606CCcF49d71a87Ab7AB874a39e9CbD";
const WETH_CONTRACT_ADDRESS = "0xc778417E063141139Fce010982780140Aa0cD5Ab";

const { ethers } = require("hardhat");

const contract = require("../artifacts/contracts/Barter.sol/Barter.json");

// Provider - Alchemy
const alchemyProvider = new ethers.providers.AlchemyProvider(network="rinkeby", API_KEY);

// Signer - You
const signer  = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);

const barterContract = new ethers.Contract(BARTER_ADDRESS)

async function interact() {
  

}