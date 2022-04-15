import { db, FieldValue } from '../utils/firebase';
import { OutstandingNftBalance } from '../constants/class-objects';

export const queryOutstandingNftBalances = async (walletAddress:string) => {

  console.log(`CALLING WITH THIS ADDRESS: ${walletAddress}`);

  const querySnapshot = await db.collection('outstandingNftBalance')
                      .where('buyerAddress', '==', walletAddress)
                      .where('balanceRemaining', '>', 0)
                      .orderBy('balanceRemaining')
                      .orderBy('createdAt')
                      .get();
                      
  console.log(`${JSON.stringify(querySnapshot.docs)}`);

  const outstandingPaymentsArray = querySnapshot.docs.map((doc) => new OutstandingNftBalance(doc.id, doc.data()))

  return outstandingPaymentsArray;

}

export const makePaymentOnOutstandingBalance = async (docId: string, amount:number) => {

  const docRef = (await db.collection('nftOutstandingBalance').doc(docId).get()).ref

  docRef.update({balanceRemaining: FieldValue.increment(-amount)})
    .then(() => {
      console.log(`Succesfully made payment in Firestore of ${amount} ETH`);
    })
    .catch((err) => {
      console.error(err);
    });
}