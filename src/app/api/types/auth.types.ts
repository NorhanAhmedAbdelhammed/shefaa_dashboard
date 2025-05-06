export enum ERole {
  SUPERADMIN = 'SUPERADMIN',
  SUBADMIN = 'SUBADMIN',
}

export interface ILogin {
  id: number | string;
  username: string;
  email: string;
  role: ERole;
  createdAt: Date;
  accessToken: string;
  refreshToken: string;
}

export interface IToken {
  id: number;
  username: string;
  email: string;
  role: ERole;
  iat: number;
  exp: number;
}
