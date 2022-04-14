import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { OutstandingNftBalance } from './constants/class-objects';

const ProductPayments: React.FC = () => {

  const testOutstandingNftBalance: OutstandingNftBalance = {
    amountOwed: 1.0,
    amountOwedStart: 2.0,
    buyerAddress: "0x52554BfE4baC4aE605Af27A2e131480F2D219Fe6",
    createdAt: 1649908881,
    id: "00000",
    nftContractAddress: "0x08207fe7f1f7c9f1c39e4720b9f7bfe2afd01907",
    nftTokenId: 11,
    product: {
      description: 'A new revolutionary product A new revolutionary product A new revolutionary product A new revolutionary product A new revolutionary product A new revolutionary product A new revolutionary product',
      productImageUrls: ['https://images-na.ssl-images-amazon.com/images/I/91TvWl33h4L.jpg', "https://i.kym-cdn.com/entries/icons/mobile/000/006/026/NOTSUREIF.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Giraffa_camelopardalis_angolensis.jpg/1024px-Giraffa_camelopardalis_angolensis.jpg"],
      id: "00000",
      isListed: true,
      name: 'Guide to the Universe Book',
      price: 10000,
      quantity: 100,
    },
    sellerAddress: "0x2929C3c9805dD1A16546251b9b0B65583FD302c8"
  }

  return (
    <div>
      <Row>
        <Col xs={12}>
          <h1>Account &amp; Paymetns</h1>
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={3}>
          <p>This is where you have the options</p>
        </Col>
        <Col xs={12} md={9}>
          <p>This is where the selected NFT Outstanding balance will appear</p>
          <p>Add some input field to select the amount of ETH to contribute towards the debt payment</p>
          <button>Pay</button>
        </Col>
      </Row>
    </div>
  );
};

export default ProductPayments;