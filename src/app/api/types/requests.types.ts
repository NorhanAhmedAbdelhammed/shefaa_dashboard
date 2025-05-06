import { IPharmacy } from './pharmacies.types';
import { IAdmin } from './profile.types';

export interface IRequest {
  id: number;
  pharmacyId: number;
  adminId: number;
  status?: string;
  approval: string;
  createdAt: string;
  Admin: IAdmin;
  Pharmacy: IPharmacy;
  cityId?: number;
  latitude?: string;
  longitude?: string;
  streetName?: string;
  subAdministrativeArea?: string;
  building?: string;
  landmark?: string;
  reasonId?: number;
  reason?: IReason;
  contractId?: number;
}

export interface IReason {
  id: number;
  statement: string;
  images: Image[];
}

export interface Image {
  id: number;
  reasonId: number;
  contractId: any;
  imageLink: string;
  imagePath: string;
}
