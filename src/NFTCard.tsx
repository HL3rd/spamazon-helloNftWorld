import React, { useState } from 'react';
import { Product } from './constants/class-objects';
import { canPurchaseCheck, collateralizeNFT, instantBarterNFT } from './utils/productInteractions';
import { formatShortenContract } from './utils/format';
import { db, FieldValue } from './utils/firebase';

interface NFTCardProps {
  nft: any,
  product: Product,
  ethPrice: any,
  isInstantBarter: boolean
}

const NFTCard:React.FC<NFTCardProps> = ({ nft, product, ethPrice, isInstantBarter }) => {

  const [status, setStatus] = useState("");
  const [purchaseInProgress, setPurchaseInProgress] = useState(false);

  // Function checks OpenSea floor price and executes instant trade if value is > product price
  const executeInstantBarter = async (nft:any, product:Product, ethPrice:any) => {

    const checkResp = await canPurchaseCheck(nft, product, ethPrice);

    setStatus(checkResp.status);
    if (checkResp.success) {
      const transferResp = await instantBarterNFT(nft);
      setStatus(transferResp.status);
      setPurchaseInProgress(false);
    }

    setPurchaseInProgress(false);

    // TODO: Refresh NFTs

  };

  // Item trades the nft and sets outstanding bartering value
  const executeCollateralizedPurchase = async (nft:any, product:Product, ethPrice:any) => {
    const collateralResp = await collateralizeNFT(nft, product, ethPrice);
    setStatus(collateralResp.status);
    setPurchaseInProgress(false);

    // TODO: Refresh NFTs
  };

  // Executed upon button click, depending the option chosen in the Checkout, 
  // that subsequent method is executed
  const purchaseWithNft = () => {

    setPurchaseInProgress(true);

    // console.log(`PURCHASE!!`);
    // TODO: Delete this test firebase write
    // db.collection("outstandingNftBalance").doc("BLAH")
    // .set({
    //   balanceRemaining: FieldValue.increment(-1),
    //  })
    // .then(() => { 
    //   console.log("Success!")
    // })
    // .catch((err:Error) => { 
    //   console.error(err);
    // })

    if (isInstantBarter) {
      executeInstantBarter(nft, product, ethPrice);
    } else {
      executeCollateralizedPurchase(nft, product, ethPrice);
    }
  }

  return (
    <div className="nft-card">
      <img alt={nft.name} className="nft-card-img"  src={nft.image_url} />
      <div className="nft-details">
        <p>{nft.name}</p>
        <p>{nft.collection.slug}</p>
        <p>{nft.description}</p>
        <h3>Details</h3>
        <p>Contract Address</p>
        <a href={`https://rinkeby.etherscan.io/address/${nft.asset_contract.address}`}>
          <p>{formatShortenContract(nft.asset_contract.address)}</p>
        </a>
        <p>Token ID</p>
        <p>{nft.token_id}</p>
      </div> 
      <button disabled={purchaseInProgress} className="sell-btn" onClick={() => purchaseWithNft() }>
        Barter Me
      </button>
      {purchaseInProgress &&
        <div id="purchaseOverlay">
          <div></div>
        </div>}
    </div>
  )
}

export default NFTCard;