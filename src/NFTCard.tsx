import React from 'react';

interface NFTCardProps {
  nft: any
}

const NFTCard:React.FC<NFTCardProps> = ({ nft }) => {

  return (
    <div>
      <img alt="nft-img" src={nft.meta.content[1].url} />
      <p>ID: {nft.id}</p>
      <p>Collection: {nft.collection}</p>
      <p>Contract: {nft.contract}</p>
      <p>Name: {nft.meta.name}</p>
      <p>{nft.meta.description}</p>
    </div>
  )
}

export default NFTCard;