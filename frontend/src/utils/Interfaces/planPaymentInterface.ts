export interface IPlanPayment {
  _id: string;
  customerId?: string;
  paymentIntent?: string;
  userId: string;
  stripePlanID: string;
  stripeSubscriptionID?: string;
  stripeSessionID: string;
  amount: number;
  paymentDate: string;
  expirationDate?: string;
  type: string;
  status: string;
  purchaseType: string;
  pathFrontRedictToCheckPayment: string;
  userIdToChat?: string;
  advertisementId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
