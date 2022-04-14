import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

import { connectWallet } from './utils/interact';
import { getETHPriceInUSD } from './utils/productInteractions';
import { formatStripeToUSD } from './utils/format';

import Navbar from './components/Navbar';
import NFTContainer from './NFTContainer';

import { Product } from './constants/class-objects';

const Checkout:React.FC = () => {

  const testProduct:Product = {
    description: 'A new revolutionary product A new revolutionary product A new revolutionary product A new revolutionary product A new revolutionary product A new revolutionary product A new revolutionary product',
    productImageUrls: ['https://images-na.ssl-images-amazon.com/images/I/91TvWl33h4L.jpg', "https://i.kym-cdn.com/entries/icons/mobile/000/006/026/NOTSUREIF.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Giraffa_camelopardalis_angolensis.jpg/1024px-Giraffa_camelopardalis_angolensis.jpg"],
    id: '00000',
    isListed: true,
    name: 'Guide to the Universe Book',
    price: 10000,
    quantity: 100,
  };

  const [errorMessage, setErrorMessage] = useState('');
  const [walletAddress, setWalletAddress] = useState(null);
  const [userBalance, setUserBalance] = useState('');
  const [nfts, setNfts] = useState([]);
  const [ethPrice, setETHPrice] = useState();
  const [currentImage, setCurrentImage] = useState(testProduct.productImageUrls[0]);

  const connectWalletCheckout = async () => {

    document.getElementById('overlay')!.style.opacity = "1"; // added for overlay
    document.getElementById('overlay')!.style.height = "80vh";
    document.getElementById('overlay')!.style.width = "100%";
    let myContainer = document.getElementById('switching-title') as HTMLInputElement;
    myContainer.innerHTML = "Your NFTs";

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

  // NFTs will not show until ETH price is set
  const callEthPriceCheck = async () => {
    const price = await getETHPriceInUSD();
    setETHPrice(price);
  };

  const imageClick = (clickedUrl:string) => {
    setCurrentImage(clickedUrl);
  };

  useEffect(() => {
    callEthPriceCheck();
  }, []);

  return (
    <body>
      <Navbar walletAddress={walletAddress} userBalance={userBalance} errorMessage={errorMessage} />
      <div className="sell-content">
        <div className="sell-cols">

          <div className="far-left-col">
            <img onClick={() => imageClick(testProduct.productImageUrls[0])} className="highlight-img" alt="product-img" width="100px" height="100px" src={testProduct.productImageUrls[0]} />
            <img onClick={() => imageClick(testProduct.productImageUrls[1])} className="highlight-img" alt="product-img" width="100px" height="100px" src={testProduct.productImageUrls[1]} />
            <img onClick={() => imageClick(testProduct.productImageUrls[2])} className="highlight-img" alt="product-img" width="100px" height="100px" src={testProduct.productImageUrls[2]} />
          </div>

          <div className="center-left-col">
            <img alt="product-img" src={currentImage} />
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


        <div id="overlay">
          {ethPrice && <div>
            <NFTContainer nfts={nfts} product={testProduct} ethPrice={ethPrice} />
          </div> }
        </div>
      </div>

      {/* <div className="add-space">
        <h2></h2>
      </div>


      <div className="fifth-top">
        <h2>Your NFTs</h2>
      </div>

      {ethPrice && <div className="nft-content">
        <NFTContainer nfts={nfts} product={testProduct} ethPrice={ethPrice} />
      </div> } */}

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