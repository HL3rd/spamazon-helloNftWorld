import React, { useState } from 'react';
import { ethers } from 'ethers';

import { connectWallet } from './utils/interact';

import NFTContainer from './NFTContainer';

import { Product, ProductOrder } from './constants/class-objects';

const Checkout:React.FC = () => {

  const testProduct:Product = {
    description: 'A new revolutionary product A new revolutionary product A new revolutionary product A new revolutionary product A new revolutionary product A new revolutionary product A new revolutionary product',
    productImageUrls: ['https://images-na.ssl-images-amazon.com/images/I/91TvWl33h4L.jpg', "https://i.kym-cdn.com/entries/icons/mobile/000/006/026/NOTSUREIF.jpg", "https://i.kym-cdn.com/entries/icons/mobile/000/006/026/NOTSUREIF.jpg"],
    id: '00000',
    isListed: true,
    name: 'Guide to the Universe Book',
    price: 10000,
    quantity: 100,
  }

  // NOTE: THIS IS THE TEST WALLET ADDRESS FROM THIS DOCUMENTATION:
  // https://api.rarible.org/v0.1/doc#operation/getItemsByOwner
  const testWalletAddress = "0x60f80121c31a0d46b5279700f9df786054aa5ee5"

  const [errorMessage, setErrorMessage] = useState('');
  const [walletAddress, setWalletAddress] = useState(null);
  const [userBalance, setUserBalance] = useState('');
  const [nfts, setNfts] = useState([]);

  const connectWalletCheckout = async () => {

    const resp:any = await connectWallet();
    const addr = resp.address;

    if (addr !== "") {
      accountChangedHandler(addr);
    } else {
      setErrorMessage(resp.status)
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

    // TODO: Use this for production/mainnet API
    // const options = {
    //   method: 'GET',
    //   headers: {Accept: 'application/json', 'X-API-KEY': ''},
    // };
    const options = {
      method: 'GET',
    };
    
    const response = await fetch(`https://rinkeby-api.opensea.io/api/v1/assets?owner=${address}&order_direction=desc&offset=0&limit=20`, options);
    const data = await response.json();

    if (data === undefined || data === null) {
      setErrorMessage(`NFTs not found`);
    } else {
      setNfts(data.assets);
    }
  }

  const chainChangedHandler = (newChain:any) => {
    window.location.reload();
  }

  // Check if user changes their connected account
  (window as any).ethereum.on('accountChanged', accountChangedHandler);

  // If user changes testnets or test to devnet, reload site
  (window as any).ethereum.on('chainChanged', chainChangedHandler);

  return (
    <body>
      <div className="top">
        <a href="/">
          <div>
            <h1 className="brand">SPAMAZON</h1>
          </div>
        </a>

        <div className="user-info">
          <p>Wallet Address: {walletAddress}</p>
          <p>Wallet Balance: {userBalance}</p>
          <p>{errorMessage}</p>
        </div>

        <a href="/checkout">
          <div>
            <h2 className="checkout">Checkout</h2>
          </div>
        </a>
      </div>

      <div className="second-top">
        <h3>Spam</h3>
        <h3>Spam</h3>
        <h3>Spam</h3>
        <h3>Spam</h3>
        <h3>Spam</h3>
        <h3>Spam</h3>
        <h3>Spam</h3>
        <h3>Spam</h3>
        <h3>Spam</h3>
        <h3>Spam</h3>
        <h3>Spam</h3>
        <h3>Spam</h3>
        <h3>Spam</h3>
      </div>

      <div className="fourth-top">
        <h2>Checkout Product</h2>
      </div>


      <div className="sell-content">
        <div className="sell-cols">

          <div className="far-left-col">
            <img className="highlight-img" alt="product-img" width="100px" height="100px" src={testProduct.productImageUrls[0]} />
            <img className="highlight-img" alt="product-img" width="100px" height="100px" src={testProduct.productImageUrls[1]} />
            <img className="highlight-img" alt="product-img" width="100px" height="100px" src={testProduct.productImageUrls[2]} />
          </div>

          <div className="center-left-col">
            <img alt="product-img" src={testProduct.productImageUrls[0]} />
          </div>

          <div className="center-right-col">
            <h2 className="product-name">{testProduct.name}</h2>
            <p className="product-price">{testProduct.price}</p>
            <p className="product-description">{testProduct.description}</p>
          </div>

          <div className="far-right-col">
            <button onClick={connectWalletCheckout} className="buy-btn">One-click barter</button>
          </div>

        </div>
      </div>

      <div className="add-space">
        <h2></h2>
      </div>


      <div className="fifth-top">
        <h2>Your NFTs</h2>
      </div>

      <div className="nft-content">
        <NFTContainer nfts={nfts} />
      </div>

      <div>
        <h2>Ayo? Tryna Mint?</h2>
        <h3><a href="/minter">Minter</a></h3>
      </div>

        
      
    </body>






    // <div>
    //   <h1>Checkout product</h1>
    //   <img alt="product-img" width="20%" src={testProduct.productImageUrls[0]} />
    //   <h2>{testProduct.name}</h2>
    //   <p>{testProduct.description}</p>
    //   <p>{testProduct.price}</p>
    //   <button onClick={connectWalletCheckout}>One-click barter</button>
    //   <div>
    //     <p>Address: {walletAddress}</p>
    //   </div>
    //   <div>
    //     <p>Balance: { userBalance }</p>
    //     <p>{errorMessage}</p>
    //   </div>
    //   <div>
    //     <h2>Ayo? Tryna Mint?</h2>
    //     <h3><a href="/minter">Minter</a></h3>
    //   </div>
    //   <div>
    //     <h2>Your NFTs</h2>
    //     <NFTContainer nfts={nfts} />
    //   </div>
    // </div>
  );
}

export default Checkout;