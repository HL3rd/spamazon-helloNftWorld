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

    /**
     * Mini checkout for collateralized barter checkout
     * @returns 
     */
    const collateralBarterCheckout = () => {
      
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

    return (
      <Row className="purchaseModal">
        <Col xs={5}>
          <div style={{ textAlign: 'left', alignItems: 'left', marginLeft: '20px' }}>
            <button onClick={() => setSelectedNft(null)}>
              X
            </button>
          </div>
          { isInstantBarter &&
            <div className="checkout-left-col">
              <h3>Instant Trade-In Purchase</h3>
              <img alt={`${selectedNft.name}`} className="nft-barter-img" src={selectedNft.image_url}/>
            </div>
          }
          { !isInstantBarter &&
            <div className="checkout-left-col">
              <h3>Dump now, Pay later</h3>
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