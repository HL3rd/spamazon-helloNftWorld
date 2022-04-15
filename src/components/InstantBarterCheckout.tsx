import React, {useState} from 'react';
import { Row, Col } from 'react-bootstrap';
import { Product } from '../constants/class-objects';

import { canPurchaseCheck, instantBarterNFT } from '../utils/productInteractions';

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
    const checkResp = await canPurchaseCheck(selectedNft, product, ethPrice);
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
            <div>
              <p>Automatically trade your {selectedNft.name} NFT for {product.name} if the current market value is higher.</p>
              <button disabled={checkingMarketValue} onClick={() => checkMarketValue()}>Check Market Value</button>
            </div>
            }
            { canPurchase != null && canPurchase && !continueTapped &&
              <div>
                <h3>Yay! Your Discord mods must be doing great work. Your NFT floor price is at:</h3>
                <h3>{marketValueETH} ETH or ${marketValueUSD}</h3>
                <button onClick={() => setContinueTapped(true)}>Continue</button>
                <button onClick={() => setSelectedNft(null)}>Cancel</button>
              </div>
            }
            { canPurchase != null && !canPurchase &&
              <div>
                <h3>Your NFT is valued at:</h3>
                <h3>{marketValueETH} or {marketValueUSD}</h3>
                <p>Unfortunately, you cannot purchase {product.name} yet.</p>
                <button onClick={() => setSelectedNft(null)}>Back</button> 
              </div>
            }
            { canPurchase != null && continueTapped && exchangeStatus == null &&
              <div>
                <h3>Confirm Purchase</h3>
                <p>Click 'Confirm Barter' in order to trade your NFT</p>
                <button onClick={() => executeInstantBarter(selectedNft)}>Confirm Barter</button>
                { exchangeStatus !== null && !exchangeStatus && <p>Oops! Something went wrong</p>}
              </div>
            }
            {
              canPurchase !== null && continueTapped && exchangeStatus &&
              <div>
                <h3>Yay!</h3>
                <p>You succesfull traded in your {selectedNft.name} NFT for {product.name} </p>
                <a href="/">Continue Shopping</a>
              </div>
            }
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

export default InstantBarterCheckout;