import React from 'react';
import { Product } from './constants/class-objects';
import NFTCard from './NFTCard';

interface NFTContainerProps {
  nfts: Array<any>,
  product: Product,
  ethPrice: any
}

const NFTContainer:React.FC<NFTContainerProps> = ({ nfts, product, ethPrice }) => {

  return (
    <div>
      { nfts.map((nft:any, index:any) => {
        return <NFTCard nft={nft} product={product} ethPrice={ethPrice} key={index} />
      })}
    </div>
  )
}

export default NFTContainer;