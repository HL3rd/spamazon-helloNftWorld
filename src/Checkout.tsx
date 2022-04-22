import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ethers } from 'ethers';
import { connectWallet } from './utils/interact';
import { formatStripeToUSDString } from './utils/format';

import { getNFTData, getETHPriceInUSD } from './queries/NftData';
import { queryProductDoc } from './queries/FirebaseQueries';

import { Product } from './constants/class-objects';

import Navbar from './components/Navbar';
import NFTContainer from './NFTContainer';
import PurchaseModal from './components/PurchaseModal';

const Checkout:React.FC = () => {

  let { productId } = useParams();

  // Front end state vars
  const [currentProduct, setCurrentProduct] = useState<Product|null>();
  const [currentImage, setCurrentImage] = useState('');
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
    console.log(`BAMMM${addr}`);
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
    getUserBalance(newAccount);

    if (!callingNfts && newAccount) {
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
  if ((window as any).ethereum !== undefined) { (window as any).ethereum.on('accountChanged', accountChangedHandler) };

  // If user changes testnets or test to devnet, reload site
  if ((window as any).ethereum !== undefined) { (window as any).ethereum.on('chainChanged', chainChangedHandler) };

  // NFTs will not show until ETH price is set
  const callEthPriceCheck = async () => {
    const price = await getETHPriceInUSD();
    setETHPrice(price);
  };

  // Grabs the product id in the path name and calls the product
  const renderCurrentProduct = async () => {

    console.log(`PRODUCT ID: ${productId}`);

    if (productId == undefined) {
      console.log(`Head home`);
      return;
    }

    const product = await queryProductDoc(productId);

    // If query returns nothing --> Home
    if (product == undefined) {
      // TODO: enter the Home router
      console.log(`HEAD HOME`);
      return;
    }

    setCurrentProduct(product);
    setCurrentImage(product.productImageUrls[0]);
    
  };

  const imageClick = (clickedUrl:string) => {
    setCurrentImage(clickedUrl);
  };

  useEffect(() => {
    renderCurrentProduct();
    callEthPriceCheck();
  }, []);

  return (
    <div>
      <Navbar walletAddress={walletAddress} userBalance={userBalance} title={"Checkout"} errorMessage={errorMessage} />
      <div className="sell-content">
      {currentProduct &&
      <div className="sell-cols">

          <div className="far-left-col">
            { currentProduct.productImageUrls.map((url:string, index:any) => {
              return <img key={index} onClick={() => imageClick(url)} className="highlight-img" alt="preview-img" width="100px" height="100px" src={url} />
            })}
          </div>

          <div className="center-left-col">
            <img alt="product-img" src={currentImage} />
          </div>

          <div className="center-right-col">
            <h2 className="product-name">{currentProduct.name}</h2>
            <p className="product-price">{formatStripeToUSDString(currentProduct.price)}</p>
            <p className="product-description">{currentProduct.description}</p>
          </div>

          <div className="far-right-col">
            <p style={{ textAlign: 'left' }}>{formatStripeToUSDString(currentProduct.price)}</p>
            <p style={{ textAlign: 'left' }}>FREE delivery to<strong> the Metaverse.</strong></p>
            <button disabled={ethPrice == null} onClick={() => checkoutClicked(true)} className="buy-btn">One-click barter</button>
            <button disabled={ethPrice == null} onClick={() => checkoutClicked(false)} className="sell-btn">Dump now, pay later</button>
          </div>
        </div>}
      {nftsVisible &&
        <div id="overlay">
          <NFTContainer
            nfts={nfts}
            selectedNft={selectedNft}     // If present, the other Barter buttons on Cards are disabled
            setNftsVisible={setNftsVisible}
            setSelectedNft={setSelectedNft}
          />
        </div>}
        {selectedNft && currentProduct &&
        <div id="purchaseOverlay">
          <PurchaseModal
            selectedNft={selectedNft}
            product={currentProduct}
            ethPrice={ethPrice}
            isInstantBarter={isInstantBarter}
            setSelectedNft={setSelectedNft}
          />
        </div>}
      </div>          
    </div>
  );
}

export default Checkout;