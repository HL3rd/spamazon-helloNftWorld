import { pinJSONToIPFS } from './pinata';
import { ethers } from 'ethers';

require('dotenv').config();

const PRIVATE_KEY = process.env.REACT_APP_PRIVATE_KEY;

const alchemyKey = process.env.REACT_APP_ALCHEMY_URL;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);


declare var window: any;

// MintNft.sol Contract info
const mintNftABI = require('../artifacts/contract-abi.json');
const nftMinterContractAddress = "0x08207fE7F1f7C9f1c39e4720b9F7Bfe2AfD01907";

// Barter.sol Contract info
const BARTER_CONTRACT_ADDRESS = "0xF908424ee606CCcF49d71a87Ab7AB874a39e9CbD";
const barterContractInfo = require('../artifacts/Barter.json');
const IERC721ContractInfo = require('../artifacts/IERC721.json');

// TODO: Change to something else in the future
const STORE_WALLET_ADDRESS = "0x2929C3c9805dD1A16546251b9b0B65583FD302c8"

export const mintNFT = async (url:string, name:string, description:string) => {

  //error handling
  if (url.trim() === "" || (name.trim() === "" || description.trim() === "")) { 
    return {
      success: false,
      status: "❗Please make sure all fields are completed before minting.",
    }
  }

  // make metadata
  /* eslint-disable */
  const metadata:any = new Object();
  metadata.name = name;
  metadata.image = url;
  metadata.description = description;

  //make pinata call
  const pinataResponse = await pinJSONToIPFS(metadata);
  if (!pinataResponse.success) {
      return {
          success: false,
          status: "😢 Something went wrong while uploading your tokenURI.",
      }
  } 
  const tokenURI = pinataResponse.pinataUrl;

  window.contract = await new web3.eth.Contract(mintNftABI, nftMinterContractAddress);

  const transactionParameters = {
    to: nftMinterContractAddress,    // Required except during contract publications.
    from: window.ethereum.selectedAddress,    // must match user's active address.
    'data': window.contract.methods.mintNFT(window.ethereum.selectedAddress, tokenURI).encodeABI() // make call to NFT smart contract
  }

  try {
    // Make the await call where we ask Metamask to sign the txn
    const txHash = await window.ethereum
        .request({
          method: 'eth_sendTransaction',
          params: [transactionParameters],
        });
    return {
        success: true,
        status: "✅ Check out your transaction on Etherscan: https://rinkeby.etherscan.io/tx/" + txHash
    }
  } catch (error:any) {
    return {
      success: false,
      status: "😥 Something went wrong: " + error.message
    }
  }

}

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
  const alchemyProvider = new ethers.providers.AlchemyProvider(network="rinkeby", ALCHEMY_KEY);
  // Signer
  const signer = window.ethereum.selectedAddress;

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

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const obj = {
        status: "👆🏽 Write a message in the text-field above.",
        address: addressArray[0],
      };
      return obj;
    } catch (err:any) {
      return {
        address: "",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" rel="noreferrer" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};

export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          status: "👆🏽 Write a message in the text-field above.",
        };
      } else {
        return {
          address: "",
          status: "🦊 Connect to Metamask using the top right button.",
        };
      }
    } catch (err:any) {
      return {
        address: "",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" rel="noreferrer" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};