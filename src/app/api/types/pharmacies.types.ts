export enum EPICKUP_METHOD {
  BOTH = 'BOTH',
  DELIVERY = 'DELIVERY',
  PICKUP = 'PICKUP',
}

export enum EPHARMACY_STATUS {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
}

interface ICity {
  id: number;
  nameEn: string;
  nameAr: string;
  latitude: string;
  longitude: string;
  createdAt: string;
}

export interface IPharmacy {
  id: number;
  email: string;
  username: string;
  nameEn?: string;
  nameAr?: string;
  cityId?: number;
  streetName?: string;
  subAdministrativeArea?: string;
  building?: string;
  landmark?: string;
  ownerPhoneNumber?: string;
  whatsAppNumber?: string;
  hotline?: string;
  description?: string;
  latitude?: string;
  longitude?: string;
  hasCompeletedProfile?: boolean;
  hasChangedPassword?: boolean;
  status: EPHARMACY_STATUS;
  pointsNumber?: number;
  pickupMethod?: EPICKUP_METHOD;
  imagePath?: string;
  contractImagesLink: string[];
  imageLink?: string;
  city?: ICity;
  startOfContract: Date;
  endOfContract: Date;
}

export interface ITablePharmacy {
  id: number;
  nameEn: string;
  nameAr: string;
  status: EPHARMACY_STATUS;
  pickupMethod?: EPICKUP_METHOD;
  pointsNumber?: number;
  hasCompeletedProfile: boolean;
}

export interface ICreatePharmacy {
  email: string;
  username: string;
  password: string;
  nameAr: string;
  nameEn: string;
  images: File[];
}

export interface IResetLocationPharamcy {
  password?: string;
  reason: string;
  latitude: number;
  longitude: number;
}
