import { EAPI } from '@constants/endpoints';
import {
  EPHARMACY_STATUS,
  ICreatePharmacy,
  IPharmacy,
  ITablePharmacy,
} from '@servicesTypes/pharmacies.types';
import * as Yup from 'yup';
import { $date, $email, $password } from '@app/utils/common-schemas';
import api from '..';
import {
  createFormFields,
  editFormFields,
  renewContractFormFields,
  resetLocationFormFields,
  suspendFormFields,
} from './pharmacies/formFields';

class Pharmacy {
  /* API ENDPOINTS */
  public async get(id: string | number): Promise<IPharmacy> {
    const { data } = await api.get(`${EAPI.PHARMACIES}/pharmacy-details/${id}`);
    return data.data;
  }

  public async list({
    pharmacyStatus,
    perPage,
    page,
  }: {
    pharmacyStatus?: EPHARMACY_STATUS;
    page: number;
    perPage: number;
  }): Promise<IEndpointResponse<ITablePharmacy[], any>> {
    const { data } = await api.get(`${EAPI.PHARMACIES}`, {
      params: { page, pharmacyStatus, perPage },
    });
    return data;
  }

  public async create(
    pharmacy: ICreatePharmacy
  ): Promise<IEndpointResponse<Omit<ICreatePharmacy, 'password'>, any>['data']> {
    const { data } = await api.post(EAPI.PHARMACIES, pharmacy, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data.data;
  }

  public async delete(id: string | number) {
    const { data } = await api.delete(`${EAPI.PHARMACIES}/${id}`);
    return data;
  }

  public async resetLocation(id: string | number, formData: any) {
    const { data } = await api.put(`${EAPI.PHARMACIES}/reset-location/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  }
  public async renewContract(id: string | number, formData: any) {
    const { data } = await api.put(`${EAPI.PHARMACIES}/renew-contract/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  }

  public async updateStatus({ id, formData }: { id: string | number; formData: any }) {
    const { data } = await api.put(`${EAPI.PHARMACIES}/update-status/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  }

  public async updatePharmacy({ id, formData }: { id: string | number; formData: any }) {
    const { data } = await api.put(`${EAPI.PHARMACIES}/update-profile/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  }

  /* API SCHEMAS */
  public createSchema = Yup.object().shape({
    email: $email,
    password: $password,
    username: Yup.string()
      .min(3, 'Username must be at least 3 characters')
      .required('Username is required'),
    nameAr: Yup.string()
      .matches(/^[\u0621-\u064A\s]+$/, 'Please enter a valid Arabic name')
      .required('Arabic name is required'),
    nameEn: Yup.string()
      .matches(/^[a-zA-Z\s]+$/, 'Please enter a valid English name')
      .required('English name is required'),
    startOfContract: $date,
    endOfContract: $date.min(Yup.ref('startOfContract'), "End date can't be before Start date"),
    images: Yup.array(Yup.mixed()).min(1).required('Contract images are required'),
  });

  public resetLocationSchema = Yup.object().shape({
    password: Yup.string().min(8, 'Password must be at least 8 characters').optional(),
    images: Yup.array(Yup.mixed()).min(1).required('Contract images are required'),
  });

  public renewContractSchema = Yup.object().shape({
    startOfContract: $date,
    endOfContract: $date.min(Yup.ref('startOfContract'), "End date can't be before Start date"),
    reasons: Yup.string().optional(),
    images: Yup.array(Yup.mixed()).min(1).required('Contract images are required'),
  });

  /* API FIELDS */
  public createFormFields: IFormField[] = createFormFields;

  public editFormFields: IFormField[] = editFormFields;

  public renewContractFormFields: IFormField[] = renewContractFormFields;

  public suspendFormFields: IFormField[] = suspendFormFields;

  public resetLocationFormFields: IFormField[] = resetLocationFormFields;
}

export default Object.freeze(new Pharmacy());
