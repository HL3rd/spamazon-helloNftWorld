import React from 'react';

interface NFTCardProps {
  nft: any
}

const NFTCard:React.FC<NFTCardProps> = ({ nft }) => {

  return (
    <div>
      <img alt="nft-img" src={nft.image_url} />
      <p>Collection: {nft.collection.slug}</p>
      <p>Contract: {nft.asset_contract.address}, tokenId: {nft.token_id}</p>
      <p>Name: {nft.name}</p>
      <p>{nft.description}</p>
    </div>
  )
}

export default NFTCard;