import React from 'react';
import { Product } from './constants/class-objects';
import NFTCard from './NFTCard';

interface NFTContainerProps {
  nfts: Array<any>,
  product: Product,
  ethPrice: any,
  isInstantBarter: boolean,
  setNftsVisible: any,
}

const NFTContainer:React.FC<NFTContainerProps> = ({ nfts, product, ethPrice, isInstantBarter, setNftsVisible }) => {

  return (
    <div>
      <div style={{ textAlign: 'right', alignItems: 'right', marginRight: '20px' }}>
        <button onClick={() => setNftsVisible(false)}>
          X
        </button>
      </div>
      <div className="nft-content">
        { nfts.map((nft:any, index:any) => {
          return <NFTCard nft={nft} product={product} ethPrice={ethPrice} isInstantBarter={isInstantBarter} key={index} />
        })}
      </div>
    </div>
  )
}

export default NFTContainer;