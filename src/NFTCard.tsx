import React from 'react';
import { transferNft } from './utils/interact';

interface NFTCardProps {
  nft: any
}

const NFTCard:React.FC<NFTCardProps> = ({ nft }) => {

  return (
    <div style={{ color: "black", backgroundColor: "white", borderRadius: "20px", width: "50%", padding: "1em", margin: "2rem" }}>
      <img alt="nft-img" width="60%" src={nft.image_url} />
      <p>Name: {nft.name}</p>
      <p>Description: {nft.description}</p>
      <p>Collection: {nft.collection.slug}</p>
      <p>Contract: {nft.asset_contract.address}</p>
      <p>tokenId: {nft.token_id}</p>
      <button className="sell-btn" onClick={() => transferNft(nft)}>Barter Me</button>
    </div>
  )
}

export default NFTCard;