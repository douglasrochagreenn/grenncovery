import { VehicleModality, VehicleVersion } from "./adsInterface";

// Interface Vehicle ( model )
export interface Vehicle {
  _id: string;
  brandId: string;
  model: string;
  type: string;
  version: string;
  vehicleModalityId: string;
  vehicleVersionIds: string[];
  totalVehicleVersions: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  vehicleVersion: VehicleVersion;
  vehicleModality: VehicleModality;
  // existe na api get all
  vehicleVersions: VehicleVersion[];
}
