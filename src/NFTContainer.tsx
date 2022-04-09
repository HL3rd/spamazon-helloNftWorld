import React from 'react';

import NFTCard from './NFTCard';

interface NFTContainerProps {
  nfts: Array<any>
}

const NFTContainer:React.FC<NFTContainerProps> = ({ nfts }) => {

  return (
    <div>
      { nfts.map((nft:any, index:any) => {
        return <NFTCard nft={nft} key={index} />
      })}
    </div>
  )
}

export default NFTContainer;