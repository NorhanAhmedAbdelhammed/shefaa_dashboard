import { ITableData } from '@UI/DashboardTable/DashboardTable';
import MainPagination from '@UI/DashboardTable/MainPagination/MainPagination';
import MainTabs, { ITabPanel } from '@UI/MainTabs/MainTabs';
import { DashboardTable, PageContainer } from '@UI/index';
import { getUpdatedKeys } from '@app/utils';
import requestsService from '@services/requests.service';
import { EPHARMACY_STATUS } from '@servicesTypes/pharmacies.types';
import { IRequest } from '@servicesTypes/requests.types';
import classNames from 'classnames';
import { t } from 'i18next';
import moment from 'moment';
import { HiCheckCircle, HiExclamation, HiSun, HiViewGrid } from 'react-icons/hi';
import { useSearchParams } from 'react-router-dom';
import useSWR from 'swr';
import ReqestActionsModal from '../_components/modals/RequestActionsModal';

const RequestsListPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab') ?? 'all';
  const pageIndex = +(searchParams.get('page') ?? 1);

  const {
    data: requestsData,
    isLoading,
    mutate: refetch,
  } = useSWR(['requests-list', pageIndex, tab], ([, page]) =>
    requestsService.list({ page, approval: getCurrentState() })
  );

  function getCurrentState(): string | null {
    const paneTitle = tab.toLocaleLowerCase();
    if (paneTitle === 'all') return null;
    return paneTitle.toLocaleUpperCase();
  }

  const headers = ['date', 'admin', 'pharmacy', 'approval', 'actions'];
  const data: ITableData[] =
    requestsData?.data?.map((request: IRequest) => {
      const { Admin, Pharmacy, reason, ...item } = request;

      // let changeType = '';
      const changes = getUpdatedKeys(Pharmacy, item, [
        'id',
        'adminId',
        // 'contractId',
        'pharmacyId',
        'createdAt',
        'reasonId',
        'approval',
      ]);
      // if (_.difference(Object.keys(changes), ['status']).length > 0) changeType = 'Activation';
      // else if (_.difference(Object.keys(changes), ['contractId']).length > 0)
      //   changeType = 'Renew Contract';
      // else changeType = 'Location';

      return {
        id: item.id,
        cols: {
          ...item,
          date: <p className="w-14">{moment(item.createdAt).format('DD-MM-YYYY')}</p>,

          pharmacy: (
            <div className="w-28">
              <h1 className="font-semibold">
                {Pharmacy.nameEn}
                {!Pharmacy.hasCompeletedProfile && (
                  <span className="ml-2 text-xs text-slate-400">({t('Not Completed')})</span>
                )}
              </h1>
              <h2>{Pharmacy.nameAr}</h2>
            </div>
          ),
          reason: <p className="w-36 whitespace-normal">{reason?.statement ?? '---'}</p>,
          admin: (
            <div className="w-28 overflow-hidden text-ellipsis">
              <h1 className="font-semibold">{Admin.username}</h1>
              <h2 className="overflow-hidden text-ellipsis text-sm">{Admin.email}</h2>
            </div>
          ),
          // 'change type': (
          //   <ul className="list-outside list-disc">
          //     {
          //       'approvedAt' in changes || changeType
          //       // Object.entries(changes).map(([name, change]) => (
          //       //   <li key={name + change} className="capitalize">
          //       //     {name === 'contractId' ? 'Renew Contract' : splitCamelCase(name)}
          //       //   </li>
          //       // ))
          //     }
          //   </ul>
          // ),
          approval: (
            <p
              className={classNames('w-24', 'flex flex-row items-center gap-1', {
                'text-success': item.approval === 'APPROVED',
                'text-danger': item.approval === 'REJECTED',
                'text-warning': item.approval === 'PENDING',
              })}>
              {item.approval === EPHARMACY_STATUS.ACTIVE && <HiSun />}
              {item.approval === EPHARMACY_STATUS.SUSPENDED && <HiExclamation />}
              <span className="lowercase first-letter:capitalize">{item.approval}</span>
            </p>
          ),
          actions: (
            <div className="flex w-min flex-row items-center gap-3">
              <ReqestActionsModal request={request} refetch={refetch} />
            </div>
          ),
        },
        rowClassName: classNames({ '!bg-success/5': !Object.keys(changes).length }),
      };
    }) ?? [];

  const panels: ITabPanel[] = [
    {
      key: 'all',
      title: 'All',
      component: (
        <>
          <DashboardTable headers={headers} data={data} loading={isLoading} />
          <MainPagination data={requestsData} />
        </>
      ),
      icon: HiViewGrid,
    },
    {
      key: 'pending',
      title: 'Pending',
      component: (
        <>
          <DashboardTable headers={headers} data={data} loading={isLoading} />
          <MainPagination data={requestsData} />
        </>
      ),
      icon: HiSun,
    },
    {
      key: 'approved',
      title: 'Approved',
      component: (
        <>
          <DashboardTable headers={headers} data={data} loading={isLoading} />
          <MainPagination data={requestsData} />
        </>
      ),
      icon: HiCheckCircle,
    },
    {
      key: 'rejected',
      title: 'Rejected',
      component: (
        <>
          <DashboardTable headers={headers} data={data} loading={isLoading} />
          <MainPagination data={requestsData} />
        </>
      ),
      icon: HiExclamation,
    },
  ];

  return (
    <PageContainer title="requests">
      <div className="block items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700 sm:flex">
        <div className="mb-1 w-full">
          <div className="block items-center sm:flex">
            <div className="flex w-full items-center sm:justify-end">
              {/* <ReqestActionsModal onClose={() => setOpen(false)} isOpen={isOpen} /> */}
            </div>
          </div>
        </div>
      </div>
      <MainTabs panels={panels} />
      {/* <DashboardTable headers={headers} data={data} loading={isLoading} /> */}
      {/* <Pagination /> */}
    </PageContainer>
  );
};

export default RequestsListPage;
