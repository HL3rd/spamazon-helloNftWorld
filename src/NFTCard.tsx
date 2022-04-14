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

  // Function checks OpenSea floor price and executes instant trade if value is > product price
  const executeInstantBarter = async (nft:any, product:Product, ethPrice:any) => {

    const checkResp = await canPurchaseCheck(nft, product, ethPrice);

    setStatus(checkResp.status);
    if (checkResp.success) {
      const transferResp = await instantBarterNFT(nft);
      setStatus(transferResp.status);
    }
  };

  // Item trades the nft and sets outstanding bartering value
  const executeCollateralizedPurchase = async (nft:any, product:Product, ethPrice:any) => {
    const collateralResp = await collateralizeNFT(nft, product, ethPrice);
    setStatus(collateralResp.status);
  };

  // Executed upon button click, depending the option chosen in the Checkout, 
  // that subsequent method is executed
  const purchaseWithNft = () => {

    // console.log(`PURCHASE!!`);

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
      <img alt="nft-img" width="60%" src={nft.image_url} />
      <p>Name: {nft.name}</p>
      <p>Description: {nft.description}</p>
      <p>Collection: {nft.collection.slug}</p>
      <p>Contract: {formatShortenContract(nft.asset_contract.address)}</p>
      <p>TokenId: {nft.token_id}</p>
      <button className="sell-btn" onClick={() => purchaseWithNft() }>
        Barter Me
      </button>
    </div>
  )
}

export default NFTCard;