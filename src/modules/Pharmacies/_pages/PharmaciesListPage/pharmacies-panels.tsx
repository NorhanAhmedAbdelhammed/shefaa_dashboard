import type { ITabPanel } from '@UI/MainTabs/MainTabs';
import { HiExclamation, HiSun, HiViewGrid } from 'react-icons/hi';
import { EPHARMACY_STATUS } from '@servicesTypes/pharmacies.types';
import { PharmaciesTable } from '../../_components';

export const pharmaciesPanels: ITabPanel[] = [
  { key: 'all', title: 'All', component: <PharmaciesTable />, icon: HiViewGrid },
  {
    key: 'active',
    title: 'Active',
    component: <PharmaciesTable status={EPHARMACY_STATUS.ACTIVE} />,
    icon: HiSun,
  },
  {
    key: 'suspended',
    title: 'Suspended',
    component: <PharmaciesTable status={EPHARMACY_STATUS.SUSPENDED} />,
    icon: HiExclamation,
  },
];
