import { Product } from '../constants/class-objects';

const openSeaCollectionFloorPrice = async (nft:any) => {

  const address = nft.address;

  const options = {
    method: 'GET',
  };

  const assetResp = await fetch(`https://rinkeby-api.opensea.io/api/v1/asset_contract/${address}`, options);
  const assetData = await assetResp.json();

  const slug = assetData.collection.slug;

  const collectionResp = await fetch(`https://rinkeby-api.opensea.io/api/v1/collection/${slug}/stats`, options);
  const collectionData = await collectionResp.json();

  const floorPrice = collectionData.stats.floor_price;

  return floorPrice;
}

export const canPurchaseCheck = async (nft:any, product:Product) => {

  const floorPrice = await openSeaCollectionFloorPrice(nft);

};

export const convertStripeToUSD = () => {

}

export const convertStripeToETH = () => {
  // Set price as standard for now
}