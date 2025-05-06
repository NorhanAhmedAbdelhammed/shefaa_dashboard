import { EAPI } from '@constants/endpoints';
import { IProfile } from '@servicesTypes/profile.types';
import * as Yup from 'yup';
import api from '..';
class Profile {
  /* API ENDPOINTS */
  public async get(): Promise<IProfile> {
    const { data } = await api.get(EAPI.PROFILE);
    return data.data;
  }

  public async updatePassword(obj: { oldPassword: string; newPassword: string }): Promise<any> {
    const { data } = await api.post(`${EAPI.AUTH}/reset-password`, obj);
    return data.data;
  }

  public async updatePoints(obj: { minimumOrder: number; rewardPerPoint: number }): Promise<any> {
    const { data } = await api.put(`${EAPI.ADMIN}/point-system`, obj);
    return data.data;
  }

  public async updateProfile(obj: any): Promise<any> {
    const { data } = await api.put(`${EAPI.ADMIN}/profile`, obj, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data.data;
  }

  /* API SCHEMAS */
  public updatePasswordSchema = Yup.object().shape({
    oldPassword: Yup.string().required('Old password is required'),
    newPassword: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
    confirmNewPassword: Yup.string().oneOf([Yup.ref('newPassword')], 'Passwords must match'),
  });

  public updatePointsSchema = Yup.object().shape({
    minimumOrder: Yup.number().required(),
    rewardPerPoint: Yup.number().required(),
  });

  /* API FIELDS */
  public editProfileDetails: IFormField[] = [
    {
      name: 'email',
      title: 'Email',
      placeholder: 'admin@admin.com',
      type: 'text',
      readOnly: true,
      disabled: true,
    },
    {
      name: 'username',
      title: 'Username',
      placeholder: 'admin_username',
      type: 'text',
      readOnly: true,
      disabled: true,
    },
    {
      name: 'password',
      title: 'Password',
      placeholder: 'Password',
      type: 'password',
      defaultValue: '********',
      readOnly: true,
      disabled: true,
    },
  ];

  public updatePasswordFields: IFormField[] = [
    {
      name: 'oldPassword',
      title: 'Old Password',
      placeholder: 'Enter the old password',
      type: 'password',
    },
    {
      name: 'newPassword',
      title: 'New Password',
      placeholder: 'Enter a new password',
      type: 'password',
    },
    {
      name: 'confirmNewPassword',
      title: 'Confirm New Password',
      placeholder: 'Re-enter the new password',
      type: 'password',
    },
  ];

  public pointFields: IFormField[] = [
    {
      name: 'minimumOrder',
      title: 'Minimum Order',
      placeholder: 'Enter the minimum order',
      type: 'number',
      min: 0,
      minLength: 1,
    },
    {
      name: 'rewardPerPoint',
      title: 'Rewards per Point',
      placeholder: 'Reward per point',
      type: 'number',
      min: 0,
      minLength: 1,
    },
  ];
}

export default Object.freeze(new Profile());
