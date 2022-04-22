import { db, FieldValue } from '../utils/firebase';
import { OutstandingNftBalance, Product } from '../constants/class-objects';
import { getCurrentTimestamp } from '../utils/format';

const STORE_WALLET_ADDRESS = "0x2929C3c9805dD1A16546251b9b0B65583FD302c8"

/**
 * 
 * @param nft 
 * @param product 
 * @param ethPrice 
 * @param signer 
 * 
 * Function writes the transaction above to a Firestore document for tracking
 * 
 */
 export const setOutstandingBalanceDoc = async (nft:any, product:Product, ethPrice:any, buyerAddress:any) => {

  const currTimestamp = getCurrentTimestamp();

  const productPriceEth = (product.price / 100) / ethPrice;

  const newOutstandingDocRef = db.collection("outstandingNftBalance").doc();

  const buyerAddr = `${buyerAddress}`.toLowerCase();

  const nftContractAddr = (nft.asset_contract.address).toLowerCase()

  const nftBalanceData = {
    balanceRemaining: productPriceEth,
    balanceStart: productPriceEth,
    buyerAddress: buyerAddr,
    createdAt: currTimestamp,
    id: newOutstandingDocRef.id,
    nftContractAddress: nftContractAddr,
    nftImageUrl: nft.image_url,
    nftTokenId: nft.token_id,
    product: {
      description: product.description,
      id: product.id,
      isListed: product.isListed,
      name: product.name,
      price: product.price,
      productImageUrls: product.productImageUrls,
      quantity: product.quantity,
    },
    sellerAddress: STORE_WALLET_ADDRESS.toLowerCase(),
  }
  newOutstandingDocRef.set(nftBalanceData, { merge: true })
    .then(() => { })
    .catch((err:Error) => { })
};

/**
 * 
 * @param docId 
 * @param amount 
 */

export const makePaymentOnOutstandingBalance = async (docId: string, amount:number, isPayingFull:boolean) => {

  const docRef = (await db.collection('outstandingNftBalance').doc(docId).get()).ref

  var query = (isPayingFull) ?  docRef.update({balanceRemaining: 0}) : docRef.update({balanceRemaining: FieldValue.increment(-amount)})
  
  query.then(() => {
      console.log(`Succesfully made payment in Firestore of ${amount} ETH`);
    })
    .catch((err) => {
      console.error(err);
    });
}