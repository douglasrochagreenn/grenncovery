export interface PlanPayment {
  planPaymentId: string;
  status: string;
  createdAt: number;
  expires: number;
}
export interface Parameters {
  _id: string;
  key: string;
  value: string;
  userId: string;
  description: string;
  createdAt: number;
  expires: number;
}

export interface User {
  _id: string;
  token?: string;
  id?: string;
  email: string;
  username: string;
  phone: string;
  city: string;
  documentNumber: string;
  documentType: string;
  zipCode: string;
  createdAt: string;
  updatedAt: string;
  isAdmin: boolean;
  addressStreetName: string;
  addressNumber: string;
  state: string;
  neighborhood: string;
  parameters: Parameters[];
  profileImage: string;
  type: string;
  admin: boolean;
  favorites: string[];
  planPayments: PlanPayment[];
  createdAds: boolean;
  fantasyName: string;
  active: number;
  addressComplement: string;
  corporateReason: string;
  __v: number;
}
