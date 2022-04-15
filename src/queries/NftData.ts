/**
 * 
 * @returns ETH price in USD
 * 
 */
 export const getETHPriceInUSD = async () => {
  const options = {
    method: 'GET',
  };
  const resp = await fetch('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD', options);
  const data = await resp.json();
  return data.USD;
}

/**
 * 
 * @param address current connect Wallet addres
 */
export const getNFTData = async (address:any) => {

  // TODO: Use this for production/mainnet API
  // const options = {
  //   method: 'GET',
  //   headers: {Accept: 'application/json', 'X-API-KEY': ''},
  // };
  const options = {
    method: 'GET',
  };
  
  const response = await fetch(`https://rinkeby-api.opensea.io/api/v1/assets?owner=${address}&order_direction=desc&offset=0`, options);
  const data = await response.json();

  if (data === undefined || data === null) {
    return [];
  } else {
    return data.assets;
  }
}

/**
 * 
 * @param nft 
 * @returns 
 * 
 * Calls the OpenSea API to retrieve NFT collection slug
 * Then calls ethe OpenSea API with the slug to collect floor_price
 * 
 */

 const delay = (ms:number) => new Promise(res => setTimeout(res, ms));

 export const openSeaCollectionFloorPrice = async (nft:any) => {
 
   try {
     const options = {
       method: 'GET'
     };
 
     // Query the asset to retrieve slug
     const assetResp = await fetch(`https://testnets-api.opensea.io/api/v1/asset/${nft.asset_contract.address}/${nft.token_id}/`, options)
     const assetData = await assetResp.json();
 
     const slug = assetData.collection.slug;
 
     console.log(`SLUG: ${slug}`);
 
     await delay(2000);
 
     // Use collection slug to query proper eth floor price
     const collectionResp = await fetch(`https://testnets-api.opensea.io/api/v1/collection/${slug}/stats`, options);
     const collectionData = await collectionResp.json();
 
     console.log(`Got back this data from OpenSea: ${JSON.stringify(collectionData)}`);
 
     const floorPrice = collectionData.stats ? collectionData.stats.floor_price : 0;
     
     return floorPrice;
     
   } catch (err:any) {
 
     console.error(err);
     return 0;
   }
 }