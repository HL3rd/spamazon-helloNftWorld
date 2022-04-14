import React from 'react';
import { Product } from './constants/class-objects';
import NFTCard from './NFTCard';

interface NFTContainerProps {
  nfts: Array<any>,
  setNftsVisible: any,
  selectedNft: any,
  setSelectedNft: any,
}

const NFTContainer:React.FC<NFTContainerProps> = ({ nfts, setNftsVisible, selectedNft, setSelectedNft }) => {

  return (
    <div>
      <div style={{ textAlign: 'left', alignItems: 'left', marginLeft: '20px' }}>
        <button onClick={() => setNftsVisible(false)}>
          X
        </button>
      </div>
      <div className="nft-content">
        { nfts.map((nft:any, index:any) => {
          return <NFTCard 
                    nft={nft}
                    selectedNft={selectedNft}
                    setSelectedNft={setSelectedNft}
                    key={index}
                  />
        })}
      </div>
    </div>
  )
}

export default NFTContainer;