import { db, FieldValue } from '../utils/firebase';
import { ethers } from 'ethers';
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
 export const setOutstandingBalanceDoc = async (nft:any, product:Product, ethPrice:any, signer:ethers.providers.JsonRpcSigner) => {

  const walletAddress = await signer.getAddress();
  const currTimestamp = getCurrentTimestamp();

  const productPriceEth = (product.price / 100) / ethPrice;

  const newOutstandingDocRef = db.collection("outstandingNftBalance").doc();

  const nftBalanceData = {
    balanceRemaining: productPriceEth,
    balanceStart: productPriceEth,
    buyerAddress: walletAddress,
    createdAt: currTimestamp,
    id: newOutstandingDocRef.id,
    nftContractAddress: nft.asset_contract.address,
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
    sellerAddress: STORE_WALLET_ADDRESS,
  }
  newOutstandingDocRef.set(nftBalanceData, { merge: true })
    .then(() => { })
    .catch((err:Error) => { })
};

/**
 * 
 * @param walletAddress 
 * @returns 
 * 
 * Query outstanding balance objects
 * 
 */
export const queryOutstandingNftBalances = async (walletAddress:string) => {

  console.log(`CALLING WITH THIS ADDRESS: ${walletAddress}`);

  const querySnapshot = await db.collection('outstandingNftBalance')
                      .where('buyerAddress', '==', walletAddress)
                      .where('balanceRemaining', '>', 0)
                      .orderBy('balanceRemaining')
                      .orderBy('createdAt', 'desc')
                      .get();
  console.log(`GOT: ${querySnapshot.docs.length} DOCS: ${JSON.stringify(querySnapshot.docs)}`);

  const outstandingPaymentsArray = querySnapshot.docs.map((doc) => new OutstandingNftBalance(doc.id, doc.data()))

  return outstandingPaymentsArray;

}

/**
 * 
 * @param docId 
 * @param amount 
 */

// connectWallet():
  //     0x52554bfe4bac4ae605af27a2e131480f2d219fe6
// CALL: 0x52554bfe4bac4ae605af27a2e131480f2d219fe6
// WRIT (signer.getAddress()): 
//       0x52554BfE4baC4aE605Af27A2e131480F2D219Fe6
// METAMASK:
    // 0x52554BfE4baC4aE605Af27A2e131480F2D219Fe6

export const makePaymentOnOutstandingBalance = async (docId: string, amount:number) => {

  const docRef = (await db.collection('outstandingNftBalance').doc(docId).get()).ref

  docRef.update({balanceRemaining: FieldValue.increment(-amount)})
    .then(() => {
      console.log(`Succesfully made payment in Firestore of ${amount} ETH`);
    })
    .catch((err) => {
      console.error(err);
    });
}