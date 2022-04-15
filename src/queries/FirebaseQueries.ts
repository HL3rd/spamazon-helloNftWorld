import { db, FieldValue } from '../utils/firebase';
import { OutstandingNftBalance } from '../constants/class-objects';

export const queryOutstandingNftBalance = async (walletAddress:string) => {

  const querySnapshot = await db.collection('nftOutstandingBalance')
                      .where('buyerAddress', '==', walletAddress)
                      .where('balanceRemaining', '>', 0)
                      .orderBy('createdAt')
                      .get();

  const outstandingPaymentsArray = querySnapshot.docs.map((doc) => new OutstandingNftBalance(doc.id, doc.data()))

  return outstandingPaymentsArray;

}

export const makePaymentOnOutstandingBalance = async (walletAddress:string, productId:string) => {

}