import { ITableData } from '@UI/DashboardTable/DashboardTable';
import MainPagination from '@UI/DashboardTable/MainPagination/MainPagination';
import { DashboardTable } from '@UI/index';
import { EPHARMACY_STATUS } from '@servicesTypes/pharmacies.types';
import { useSearchParams } from 'react-router-dom';
import usePharmaciesData from '../_hooks/usePharmaciesData';
import usePharmaciesList from '../_hooks/usePharmaciesList';

const headers = ['name', 'status', 'rating', 'pointsNumber', 'pickupMethod', 'actions'];
// TODO: Rating is hardcoded

const PharmaciesTable: React.FC<{ status?: EPHARMACY_STATUS }> = function ({ status }) {
  const [params] = useSearchParams();

  const pageIndex: number = +(params.get('page') ?? 1);
  const pageStatus: string = params.get('status') ?? '';

  const { data: pharmacyData, isLoading } = usePharmaciesData(pageIndex, status);
  const data: ITableData[] = usePharmaciesList(pharmacyData);

  return (
    <>
      <DashboardTable headers={headers} data={data} loading={isLoading} />

      <MainPagination data={pharmacyData} />
    </>
  );
};

export default PharmaciesTable;
