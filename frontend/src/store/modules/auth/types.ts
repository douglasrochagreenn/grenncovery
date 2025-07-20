export interface User {
  id: string;
  email: string;
  username: string;
  mobile: string;
  first_name: string;
  last_name: string;
  phone: string;
  type: string;
  city: string;
  documentNumber: string;
  documentType: string;
  tradingName: string;
  zipCode: string;
  addressStreetName: string;
  addressNumber: string;
  addressComplement: string;
  neighborhood: string;
  province: string;
  active: string;
  token: string;
}

export type ResultType = {
  [key: string]: string;
};
