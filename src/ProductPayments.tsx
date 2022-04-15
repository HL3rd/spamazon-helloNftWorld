import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { OutstandingNftBalance } from './constants/class-objects';

import './App.css';
import { ProgressBar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { formatStripeToUSDString } from './utils/format';
import Navbar from './components/Navbar';

const ProductPayments: React.FC = () => {

  const percentage = 73;

  const [outstandingNftBlance, setOutstandingNftBalance] = useState<OutstandingNftBalance|null>(null);

  const testOutstandingNftBalance: OutstandingNftBalance = {
    balanceRemaining: 1.0,
    balanceStart: 2.0,
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
    <body>
      <Navbar walletAddress={"a"} userBalance={"a"} errorMessage={"a"} /> 
      {/* walletAddress={walletAddress} userBalance={userBalance} errorMessage={errorMessage} /> */}

      <div className="payments">
        <Row>
          {/* fills about 25% on large screens and 100% on small */}
          <Col xs={12} md={3} className="left-col">
            <Row>
              <h1>Outstanding Balances</h1>
              <div className="balance-box">
                <div className="balance-img">
                  <img />
                </div>
                <div className="balance-info">
                  <p className="balance-title">Universe Book</p>
                  <p className="balance-amount">Remaining Balance: </p>
                </div>
              </div>
            </Row>

            <Row>
              <div className="balance-box-unselected">
                <div className="balance-img">
                  <img />
                </div>
                <div className="balance-info">
                  <p className="balance-title">Universe Book</p>
                  <p className="balance-amount">Remaining Balance: </p>
                </div>
              </div>
            </Row>

            <Row>
              <div className="balance-box-unselected">
                <div className="balance-img">
                  <img />
                </div>
                <div className="balance-info">
                  <p className="balance-title">Universe Book</p>
                  <p className="balance-amount">Remaining Balance: </p>
                </div>
              </div>
            </Row>

            <Row>
              <div className="balance-box-unselected">
                <div className="balance-img">
                  <img />
                </div>
                <div className="balance-info">
                  <p className="balance-title">Universe Book</p>
                  <p className="balance-amount">Remaining Balance: </p>
                </div>
              </div>
            </Row>



          </Col>
          <Col xs={12} md={6} className="right-col">
            <div className="selected-box">
              <div className="selected-img">
                <img />
              </div>

              <div className="right-side-col">

                <div className="selected-info">
                  <h3 className="selected-title">Universe Book</h3>
                  <p className="selected-amount">Remaining Balance:</p>



  
                  <div className="progressBar">
                    <ProgressBar now={percentage} label={`${percentage}% already paid`}/>
                  </div>


                  
                  <form className="form-input">
                    <p className="selected-amount-input">Amount to Pay:</p>
                    <input
                      type="text"
                      placeholder="e.g. 0.5"
                      // maxLength="18"
                      // onChange={(event) => setPayment(event.target.value)}
                    />
                  </form>



                </div>
                <div className="left-btn">
                  <button className="pay-btn">Pay</button>
                </div>
              </div>

            </div>









            {/* <div className="selected-box">
              <div className="selected-img">
                <img />
              </div>
              <div className="selected-info">
                <h3 className="selected-title">Universe Book</h3>
                <p className="selected-amount">Remaining Balance: </p>
              </div>
            </div> */}
          </Col>
        </Row>
      </div>

      
    </body>
  );
};

export default ProductPayments;