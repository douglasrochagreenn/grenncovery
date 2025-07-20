import { User, Brand, Vehicle } from "@/utils";

export interface Advertisement {
  _id: string;
  brandId: string;
  brand: Brand;
  model: Model;
  ModelYear: string;
  manufacturingYear: string;
  vehicleVersionId: string;
  armor: string;
  transmission: string;
  status: string;
  doors: string;
  color: string;
  state: string;
  city: string;
  bodywork: string;
  fuel: string;
  acceptsTrade: string;
  endPlate: string;
  mileage: string;
  vechicleDescription: string;
  price: string;
  vechicleInformation: string;
  optionals: string[];
  images: AdImages[];
  user: User;
}

// export interface ImageItem {
//   url: string;
//   file: File | null;
//   isCover: boolean;
//   isUploadButton?: boolean;
//   photoUrl?: string;
// }

export interface AdvertisementDetail {
  _id: string;
  mileage: number;
  price: string;
  color: string;
  vechicleDescription: string;
  optionals: string[];
  acceptsTrade: string;
  publishDate: string;
  state: string;
  city: string;
  status: string;
  userId: string;
  brandId: string;
  vehicleVersionId: string;
  model: Model;
  armor: string;
  manufacturingYear: string;
  ModelYear: string;
  bodywork: string;
  fuel: string;
  endPlate: string;
  vechicleInformation: string;
  advertisementPhotosIds: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
  user: User;
  brand: Brand;
  images: AdImages[];
}

export interface Model {
  _id: string;
  model: string;
  fuelType: string;
  fipe: FipeModel;
  transmission: string;
  vehicleVersionIds: string[];
  vehicleModalityId: string;
  brandId: string;
  year: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  vehicleVersion: VehicleVersion;
  vehicleModality: VehicleModality;
}

export interface FipeModel {
  _id: string;
  fipePrice: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface VehicleVersion {
  _id: string;
  modelVehicle: string;
  fuelType: string;
  transmission: string;
  versionName: string;
  type: string;
  vehicleModalityId: string;
  brandId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface VehicleModality {
  _id: string;
  modality: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface AdImages {
  _id: string;
  advertisementId: string;
  photoUrl: string;
  isCover: boolean;
  __v: number;
  createdAt: string;
  updatedAt: string;
  // edit ads img
  url?: string;
  file?: File | null;
  isUploadButton?: boolean;
}

export interface AutoComplete {
  brand: Brand[];
  model: Vehicle[];
}

export interface OptionalCategory {
  _id: string;
  name: string;
  description: string;
  vehicleType: string;
}

export interface VehicleOptional {
  _id: string;
  vehicleType: string;
  optional: string;
  optionalCategoryId: string;
  optionalCategory: OptionalCategory;
}

export type VehicleOptionalWithChecked = VehicleOptional & { checked: boolean };
