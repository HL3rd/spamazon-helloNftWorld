import React, {useState} from 'react';
import { Row, Col } from 'react-bootstrap';
import { Product } from '../constants/class-objects';

import { canPurchaseCheck, instantBarterNFT } from '../utils/productInteractions';
import { formatStripeToUSDString } from '../utils/format';

interface InstantBarterCheckoutProps {
  selectedNft: any,
  product: Product,
  ethPrice: any,
  setSelectedNft: any,
} 

const InstantBarterCheckout:React.FC<InstantBarterCheckoutProps> = ({ selectedNft, product, ethPrice, setSelectedNft }) => {

  const [checkingMarketValue, setCheckingMarketValue] = useState(false);
  const [marketValueETH, setMarketValueETH] = useState(0);
  const [marketValueUSD, setMarketValueUSD] = useState(0);
  const [canPurchase, setCanPurchase] = useState<boolean|null>(null);
  const [continueTapped, setContinueTapped] = useState(false);
  const [exchangeStatus, setExchangeStatus] = useState<boolean|null>(null);

  const checkMarketValue = async () => {

    setCheckingMarketValue(true);
    const checkResp = await canPurchaseCheck(selectedNft, product, ethPrice, false);
    setCheckingMarketValue(false);

    setCanPurchase(checkResp.floorPriceUSD > (product.price / 100));

    setMarketValueETH(checkResp.floorPriceETH);
    setMarketValueUSD(checkResp.floorPriceUSD);
  }

  // Function checks OpenSea floor price and executes instant trade if value is > product price
  const executeInstantBarter = async (nft:any) => {
    const transferResp = await instantBarterNFT(nft);
    setExchangeStatus(transferResp.success);
  };
  
  return (
    <Row>
      <Col>
        
        <Row>
          <Col>
            { canPurchase == null &&
            <div className="first-step">
              <p className="auto-trade">Automatically trade your <strong>{selectedNft.name}</strong> NFT for <strong>{product.name}</strong> if the current market value is higher than <strong>{formatStripeToUSDString(product.price)}</strong></p>
              <button className="market-btn" disabled={checkingMarketValue} onClick={() => checkMarketValue()}>Check Market Value</button>
            </div>
            }
            { canPurchase != null && canPurchase && !continueTapped &&
              <div className="first-step">
                <h3 className="floor-price">Yay! Your Discord mods must be doing great work. Your NFT floor price is at:</h3>
                <h3 className="floor-eth">{marketValueETH} ETH = ${marketValueUSD}</h3>
                <button className="market-btn" onClick={() => setContinueTapped(true)}>Continue</button>
                <button className="cancel-btn" onClick={() => setSelectedNft(null)}>Cancel</button>
              </div>
            }
            { canPurchase != null && !canPurchase &&
              <div className="first-step">
                <h3 className="floor-price">Your NFT is valued at:</h3>
                <h3 className="prices">{marketValueETH} ETH</h3>
                <p className="unfortunately">Unfortunately, you cannot purchase {product.name} yet.</p>
                <button className="cancel-btn" onClick={() => setSelectedNft(null)}>Back</button> 
              </div>
            }
            { canPurchase != null && continueTapped && exchangeStatus == null &&
              <div className="first-step">
                <h3 className="floor-price">Confirm Purchase</h3>
                <p>Click 'Confirm Barter' in order to trade your NFT!</p>
                <button className="confirm-btn" onClick={() => executeInstantBarter(selectedNft)}>Confirm Barter</button>
                { exchangeStatus !== null && !exchangeStatus && <p>Oops! Something went wrong</p>}
              </div>
            }
            {
              canPurchase !== null && continueTapped && exchangeStatus &&
              <div className="first-step">
                <h3 className="floor-price">Yay!</h3>
                <p>You succesfull traded in your {selectedNft.name} NFT for {product.name}! </p>
                <a className="continue-shopping" href="/">Continue Shopping</a>
              </div>
            }
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

export default InstantBarterCheckout;