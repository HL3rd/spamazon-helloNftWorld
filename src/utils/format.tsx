/**
 * 
 * @returns current time timestamp
 */
export function getCurrentTimestamp() {
  return (Math.round((new Date()).getTime() / 1000));
}

export const formatStripeToUSDString = (stripeInt:number) => {
  const decPlaces = 2;
  const decSep = ".";
  const thouSep = ",";
  var number:any = `${stripeInt / 100}`;
  var i:any = String(parseInt(number = Math.abs(Number(number) || 0).toFixed(decPlaces)));
  var j:any = (j = i.length) > 3 ? j % 3 : 0;

  return `$${(j ? i.substr(0, j) + thouSep : "") +
        i.substr(j).replace(/(\decSep{3})(?=\decSep)/g, "$1" + thouSep) +
        (decPlaces ? decSep + Math.abs(number - i).toFixed(decPlaces).slice(2) : "")}`;
}

export const formatETHToUSDString = (ethAmount:number, ethPrice:any) => {
  const decPlaces = 2;
  const decSep = ".";
  const thouSep = ",";
  var number:any = `${ethAmount * (ethPrice)}`;
  var i:any = String(parseInt(number = Math.abs(Number(number) || 0).toFixed(decPlaces)));
  var j:any = (j = i.length) > 3 ? j % 3 : 0;

  return `$${(j ? i.substr(0, j) + thouSep : "") +
        i.substr(j).replace(/(\decSep{3})(?=\decSep)/g, "$1" + thouSep) +
        (decPlaces ? decSep + Math.abs(number - i).toFixed(decPlaces).slice(2) : "")}`;
}

export const formatShortenContract = (longContractAddress:string) => {
  const decimals = "...";
  var splitContract = longContractAddress.split("");
  var length = splitContract.length
  var firstFourNumbers = [splitContract[2], splitContract[3], splitContract[4], splitContract[5]];
  var lastFourNumbers = [splitContract[length - 4], splitContract[length - 3], splitContract[length - 2], splitContract[length - 1]];
  var shortContractAddress = firstFourNumbers.join("") + decimals + lastFourNumbers.join("");

  return `0x${shortContractAddress}`
}