import { envConfig } from '@app/config';
import { router } from '@app/router';
import { EAPI } from '@constants/endpoints';
import { ELocalStorageKeys } from '@constants/keys';
import { ILogin, IToken } from '@servicesTypes/auth.types';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import moment from 'moment';
import * as Yup from 'yup';

let accessToken = localStorage.getItem(ELocalStorageKeys.ACCESS_TOKEN) ?? '';
let refreshToken = localStorage.getItem(ELocalStorageKeys.REFRESH_TOKEN) ?? '';

class AuthService {
  private _guestAxios = axios.create({
    baseURL: envConfig.base_url,
  });

  private _decodeToken(token: string): IToken | null {
    try {
      const decoded = jwt_decode<IToken>(token);
      return decoded;
    } catch (e) {
      return null;
    }
  }

  /** SETTERS */
  setToken({
    newAccessToken,
    newRefreshToken,
  }: {
    newAccessToken: string;
    newRefreshToken: string;
  }): void {
    if (!newAccessToken) localStorage.removeItem(ELocalStorageKeys.ACCESS_TOKEN);
    if (!newRefreshToken) localStorage.removeItem(ELocalStorageKeys.REFRESH_TOKEN);

    accessToken = newAccessToken;
    refreshToken = newRefreshToken;

    localStorage.setItem(ELocalStorageKeys.ACCESS_TOKEN, newAccessToken);
    localStorage.setItem(ELocalStorageKeys.REFRESH_TOKEN, newRefreshToken);
  }

  /** GETTERS */
  async getDecodedToken(): Promise<IToken | null> {
    const token = await this.getToken();
    if (!token) return null;
    return this._decodeToken(token);
  }

  async getToken(): Promise<string | null> {
    if (this.hasExpired()) return await this.refreshToken();
    else return accessToken; // will return null if not existed
  }

  async isLoggedIn(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }

  hasExpired(): boolean {
    if (!accessToken) return false; // invalid or missing is not "expired"
    const decodedToken = jwt_decode<IToken>(accessToken);

    if (!decodedToken?.exp) return true;

    const now = moment();
    const expiryDate = moment.unix(decodedToken.exp);

    return expiryDate.isSameOrBefore(now, 'minute');
  }

  /* API ENDPOINTS */
  public async login({
    username,
    password,
  }: {
    username: string;
    password: string;
  }): Promise<ILogin> {
    const { data } = await this._guestAxios.post(`${EAPI.AUTH}/login`, { username, password });

    this.setToken({
      newAccessToken: data.data.accessToken,
      newRefreshToken: data.data.refreshToken,
    });

    window.location.href = '/'; // Redirect the user to the login page

    return data.data;
  }

  public async sendForgotPasswordMail(email: string): Promise<any> {
    const { data } = await this._guestAxios.post(`${EAPI.AUTH}/forget-password`, { email });

    return data.data;
  }

  public async resetPassword({
    verificationToken,
    password,
  }: {
    verificationToken: string;
    password: string;
  }): Promise<any> {
    const { data } = await this._guestAxios.post(`${EAPI.AUTH}/reset-forget-password`, {
      verificationToken,
      password,
    });

    return data.data;
  }

  /* METHODS */
  public logout(): void {
    this.setToken({ newAccessToken: '', newRefreshToken: '' });
    router.navigate('/login');
  }

  async refreshToken(): Promise<string | null> {
    if (!this.hasExpired()) return accessToken;

    try {
      const loginData = await this._guestAxios
        .post(`${EAPI.AUTH}/refresh-token`, { refreshToken })
        .then(({ data }) => data.data);

      this.setToken({
        newAccessToken: loginData?.accessToken,
        newRefreshToken: loginData?.refreshToken,
      });

      return loginData?.accessToken;
    } catch (e) {
      this.logout();
      return null;
    }
  }

  /* API SCHEMAS */
  public loginSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
    username: Yup.string()
      .min(2, 'Username must be at least 3 characters')
      .required('Username is required'),
  });
  public forgotPasswordSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
    're-password': Yup.string().oneOf([Yup.ref('password')], 'Passwords must match'),
  });

  /* API FIELDS */
  public loginFormFIelds: IFormField[] = [
    {
      name: 'username',
      title: 'Enter username',
      placeholder: 'username',
      wrapperClassName: 'col-span-2',
    },
    {
      name: 'password',
      title: 'Enter password',
      placeholder: 'password@Example123',
      type: 'password',
      wrapperClassName: 'col-span-2',
    },
  ];

  public forgotPassowrd: IFormField[] = [
    {
      name: 'password',
      title: 'Enter password',
      placeholder: 'password@Example123',
      type: 'password',
      wrapperClassName: 'col-span-2',
    },
    {
      name: 're-password',
      title: 'Re enter password',
      placeholder: 'Enter password',
      type: 'password',
      wrapperClassName: 'col-span-2',
    },
  ];
}

export default new AuthService();
