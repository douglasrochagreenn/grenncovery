export interface Brand {
  _id: string;
  name: string;
  brandLogo: string;
  country: string;
  createdAt: string;
  updatedAt: string;
  totalVehicles: number;
  __v: number;
  // extra
  value: string;
  checked: boolean;
}
