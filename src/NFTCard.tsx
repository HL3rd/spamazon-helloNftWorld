import React from 'react';
import { transferNft } from './utils/productInteractions';

interface NFTCardProps {
  nft: any
}

const NFTCard:React.FC<NFTCardProps> = ({ nft }) => {

  return (
    <div style={{ backgroundColor: "white", borderRadius: "20px", width: "50%", padding: "10px", margin: "0px auto 15px auto" }}>
      <img alt="nft-img" src={nft.image_url} style={{ maxWidth: "80%" }}/>
      <p>Collection: {nft.collection.slug}</p>
      <p>Contract: {nft.asset_contract.address}, tokenId: {nft.token_id}</p>
      <p>Name: {nft.name}</p>
      <p>{nft.description}</p>
      <button onClick={() => transferNft(nft)}>Barter Me</button>
    </div>
  )
}

export default NFTCard;