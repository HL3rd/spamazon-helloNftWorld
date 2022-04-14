import React, { useState } from 'react';
import { Product } from '../constants/class-objects';
import { Row, Col } from 'react-bootstrap';

import { canPurchaseCheck, collateralizeNFT, instantBarterNFT } from '../utils/productInteractions';

interface PurchaseModalProps {
  selectedNft: any,
  product: Product,
  ethPrice: any,
  isInstantBarter: boolean,
  setSelectedNft: any,
}

const PurchaseModal:React.FC<PurchaseModalProps> = ({ selectedNft, product, ethPrice, isInstantBarter, setSelectedNft }) => {

    const [status, setStatus] = useState("");

    // Item trades the nft and sets outstanding bartering value
    const executeCollateralizedPurchase = async (nft:any, product:Product, ethPrice:any) => {
      const collateralResp = await collateralizeNFT(nft, product, ethPrice);
      setStatus(collateralResp.status);
      setSelectedNft(null);

      // TODO: Refresh NFTs
    };

    /**
     * Mini component for Instant Barter checkout
     * @returns 
     */
    const instantBarterCheckout = () => {

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

        setCanPurchase(checkResp.floorPriceUSD > (product.price / 100))

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
                { canPurchase == null && <button onClick={() => checkMarketValue()}>Check Market Value</button> }
                { canPurchase != null && canPurchase && !continueTapped &&
                  <div>
                    <h3>Yay! Your NFT is valued at:</h3>
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
                    <button onClick={() => window.open("/", "_blank")}>Continue Shopping</button>
                  </div>
                }
              </Col>
            </Row>
          </Col>
        </Row>
      );
    }

    /**
     * Mini checkout for collateralized barter checkout
     * @returns 
     */
    const collateralBarterCheckout = () => {
      return (
        <Row>
          <Col>
            <h3>Collateralized Purchase</h3>
            <p>Buy {product.name} now, pay later after posting your {selectedNft.name} NFT up for collateral.</p>
          </Col>
        </Row>
      )
    }

    return (
      <Row className="purchaseModal">
        <div style={{ textAlign: 'left', alignItems: 'left', marginLeft: '20px' }}>
          <button onClick={() => setSelectedNft(null)}>
            X
          </button>
        </div>
        <Col xs={5}>
          { isInstantBarter &&
            <div>
              <h3>Instant Trade-In Purchase</h3>
              <p>Automatically trade your {selectedNft.name} NFT for {product.name} if the current market value is higher.</p>
              <img alt={`${selectedNft.name}`} className="nft-barter-img" src={selectedNft.image_url}/>
            </div>
          }
          { !isInstantBarter &&
            <div>
              <h3>Dump now, Pay later</h3>
              <p>Put up your {selectedNft.name} NFT as collateral to buy {product.name} if the current market value is higher.</p>
              <p>Pay off the balance in WETH later.</p>
              <img alt={`${selectedNft.name}`} className="nft-barter-img" src={selectedNft.image_url}/>
            </div>
          }
        </Col>
        <Col xs={7}>
          { isInstantBarter && instantBarterCheckout() }
          { !isInstantBarter && collateralBarterCheckout() }
        </Col>
      </Row>
    );
}

export default PurchaseModal;