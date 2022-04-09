import React from 'react';

interface NFTCardProps {
  nft: any
}

const NFTCard:React.FC<NFTCardProps> = ({ nft }) => {

  return (
    <div>
      <img alt="nft-img" src={nft.image_url} />
      <p>ID: {nft.id}</p>
      <p>Collection: {nft.collection.slug}</p>
      <p>Contract: {nft.asset_contract.address}</p>
      <p>Name: {nft.name}</p>
      <p>{nft.description}</p>
    </div>
  )
}

export default NFTCard;