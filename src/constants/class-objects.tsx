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

export type OutstandingNftBalance = {
  amountOwed: Scalars['Float'];
  amountOwedStart: Scalars['Float'];
  buyerAddress: Scalars['String'];
  createdAt: Scalars['Int'];
  id: Scalars['String'];
  nftContractAddress: Scalars['String'];
  nftTokenId: Scalars['Int'];
  product: Product;
  sellerAddress: Scalars['String'];
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

export type Product = {
  description: Scalars['String'];
  productImageUrls: Array<Scalars['String']>;
  id: Scalars['String'];
  isListed: Scalars['Boolean'];
  name: Scalars['String'];
  price: Scalars['Int'];
  quantity: Scalars['Int'];
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
