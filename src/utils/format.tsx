export const formatStripeToUSD = (stripeInt:number) => {
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