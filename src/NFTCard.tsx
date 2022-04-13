import React, { useState } from 'react';
import { Product } from './constants/class-objects';
import { canPurchaseCheck, collateralizeNFT, exchangeNFT } from './utils/productInteractions';

interface NFTCardProps {
  nft: any,
  product: Product,
  ethPrice: any
}

const NFTCard:React.FC<NFTCardProps> = ({ nft, product, ethPrice }) => {

  const [status, setStatus] = useState("");

  const executeInstantBarter = async (nft:any, product:Product, ethPrice:any) => {
    const checkResp = await canPurchaseCheck(nft, product, ethPrice);
    setStatus(checkResp.status);
    if (checkResp.success) {
      const transferResp = await exchangeNFT(nft);
      setStatus(transferResp.status);
    }
  };

  const executeCollateralizedPurchase = async (nft:any, product:Product, ethPrice:any) => {
    const collateralResp = await collateralizeNFT(nft, product, ethPrice);

    

  };

  return (
    <div style={{ backgroundColor: "white", borderRadius: "20px", width: "50%", padding: "10px", margin: "0px auto 15px auto" }}>
      <img alt="nft-img" src={nft.image_url} style={{ maxWidth: "80%" }}/>
      <p>Collection: {nft.collection.slug}</p>
      <p>Contract: {nft.asset_contract.address}, tokenId: {nft.token_id}</p>
      <p>Name: {nft.name}</p>
      <p>{nft.description}</p>
      <button onClick={() => executeInstantBarter(nft, product, ethPrice)}>Barter Me</button>
      <button onClick={() => executeCollateralizedPurchase(nft, product, ethPrice)}>Buy Now Pay Later</button>
      <p>{status}</p>
    </div>
  )
}

export default NFTCard;