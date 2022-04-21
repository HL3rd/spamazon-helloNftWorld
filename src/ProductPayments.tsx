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

  // First function called in useEffect
  const connectWalletAndQueryBalances = async () => {

    // Connect Wallet if needed
    const resp:any = await connectWallet();
    const addr = resp.address;
    console.log(`ADDRESSS ${addr}`);

    if (addr !== "") {
      accountChangedHandler(addr);
    } else {
      setErrorMessage(resp.status);
    }
  }

  const accountChangedHandler = async (newAccount:any) => {

    setWalletAddress(newAccount);
    getUserBalance(newAccount);

    console.log(`GONNA TEST CASES: ${newAccount} /// VS /// ${newAccount.toString()}`);

    if (!callingBalances) {
      console.log(`SHOULD CALLLL`)
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

  // Selected an outstanding balance to pay
  const selectedOutstandingBalance = async (oustandingNftBalance:OutstandingNftBalance) => {
    console.log('BAAAAAAAAAAMMMMMMMMM', (oustandingNftBalance.balanceStart -oustandingNftBalance.balanceRemaining) / oustandingNftBalance.balanceStart);
    setCurrentOutstandingBalance(oustandingNftBalance);
  }

  const getOutstandingBalanacePaidPercent = () => {
    if (!currentOustandingBalance) return;
    return (((currentOustandingBalance.balanceStart - currentOustandingBalance.balanceRemaining) / currentOustandingBalance.balanceStart) * 100);
  }

  // Pay this outstanding object
  const triggeredPaymentToOutstandingBalance = async (event:any) => {

    event.preventDefault();

    const amountPaid = event.target[0].value;
    console.log(`PAYINH:::::: ${amountPaid}`);

    const exactAmount = await getExactPaymentleft("0x52554BfE4baC4aE605Af27A2e131480F2D219Fe6", currentOustandingBalance!.nftContractAddress, currentOustandingBalance!.nftTokenId);

    await repayStore(currentOustandingBalance!.id, currentOustandingBalance!.nftContractAddress, currentOustandingBalance!.nftTokenId, exactAmount);

  }

  useEffect(() => {
    connectWalletAndQueryBalances();
  }, [])

  return (
    <div>
      <Navbar walletAddress={"a"} userBalance={"a"} title={"Account & Payments"} errorMessage={"a"} />
      <div className="payments">
        <Row>
          <Col xs={12} md={3} className="pay-left-col">
            <Row>
              <h1>Outstanding Balances</h1>
              { oustandingBalancesArr.length > 0 &&
              <div className="outstanding-items">
                { oustandingBalancesArr.map((balanceObj:OutstandingNftBalance, index:any) => {
                  return (
                    <a onClick={() => { selectedOutstandingBalance(balanceObj)}} key={index} className="balance-box-link">
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
                  <form className="form-input" onSubmit={(e:any) => triggeredPaymentToOutstandingBalance(e)}>
                    <p className="selected-amount-input">Amount to Pay:</p>
                    <input
                      type="text"
                      placeholder="e.g. 0.5"
                      onChange={(event) => setPaymentAmount(Number(event.target.value))}
                    />
                    <button className="pay-btn">Pay</button>
                  </form>
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