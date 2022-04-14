import React, { useState } from 'react';
import { Product } from '../constants/class-objects';
import { Row, Col } from 'react-bootstrap';

import { canPurchaseCheck, collateralizeNFT, instantBarterNFT } from '../utils/productInteractions';

interface PurchaseModalProps {
  selectedNft: any,
  product: Product,
  ethPrice: any,
  isInstantBarter: boolean,
  setNftsVisible: any,
  setSelectedNft: any,
}

const PurchaseModal:React.FC<PurchaseModalProps> = ({ selectedNft, product, ethPrice, isInstantBarter, setNftsVisible, setSelectedNft }) => {

  const [status, setStatus] = useState("");

  // Function checks OpenSea floor price and executes instant trade if value is > product price
const executeInstantBarter = async (nft:any, product:Product, ethPrice:any) => {
    
  const checkResp = await canPurchaseCheck(nft, product, ethPrice);

  setStatus(checkResp.status);

  if (checkResp.success) {
    const transferResp = await instantBarterNFT(nft);
    setStatus(transferResp.status);
    setSelectedNft(nft);
  }

  setSelectedNft(false);

  // TODO: Refresh NFTs

};

// Item trades the nft and sets outstanding bartering value
const executeCollateralizedPurchase = async (nft:any, product:Product, ethPrice:any) => {
  const collateralResp = await collateralizeNFT(nft, product, ethPrice);
  setStatus(collateralResp.status);
  setSelectedNft(null);

  // TODO: Refresh NFTs
};

const instantBarterCheckout = () => {
  return (
    <Row>
      <Col>
        <Row>
          <Col>
            <h3>1. Checking Market Value</h3>
          </Col>
        </Row>
        <Row>
          <Col>
            <h3>2. Confirm Transaction</h3>
          </Col>
        </Row>
        <Row>
          <Col>
            <h3>3. Shipment</h3>
            <p>Yay!</p>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

const collateralBarterCheckout = () => {
  return (
    <Row>
      <Col>
        {/* Will have 2 rows */}
      </Col>
    </Row>
  )
}

  return (
  <Row className="purchaseModal">
    <div style={{ textAlign: 'left', alignItems: 'left', marginLeft: '20px' }}>
      <button onClick={() => setNftsVisible(false)}>
        X
      </button>
    </div>
    <Col xs={5}>
      <img src={selectedNft.asset_contract.addres}/>
    </Col>
    <Col xs={7}>
      <h3>Complete Purchase</h3>
      {isInstantBarter && instantBarterCheckout() }
      {!isInstantBarter && collateralBarterCheckout() }
    </Col>
  </Row>
  )
}

export default PurchaseModal;