import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Row, Col } from 'react-bootstrap';
import { OutstandingNftBalance } from './constants/class-objects';

import { queryOutstandingNftBalances } from './queries/FirebaseQueries';
import { connectWallet } from './utils/interact';
import { repayStore, getExactPaymentleft } from './utils/productInteractions';

import './App.css';
import { ProgressBar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { formatStripeToUSDString } from './utils/format';
import Navbar from './components/Navbar';

const ProductPayments: React.FC = () => {

  const [errorMessage, setErrorMessage] = useState('');
  const [walletAddress, setWalletAddress] = useState(null);
  const [userBalance, setUserBalance] = useState('');

  // Balances consts
  const [callingBalances, setCallingBalances] = useState(false);
  const [oustandingBalancesArr, setOutstandingBalancesArr] = useState<Array<OutstandingNftBalance>>([]);
  const [currentOustandingBalance, setCurrentOutstandingBalance] = useState<OutstandingNftBalance|null>();

  // payment
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [isPayingFull, setIsPayingFull] = useState(false);

  // First function called in useEffect
  const connectWalletAndQueryBalances = async () => {

    // Connect Wallet if needed
    const resp:any = await connectWallet();
    const addr = resp.address;

    if (addr !== "") {
      accountChangedHandler(addr);
    } else {
      setErrorMessage(resp.status);
    }
  }

  const accountChangedHandler = async (newAccount:any) => {

    setWalletAddress(newAccount);
    getUserBalance(newAccount);

    if (!callingBalances) {
      const balancesArray = await queryOutstandingNftBalances(newAccount);
      setCallingBalances(false);
      setOutstandingBalancesArr(balancesArray);
    }
  }

  const getUserBalance = (address:any) => {
    (window as any).ethereum.request({method: 'eth_getBalance', params: [address, 'latest']})
      .then((balance:any) => {
          setUserBalance(ethers.utils.formatEther(balance));
      })
  }

  // Gets percentage % of remaining balance paid off

  const getOutstandingBalanacePaidPercent = () => {
    if (!currentOustandingBalance) return;
    return (((currentOustandingBalance.balanceStart - currentOustandingBalance.balanceRemaining) / currentOustandingBalance.balanceStart) * 100);
  }

  const enteringPaymentAmount = (e:any) => {

    let intendedAmount = e.target.value;
    setErrorMessage('');

    if (intendedAmount > currentOustandingBalance!.balanceRemaining) {
      // Activate Pay in full state
      setIsPayingFull(true);
      setPaymentAmount(currentOustandingBalance!.balanceRemaining);
      setErrorMessage(`You cannot pay more than what you owe.`);
    } else {
      // Else, continue
      setIsPayingFull(false);
      setPaymentAmount(intendedAmount);
    }

  }

  // Pay this outstanding object
  const payOutstandingBalance = async (event:any) => {

    event.preventDefault();

    console.log(`PAYING THIS MUCH:::::: ${Number(paymentAmount)}`);

    if (!currentOustandingBalance) {
      setErrorMessage(`Please select and outstanding balance item first.`);
      return;
    }

    // const exactAmount = await getExactPaymentleft("0x52554BfE4baC4aE605Af27A2e131480F2D219Fe6", currentOustandingBalance!.nftContractAddress, currentOustandingBalance!.nftTokenId);
    // const repayResp = await repayStore(currentOustandingBalance!.id, currentOustandingBalance!.nftContractAddress, currentOustandingBalance!.nftTokenId, paymentAmount);

    // if (!repayResp.success) {
    //   setErrorMessage(repayResp.status);
    // }

  }

  const enterRemainginBalance = async () => {

    if (!currentOustandingBalance) {
      setErrorMessage(`Please select an outstanding balance before proceeding`);
      return;
    }

    if (!walletAddress) {
      setErrorMessage(`Please select a valid ETH wallet on Rinkeby before proceeding`);
      return;
    }

    setIsPayingFull(true);

    const nftContractAddr = currentOustandingBalance.nftContractAddress;
    const nftTokenId = currentOustandingBalance.nftTokenId;
    
    const amountResp = await getExactPaymentleft(walletAddress, nftContractAddr, nftTokenId);

    setPaymentAmount(Number(amountResp));

  }

  useEffect(() => {
    connectWalletAndQueryBalances();
  }, [])

  return (
    <div>
      <Navbar walletAddress={walletAddress} userBalance={userBalance} title={"Account & Payments"} errorMessage={""} />
      <div className="payments">
        <Row>
          <Col xs={12} md={3} className="pay-left-col">
            <Row>
              <h1>Outstanding Balances</h1>
              { oustandingBalancesArr.length > 0 &&
              <div className="outstanding-items">
                { oustandingBalancesArr.map((balanceObj:OutstandingNftBalance, index:any) => {
                  return (
                    <a key={index} onClick={() => { setCurrentOutstandingBalance(balanceObj) }} className="balance-box-link">
                      <div className="balance-box">
                        <img className="balance-img" src={balanceObj.product.productImageUrls[0]} />
                        <div className="balance-info">
                          <p className="balance-title">{balanceObj.product.name}</p>
                          <p className="balance-amount">Remaining Balance: {balanceObj.balanceRemaining} </p>
                        </div>
                      </div>
                    </a>
                  )
                })}
              </div>
              }
            </Row>
          </Col>

          <Col xs={12} md={6} className="pay-right-col">
            { oustandingBalancesArr.length <= 0 &&
              <h3 className="h3-subtitle">Looks like you have no oustanding balances!</h3>
            }
            { oustandingBalancesArr.length > 0 && !currentOustandingBalance &&
              <h3 className="h3-subtitle">Select an outstanding balance to begin paying it off!</h3>
            }
            { currentOustandingBalance &&
              <div className="selected-box">
                <div className="selected-img-div">
                  <img className="selected-img" alt={currentOustandingBalance.id} src={currentOustandingBalance.product.productImageUrls[0]} />
                </div>
                <div className="selected-info-div">
                  <h3 className="selected-title">{currentOustandingBalance.product.name}</h3>
                  <p className="selected-subtitle">Remaining Balance: {currentOustandingBalance.balanceRemaining} WETH</p>
                  <div className="progressBar">
                    <ProgressBar
                      now={ getOutstandingBalanacePaidPercent() }
                      label={`${ getOutstandingBalanacePaidPercent() }% already paid`}
                    />
                  </div>
                  <form className="form-input" onSubmit={(e:any) => payOutstandingBalance(e)}>
                    <p className="selected-amount-input">Amount to Pay:</p>
                    <input
                      type="number"
                      min="0"
                      onChange={(event) => enteringPaymentAmount(event)}
                      value={paymentAmount}
                    />
                    <div className="pay-btns-div">
                      <button className="pay-btn">Pay</button>
                      <a className="pay-full-btn" onClick={() => enterRemainginBalance()}>Pay full balance</a>
                    </div>
                  </form>
                  { errorMessage && <p>{ errorMessage }</p> }
                </div>
              </div>
            }
          </Col>

        </Row>
      </div>
    </div>
  );
};

export default ProductPayments;