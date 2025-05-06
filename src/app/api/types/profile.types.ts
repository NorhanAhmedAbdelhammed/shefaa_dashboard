import { ERole } from './auth.types';

export interface IProfile {
  admin: IAdmin;
  point: IPoint;
}

export interface IAdmin {
  id: number;
  username: string;
  email: string;
  role: ERole;
  profilePicturePath: any;
  profilePictureLink: any;
  createdAt: string;
}

export interface IPoint {
  id: number;
  minimumOrder: number;
  rewardPerPoint: string;
}
