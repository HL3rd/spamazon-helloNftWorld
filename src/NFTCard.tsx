import React, { useState } from 'react';
import { Product } from './constants/class-objects';
import { canPurchaseCheck, collateralizeNFT, exchangeNFT } from './utils/productInteractions';
import { formatShortenContract } from './utils/format';

interface NFTCardProps {
  nft: any,
  product: Product,
  ethPrice: any,
  isInstantBarter: boolean
}

const NFTCard:React.FC<NFTCardProps> = ({ nft, product, ethPrice, isInstantBarter }) => {

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
    <div className="nft-card">
      <img alt="nft-img" width="60%" src={nft.image_url} />
      <p>Name: {nft.name}</p>
      <p>Description: {nft.description}</p>
      <p>Collection: {nft.collection.slug}</p>
      <p>Contract: {formatShortenContract(nft.asset_contract.address)}</p>
      <p>TokenId: {nft.token_id}</p>
      <button className="sell-btn" onClick={() => executeInstantBarter(nft, product, ethPrice)}>Barter Me</button>
    </div>
  )
}

export default NFTCard;