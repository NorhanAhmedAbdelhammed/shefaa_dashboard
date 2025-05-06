import { ITableData } from '@UI/DashboardTable/DashboardTable';
import { Button } from '@UI/index';
import { EPHARMACY_STATUS, EPICKUP_METHOD, ITablePharmacy } from '@servicesTypes/pharmacies.types';
import classNames from 'classnames';
import { Rating } from 'flowbite-react';
import { useTranslation } from 'react-i18next';
import { HiExclamation, HiInformationCircle, HiShoppingCart, HiSun, HiTruck } from 'react-icons/hi';
import { HiBuildingStorefront } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';

type pharmaciesListProps = IEndpointResponse<ITablePharmacy[], any> | undefined;

function usePharmaciesList(pharmacyData: pharmaciesListProps): ITableData[] {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    pharmacyData?.data?.map(({ status, pointsNumber, pickupMethod, ...item }: ITablePharmacy) => ({
      id: item.id,
      cols: {
        name: (
          <div className="w-28">
            <h1 className="font-semibold">
              {item.nameEn}
              {!item.hasCompeletedProfile && (
                <span className="ml-2 text-xs text-slate-400">({t('Not Completed')})</span>
              )}
            </h1>
            <h2>{item.nameAr}</h2>
          </div>
        ),
        pointsNumber: <div className="">{pointsNumber ?? 0}</div>,
        status: (
          <p
            className={classNames('w-24', 'flex flex-row items-center gap-1', {
              'text-success': status === EPHARMACY_STATUS.ACTIVE,
              'text-warning': status === EPHARMACY_STATUS.SUSPENDED,
            })}>
            {status === EPHARMACY_STATUS.ACTIVE && <HiSun />}
            {status === EPHARMACY_STATUS.SUSPENDED && <HiExclamation />}
            <span className="lowercase first-letter:capitalize">{status}</span>
          </p>
        ),
        rating: (
          <Rating className="w-16">
            <Rating.Star />
            <Rating.Star />
            <Rating.Star />
            <Rating.Star filled={false} />
            <Rating.Star filled={false} />
          </Rating>
        ),
        pickupMethod: (
          <div>
            {pickupMethod === EPICKUP_METHOD.PICKUP ? (
              <span className="flex flex-row items-center gap-2 capitalize">
                <HiBuildingStorefront className="text-lg" />
                <span>{t('pickup')}</span>
              </span>
            ) : pickupMethod === EPICKUP_METHOD.DELIVERY ? (
              <span className="flex flex-row items-center gap-2 capitalize">
                <HiTruck className="text-lg" />
                <span>{t('delivery')}</span>
              </span>
            ) : (
              <span className="flex flex-row items-center gap-2 capitalize">
                <HiShoppingCart className="text-lg" />
                <span>{t('both')}</span>
              </span>
            )}
          </div>
        ),
        actions: (
          <div className="flex w-min flex-row items-center gap-3">
            <Button onClick={() => navigate(`${item.id}`)}>
              <HiInformationCircle className="text-lg" />
              Details
            </Button>{' '}
          </div>
        ),
        ...item,
      },
      rowClassName: classNames({ '!bg-dark/5': !item.hasCompeletedProfile }),
    })) ?? []
  );
}

export default usePharmaciesList;
