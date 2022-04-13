import React, { useState } from 'react';
import { Product } from './constants/class-objects';
import { canPurchaseCheck, transferNft } from './utils/productInteractions';
import { formatShortenContract } from './utils/format';

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
      const transferResp = await transferNft(nft);
      setStatus(transferResp.status);
    }
  };

  return (
    <div style={{ color: "black", backgroundColor: "white", borderRadius: "20px", width: "50%", padding: "1em", margin: "3.5rem" }}>
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