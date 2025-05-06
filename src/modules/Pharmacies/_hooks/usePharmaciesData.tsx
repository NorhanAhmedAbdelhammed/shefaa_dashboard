import pharmaciesService from '@services/pharmacies.service';
import { EPHARMACY_STATUS, ITablePharmacy } from '@servicesTypes/pharmacies.types';
import useSWR from 'swr';

type pharmaciesFetcherType = ([, pharmacyStatus, page]: [any, EPHARMACY_STATUS, number]) => Promise<
  IEndpointResponse<ITablePharmacy[], any>
>;
const pharmaciesListFetcher: pharmaciesFetcherType = async ([, pharmacyStatus, page]) =>
  pharmaciesService.list({ page, pharmacyStatus, perPage: 7 });

function usePharmaciesData(
  pageIndex: number,
  status?: EPHARMACY_STATUS
): {
  data: IEndpointResponse<ITablePharmacy[], any> | undefined;
  isLoading: boolean;
} {
  const { data, isLoading } = useSWR(['list-pharmacies', status, pageIndex], pharmaciesListFetcher);

  return {
    data,
    isLoading,
  };
}

export default usePharmaciesData;
