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
