import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Row, Col, ProgressBar } from 'react-bootstrap';

import { db } from './utils/firebase';
import { connectWallet } from './utils/interact';
import { repayStore, getExactPaymentleft } from './utils/productInteractions';
import { getETHPriceInUSD } from './queries/NftData';
import { formatStripeToUSDString, formatETHToUSDString } from './utils/format';

import { OutstandingNftBalance } from './constants/class-objects';

import Navbar from './components/Navbar';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProductPayments: React.FC = () => {

  const [errorMessage, setErrorMessage] = useState('');
  const [walletAddress, setWalletAddress] = useState(null);
  const [userBalance, setUserBalance] = useState('');
  const [ethPrice, setETHPrice] = useState(null);

  // Balances consts
  const [callingBalances, setCallingBalances] = useState(false);
  const [oustandingBalancesArr, setOutstandingBalancesArr] = useState<Array<OutstandingNftBalance>>([]);
  const [currentOustandingBalance, setCurrentOutstandingBalance] = useState<OutstandingNftBalance|null>();

  // payment
  const [paymentAmount, setPaymentAmount] = useState<number|undefined>(undefined);
  const [isPayingFull, setIsPayingFull] = useState(false);

  // First function called in useEffect
  const connectWalletAndQueryBalances = async () => {

    // Connect Wallet if needed
    const resp:any = await connectWallet();
    const addr = resp.address;

    if (addr !== "") {
      accountChangedHandler(addr);
    } else {
      setErrorMessage(`Success! ${resp.status}`);
    }
  }

  const callEthPriceCheck = async () => {
    const price = await getETHPriceInUSD();
    setETHPrice(price);
  };

  const accountChangedHandler = async (newAccount:any) => {

    setWalletAddress(newAccount);
    getUserBalance(newAccount);

    if (!callingBalances) {
      queryOutstandingNftBalances(newAccount);
      setCallingBalances(false);
    }
  }


  /**
   * 
   * @param walletAddress 
   * @returns 
   * 
   * Query outstanding balance objects
   * 
   */
  const queryOutstandingNftBalances = (walletAddress:string) => {

    db.collection('outstandingNftBalance')
      .where('buyerAddress', '==', walletAddress)
      .where('balanceRemaining', '>', 0)
      .orderBy('balanceRemaining')
      .orderBy('createdAt', 'desc')
      .onSnapshot((outstandingPaymentsSnapshot) => {
        const outstandingPaymentsArray = outstandingPaymentsSnapshot.docs.map((doc) => new OutstandingNftBalance(doc.id, doc.data()))
        setOutstandingBalancesArr(outstandingPaymentsArray);
      });
  }

  const setCurrentBalanceObj = async (currentBalanceObj:OutstandingNftBalance) => {

    setCurrentOutstandingBalance(currentBalanceObj);

    db.collection('outstandingNftBalance')
      .doc(currentBalanceObj.id)
      .onSnapshot((balanceObjSnap) => {
        const newObj = new OutstandingNftBalance(balanceObjSnap.id, balanceObjSnap.data());
        setCurrentOutstandingBalance(newObj);

        if (newObj.balanceRemaining == 0) {
          setPaymentAmount(undefined);
        }

      });
  }

  const getUserBalance = (address:any) => {
    (window as any).ethereum.request({method: 'eth_getBalance', params: [address, 'latest']})
      .then((balance:any) => {
          setUserBalance(ethers.utils.formatEther(balance));
      })
  }

  /**
   * 
   * @returns 
   * 
   * Gets percentage % of remaining balance paid off
   */
  const getOutstandingBalanacePaidPercent = () => {
    if (!currentOustandingBalance) return;
    return (((currentOustandingBalance.balanceStart - currentOustandingBalance.balanceRemaining) / currentOustandingBalance.balanceStart) * 100);
  }

  /**
   * 
   * @returns 
   * 
   * Live state change register as user enters payment amount
   */
  const enteringPaymentAmount = (e:any) => {

    let intendedAmount = e.target.value;
    
    if (intendedAmount < 0) {
      setErrorMessage('Please enter a value greater than zero.');
      return;
    }

    setErrorMessage('');

    if (intendedAmount >= currentOustandingBalance!.balanceRemaining) {
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

  /**
   * 
   * @param event 
   * @returns 
   * 
   * Pay this outstanding object
   */
  const payOutstandingBalance = async (event:any) => {

    event.preventDefault();

    if (!currentOustandingBalance) {
      setErrorMessage(`Please select and outstanding balance item first.`);
      return;
    }

    console.log(`PAYING THIS MUCH:::::: ${Number(paymentAmount)}`);

    var actualPayment = paymentAmount;

    const nftContractAddr = currentOustandingBalance!.nftContractAddress;
    const nftTokenId = currentOustandingBalance!.nftTokenId;

    if (isPayingFull) {
      actualPayment = Number(await getExactPaymentleft("0x52554BfE4baC4aE605Af27A2e131480F2D219Fe6", nftContractAddr, nftTokenId));
    }

    // Amount in ETH is returned, might be a chance that we need Wei
    const balanceDocId = currentOustandingBalance!.id;

    const repayResp = await repayStore(balanceDocId, nftContractAddr, nftTokenId, paymentAmount, isPayingFull);

    if (!repayResp.success) {
      setErrorMessage(repayResp.status);
    } else {
      setPaymentAmount(undefined);
      setErrorMessage(repayResp.status);
    }

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
    callEthPriceCheck();
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
                    <a key={index} onClick={() => { setCurrentBalanceObj(balanceObj) }} className="balance-box-link">
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
                  <p className="selected-subtitle-usd">{formatETHToUSDString(currentOustandingBalance.balanceRemaining, ethPrice)}</p>
                  <div className="progressBar">
                    <ProgressBar
                      now={ getOutstandingBalanacePaidPercent() }
                    />
                  </div>
                  <form className="form-input" onSubmit={(e:any) => payOutstandingBalance(e)}>
                    <p className="selected-amount-input">Amount to Pay:</p>
                    <input
                      type="number"
                      onChange={(event) => enteringPaymentAmount(event)}
                      step="0.000001"
                      value={paymentAmount}
                    />
                    <p>{ formatETHToUSDString((paymentAmount ? paymentAmount : 0), ethPrice) }</p>
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