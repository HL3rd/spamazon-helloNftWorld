import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { connectWallet } from './utils/interact';
import { formatStripeToUSDString } from './utils/format';

import NFTContainer from './NFTContainer';

import { getNFTData, getETHPriceInUSD } from './queries/NftData';

import { Product } from './constants/class-objects';

import Navbar from './components/Navbar';
import NFTContainer from './NFTContainer';
import PurchaseModal from './components/PurchaseModal';

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

  // Front end state vars
  const [currentImage, setCurrentImage] = useState(testProduct.productImageUrls[0]);
  // Wallet state vars
  const [errorMessage, setErrorMessage] = useState('');
  const [walletAddress, setWalletAddress] = useState(null);
  const [userBalance, setUserBalance] = useState('');
  // NFT Purchase state vars
  const [callingNfts, setCallingNfts] = useState(false);
  const [nfts, setNfts] = useState([]);
  const [ethPrice, setETHPrice] = useState(null);
  const [isInstantBarter, setInstantBarter] = useState(false);
  // Modal visibility
  const [nftsVisible, setNftsVisible] = useState(false);  // When true, shows Choose NFTs Modal
  const [selectedNft, setSelectedNft] = useState(null);   // When true, shows Purchase Modal

  const checkoutClicked = async (instant:boolean) => {

    // Connect Wallet if needed
    const resp:any = await connectWallet();
    const addr = resp.address;
    if (addr !== "") {
      accountChangedHandler(addr);
    } else {
      setErrorMessage(resp.status)
    }

    setInstantBarter(instant);
    setNftsVisible(true);
  }

  const accountChangedHandler = async (newAccount:any) => {
    setWalletAddress(newAccount);
    getUserBalance(newAccount.toString());

    if (!callingNfts) {
      const nftResp = await getNFTData(newAccount);
      setCallingNfts(false);
      setNfts(nftResp);
    }
  }

  const getUserBalance = (address:any) => {
    (window as any).ethereum.request({method: 'eth_getBalance', params: [address, 'latest']})
      .then((balance:any) => {
          setUserBalance(ethers.utils.formatEther(balance));
      })
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
            <p style={{ textAlign: 'left' }}>{testProduct.price}</p>
            <p style={{ textAlign: 'left' }}>FREE delivery <strong>to the Metaverse.</strong></p>
            <button disabled={ethPrice == null} onClick={() => checkoutClicked(true)} className="buy-btn">One-click barter</button>
            <button disabled={ethPrice == null} onClick={() => checkoutClicked(false)} className="sell-btn">Dump now, pay later</button>
          </div>
        </div>
      {nftsVisible &&
        <div id="overlay">
          <NFTContainer
            nfts={nfts}
            selectedNft={selectedNft}     // If present, the other Barter buttons on Cards are disabled
            setNftsVisible={setNftsVisible}
            setSelectedNft={setSelectedNft}
          />
        </div>}
        {selectedNft &&
        <div id="purchaseOverlay">
          <PurchaseModal
            selectedNft={selectedNft}
            product={testProduct}
            ethPrice={ethPrice}
            isInstantBarter={isInstantBarter}
            setSelectedNft={setSelectedNft}
          />
        </div>}
      </div>

      <div>
        <h2>Ayo? Tryna Mint?</h2>
        <h3><a href="/minter">Minter</a></h3>
      </div>
            
    </body>
  );
}

export default Checkout;