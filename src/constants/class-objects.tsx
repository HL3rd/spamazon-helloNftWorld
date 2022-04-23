export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
  Decimal: any;
  Timestamp: any;
};

const testProduct:Product = {
  description: 'A new revolutionary product A new revolutionary product A new revolutionary product A new revolutionary product A new revolutionary product A new revolutionary product A new revolutionary product',
  productImageUrls: ['https://images-na.ssl-images-amazon.com/images/I/91TvWl33h4L.jpg', "https://i.kym-cdn.com/entries/icons/mobile/000/006/026/NOTSUREIF.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Giraffa_camelopardalis_angolensis.jpg/1024px-Giraffa_camelopardalis_angolensis.jpg"],
  id: '00000',
  isListed: true,
  name: 'Guide to the Universe Book',
  price: 10000,
  quantity: 100,
};

export class OutstandingNftBalance {
  public balanceRemaining: Scalars['Float'];
  public balanceStart: Scalars['Float'];
  public buyerAddress: Scalars['String'];
  public createdAt: Scalars['Int'];
  public id: Scalars['String'];
  public nftContractAddress: Scalars['String'];
  public nftImageUrl: Scalars['String'];
  public nftTokenId: Scalars['Int'];
  public product: Product;
  public sellerAddress: Scalars['String'];

  constructor(id:string, data:any) {
    this.balanceRemaining = (data.balanceRemaining ? data.balanceRemaining : 0);
    this.balanceStart = (data.balanceStart ? data.balanceStart : 0);
    this.buyerAddress = (data.buyerAddress ? data.buyerAddress : '');
    this.createdAt = (data.createdAt ? data.createdAt : 0);
    this.id = id;
    this.nftContractAddress = (data.nftContractAddress ? data.nftContractAddress : '');
    this.nftImageUrl = (data.nftImageUrl ? data.nftImageUrl : '');
    this.nftTokenId = (data.nftTokenId ? data.nftTokenId : '');
    this.product = (data.product ? data.product : testProduct);
    this.sellerAddress = (data.sellerAddress ? data.sellerAddress : '');
  }
};

export type EndedNftBalance = {
  amountOwed: Scalars['Float'];
  amountOwedStart: Scalars['Float'];
  buyerAddress: Scalars['String'];
  createdAt: Scalars['Int'];
  id: Scalars['String'];
  nftContractAddress: Scalars['String'];
  nftTokenId: Scalars['Int'];
  outstandingBalanceCreatedAt: Scalars['Int'];
  product: Product;
  sellerAddress: Scalars['String'];
};

export class Product {
  public description: Scalars['String'];
  public id: Scalars['String'];
  public isListed: Scalars['Boolean'];
  public name: Scalars['String'];
  public price: Scalars['Int'];
  public productImageUrls: Array<Scalars['String']>;
  public quantity: Scalars['Int'];

  constructor(id:string, data:any) {
    this.description = (data.description ? data.description : '');
    this.id = id;
    this.isListed = (data.isListed ? data.isListed : true);
    this.name = (data.name ? data.name : '');
    this.price = (data.price ? data.price : 0);
    this.productImageUrls = (data.productImageUrls ? data.productImageUrls : ['https://firebasestorage.googleapis.com/v0/b/sp-hellonftworld.appspot.com/o/publicProductImages%2Fspam_costume.png?alt=media&token=70beb50b-9a28-42f2-bbfa-c7c2ecb1ed9e']);
    this.quantity = (data.quantity ? data.quantity : 0);
  }
};

export type ProductOrder = {
  buyerWalletAddress: Scalars['String'];
  createdAt: Scalars['String'];
  id: Scalars['String'];
  productId: Scalars['String'];
  storeWalletAddress: Scalars['String'];
};

export enum ProductOrderStateEnum {
  OrderCreated = 'orderCreated',
  OrderProcessing = 'orderProcessing',
  OrderCompleted = 'orderCompleted',
  OrderFailed = 'orderFailed',
  OrderShipping = 'orderShipping',
  OrderDelivered = 'orderDelivered'
}
