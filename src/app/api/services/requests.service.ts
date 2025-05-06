import { EAPI } from '@constants/endpoints';
import api from '..';

class Requests {
  /* API ENDPOINTS */
  public async list({
    sort = 'asc',
    perPage = 10,
    page = 1,
    approval = null,
  }: {
    sort?: string;
    perPage?: number;
    page?: number;
    approval: string | null;
  }): Promise<IEndpointResponse<any[], any>> {
    const { data } = await api.get(`${EAPI.PHARMACIES}/update-requests/`, {
      params: { sort, page, perPage, approval },
    });

    return data;
  }

  public async accept(requestId: number): Promise<IEndpointResponse<any[], any>> {
    const { data } = await api.post(`${EAPI.PHARMACIES}/update-requests/${requestId}/approve`);
    return data;
  }

  public async reject(requestId: number): Promise<IEndpointResponse<any[], any>> {
    const { data } = await api.patch(`${EAPI.PHARMACIES}/update-requests/${requestId}/reject`);
    return data;
  }

  /* API SCHEMAS */
  /* API FIELDS */
}

export default Object.freeze(new Requests());
