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
  
  const response = await fetch(`https://rinkeby-api.opensea.io/api/v1/assets?owner=${address}&order_direction=desc&offset=0&limit=20`, options);
  const data = await response.json();

  if (data === undefined || data === null) {
    return [];
  } else {
    return data.assets;
  }
}