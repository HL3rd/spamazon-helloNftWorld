import React, {useState} from 'react';
import { Row, Col } from 'react-bootstrap';
import { Product } from '../constants/class-objects';

import { canPurchaseCheck, collateralizeNFT } from '../utils/productInteractions';

interface CollateralBarterCheckoutProps {
  selectedNft: any,
  product: Product,
  ethPrice: any,
  setSelectedNft: any,
} 

const CollateralBarterCheckout:React.FC<CollateralBarterCheckoutProps> = ({ selectedNft, product, ethPrice, setSelectedNft }) => {

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

    setCanPurchase(checkResp.floorPriceUSD > 0)

    setMarketValueETH(checkResp.floorPriceETH);
    setMarketValueUSD(checkResp.floorPriceUSD);
  }

    // Item trades the nft and sets outstanding bartering value
  const executeCollateralizedPurchase = async (nft:any, product:Product, ethPrice:any) => {
    const collateralResp = await collateralizeNFT(nft, product, ethPrice);
    setExchangeStatus(collateralResp.success);
  };

  return (
    <Row>
      <Col>
        <Row>
          <Col>
            { canPurchase == null &&
              <div className="first-step">
                <p className="put-up">Put up your {selectedNft.name} NFT as collateral to buy {product.name} if the current market value is higher.</p>
                <p className="pay-off">Pay off the balance in WETH later.</p>
                <p className="pay-off-floor">Floor price must be non-zero to collateralize.</p>
                <button className="market-btn" disabled={checkingMarketValue} onClick={() => checkMarketValue()}>Check Market Value</button>
              </div>
            }
            { canPurchase != null && canPurchase && !continueTapped &&
              <div className="first-step">
                <h3 className="floor-price">Yay! Your Discord mods must be doing great work. Your NFT's floor price is:</h3>
                <h3 className="floor-eth">{marketValueETH} ETH = ${marketValueUSD}</h3>
                <button className="market-btn" onClick={() => setContinueTapped(true)}>Continue</button>
                <button className="cancel-btn" onClick={() => setSelectedNft(null)}>Cancel</button>
              </div>
            }
            { canPurchase != null && !canPurchase &&
              <div className="first-step">
                <h3 className="floor-price">Sorry, there's no market for your NFT. The floor price is 0 ETH</h3>
                <p className="better-ask">Better ask your Discord to pump your bags before buying {product.name}</p>
                <button className="cancel-btn" onClick={() => setSelectedNft(null)}>Back</button> 
              </div>
            }
            { canPurchase != null && continueTapped && exchangeStatus == null &&
              <div className="first-step">
                <h3 className="floor-price">Confirm Purchase</h3>
                <p className="confirm-exchange">Click 'Confirm Exchange' in order to post your NFT as collateral to pay for {product.name} later.</p>
                <p className="confirm-exchange-extra">This means you will have to pay</p>
                <p><strong>{(product.price / 100) / ethPrice} WETH</strong><br />(${product.price / 100} USD)</p>
                <p>within 30 days to get your NFT back.</p>
                <button className="market-btn" onClick={() => executeCollateralizedPurchase(selectedNft, product, ethPrice)}>Confirm Exchange</button>
                <button className="cancel-btn" onClick={() => setSelectedNft(null)}>Cancel</button>
                { exchangeStatus !== null && !exchangeStatus && <p>Oops! Something went wrong</p>}
              </div>
            }
            {
              canPurchase !== null && continueTapped && exchangeStatus && 
              <div className="first-step">
                <h3 className="floor-price">Success!</h3>
                <p className="confirm-exchange">You succesfully posted your <strong>{selectedNft.name}</strong> NFT as collateral for {product.name}! </p>
                {/* <img alt={product.name} src={product.productImageUrls[0]} /> */}
                <a className="continue-shopping" href="/">Continue Shopping</a>
                <p className="remember">Remember to pay in full within 30 days or risk loosing your {selectedNft.name} forever!</p>
                <a className="make-payment" href="/payments">Make a Payment</a>
              </div>
            }
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default CollateralBarterCheckout;