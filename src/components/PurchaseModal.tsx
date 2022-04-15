import React from 'react';
import { Product } from '../constants/class-objects';
import { Row, Col } from 'react-bootstrap';

import InstantBarterCheckout from './InstantBarterCheckout';
import CollateralBarterCheckout from './CollateralBarterCheckout';

interface PurchaseModalProps {
  selectedNft: any,
  product: Product,
  ethPrice: any,
  isInstantBarter: boolean,
  setSelectedNft: any,
}

const PurchaseModal:React.FC<PurchaseModalProps> = ({ selectedNft, product, ethPrice, isInstantBarter, setSelectedNft }) => {

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
              <h3 className="trade-in">Instant Trade-In Purchase</h3>
              <img alt={`${selectedNft.name}`} className="nft-barter-img" src={selectedNft.image_url}/>
            </div>
          }
          { !isInstantBarter &&
            <div className="checkout-left-col">
              <h3 className="trade-in">Dump now, Pay later</h3>
              <img alt={`${selectedNft.name}`} className="nft-barter-img" src={selectedNft.image_url}/>
            </div>
          }
        </Col>
        <Col xs={7}>
          { isInstantBarter && <InstantBarterCheckout selectedNft={selectedNft} product={product} ethPrice={ethPrice} setSelectedNft={setSelectedNft} />  }
          { !isInstantBarter && <CollateralBarterCheckout selectedNft={selectedNft} product={product} ethPrice={ethPrice} setSelectedNft={setSelectedNft} />  }
        </Col>
      </Row>
    );
}

export default PurchaseModal;