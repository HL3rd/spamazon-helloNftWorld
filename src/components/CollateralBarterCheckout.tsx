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
              <div>
                <p>Put up your {selectedNft.name} NFT as collateral to buy {product.name} if the current market value is higher.</p>
                <p>Pay off the balance in WETH later.</p>
                <p>Floor price must be non-zero to collateralize.</p>
                <button disabled={checkingMarketValue} onClick={() => checkMarketValue()}>Check Market Value</button>
              </div>
            }
            { canPurchase != null && canPurchase && !continueTapped &&
              <div>
                <h3>Yay! Your Discord mods must be doing great work. Your NFT's floor price is:</h3>
                <h3>{marketValueETH} ETH or ${marketValueUSD}</h3>
                <button onClick={() => setContinueTapped(true)}>Continue</button>
                <button onClick={() => setSelectedNft(null)}>Cancel</button>
              </div>
            }
            { canPurchase != null && !canPurchase &&
              <div>
                <h3>Sorry, there's no market for your NFT. The floor price is 0 ETH</h3>
                <p>Better ask your Discord to pump your bags before buying {product.name}</p>
                <button onClick={() => setSelectedNft(null)}>Back</button> 
              </div>
            }
            { canPurchase != null && continueTapped && exchangeStatus == null &&
              <div>
                <h3>Confirm Purchase</h3>
                <p>Click 'Confirm Exchange' in order to post your NFT as collateral to pay for {product.name} later.</p>
                <p>This means you will have to pay {(product.price / 100) / ethPrice} WETH within 30 days to get your NFT back.</p>
                <button onClick={() => executeCollateralizedPurchase(selectedNft, product, ethPrice)}>Confirm Exchange</button>
                <button onClick={() => setSelectedNft(null)}>Cancel</button>
                { exchangeStatus !== null && !exchangeStatus && <p>Oops! Something went wrong</p>}
              </div>
            }
            {
              canPurchase !== null && continueTapped && exchangeStatus &&
              <div>
                <h3>Success</h3>
                <p>You succesfully posted your <strong>{selectedNft.name}</strong> NFT as collateral for {product.name} </p>
                <img alt={product.name} src={product.productImageUrls[0]} />
                <a href="/">Continue Shopping</a>
                <p>Remember to pay in full within 30 days or risk loosing your {selectedNft.name} forever!</p>
                <a href="/payments">Make a Payment</a>
              </div>
            }
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default CollateralBarterCheckout;