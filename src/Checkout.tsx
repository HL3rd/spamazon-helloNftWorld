import React, { useState } from 'react';
import { ethers } from 'ethers';

import NFTContainer from './NFTContainer';

const Checkout:React.FC = () => {

  const testWalletAddress = "0x60f80121c31a0d46b5279700f9df786054aa5ee5"

  const [errorMessage, setErrorMessage] = useState('');
  const [walletAddress, setWalletAddress] = useState(null);
  const [userBalance, setUserBalance] = useState('');
  const [nfts, setNfts] = useState([]);

  const connectWallet = () => {
    if ((window as any).ethereum) {
      (window as any).ethereum.request({ method: 'eth_requestAccounts'})
        .then((accounts:any) => {
          accountChangedHandler(accounts[0]);
        })
    } else {
      setErrorMessage('Please install Metamask');
    }
  }

  const accountChangedHandler = (newAccount:any) => {
    setWalletAddress(newAccount);
    getUserBalance(newAccount.toString());
    getNFTData(newAccount);
  }

  const getUserBalance = (address:any) => {
    (window as any).ethereum.request({method: 'eth_getBalance', params: [address, 'latest']})
      .then((balance:any) => {
          setUserBalance(ethers.utils.formatEther(balance));
      })
  }

  const getNFTData = async(address:any) => {

    const response = await fetch(`https://api.rarible.org/v0.1/items/byOwner/?owner=ETHEREUM:${testWalletAddress}`);

    const data = await response.json();

    setNfts(data.items);
  }

  const chainChangedHandler = (newChain:any) => {
    window.location.reload();
  }

  // Check if user changes their connected account
  (window as any).ethereum.on('accountChanged', accountChangedHandler);

  // If user changes testnets or test to devnet, reload site
  (window as any).ethereum.on('chainChanged', chainChangedHandler);

  return (
    <div>
      <h1>Checkout product</h1>
      <button onClick={connectWallet}>One-click barter</button>
      <div>
        <h3>Address: {walletAddress}</h3>
      </div>
      <div>
        <h3>Balance: { userBalance }</h3>
        <p>{errorMessage}</p>
      </div>
      <NFTContainer nfts={nfts} />
    </div>
  );
}

export default Checkout;