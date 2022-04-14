import React, { useState } from 'react';
import { Product } from './constants/class-objects';
import { formatShortenContract } from './utils/format';
import { db, FieldValue } from './utils/firebase';

interface NFTCardProps {
  nft: any,
  selectedNft: any,
  setSelectedNft: any
}

const NFTCard:React.FC<NFTCardProps> = ({ nft, selectedNft, setSelectedNft }) => {
  
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
      <button disabled={selectedNft != null} className="sell-btn" onClick={() => setSelectedNft(nft) }>
        Barter Me
      </button>
    </div>
  )
}

export default NFTCard;