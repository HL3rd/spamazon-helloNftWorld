import React, { useState } from 'react';
import { Product } from './constants/class-objects';
import { formatShortenContract } from './utils/format';
import { Row, Col } from 'react-bootstrap';

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
        <p className="nft-name">{nft.name}</p>
        {/* <p>{nft.description}</p> */}
        <p className="nft-collection">{nft.collection.slug}</p>
        {/* <h3 className="nft-title">Details</h3> */}



        <div className="details-container">
          <Row>
            <Col>
              <p className="nft-title">Contract Address</p>
            </Col>
            <Col>
            <a className="contract-link" href={`https://rinkeby.etherscan.io/address/${nft.asset_contract.address}`}>
              <p className="nft-contract">{formatShortenContract(nft.asset_contract.address)}</p>
            </a>
            </Col>
          </Row>

          <Row>
            <Col>
              <p className="nft-title">Token ID</p>
            </Col>
            <Col>
              <p className="nft-token">{nft.token_id}</p>
            </Col>
          </Row>
        </div>




      </div> 
      <button disabled={selectedNft != null} className="sell-btn" onClick={() => setSelectedNft(nft) }>
        Barter Me
      </button>
    </div>
  )
}

export default NFTCard;