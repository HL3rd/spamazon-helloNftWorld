require('dotenv').config();

import { pinJSONToIPFS } from './pinata';

const alchemyKey = process.env.REACT_APP_ALCHEMY_URL;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

// MintNft.sol Contract info
const mintNftABI = require('../artifacts/contract-abi.json');
const nftMinterContractAddress = "0x1B90d069Cda761e669d8270a0fb4e01075D7b8A2"; //"0x08207fE7F1f7C9f1c39e4720b9F7Bfe2AfD01907";

declare var window: any;

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

  console.log(`NFT Minter Address: ${nftMinterContractAddress}`)
  console.log(`Seleceted Address: ${window.ethereum.selectedAddress}`)
  
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