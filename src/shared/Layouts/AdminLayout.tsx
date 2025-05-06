import { Button } from '@UI/index';
import { ROUTES } from '@constants/routes';
import { useMediaQuery } from '@hooks';
import classNames from 'classnames';
import { Modal, Sidebar, Tooltip } from 'flowbite-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  HiCog,
  HiMenuAlt1,
  HiOutlineExclamationCircle,
  HiTable,
  HiViewBoards,
} from 'react-icons/hi';
import { HiChartPie, HiInbox, HiOutlineGlobeAlt, HiShoppingBag, HiUser } from 'react-icons/hi2';
import { NavLink, useNavigate } from 'react-router-dom';
import { ReactSVG } from 'react-svg';
import { logout } from '@/store/slices/auth.actions';

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface INavItems {
  title: string;
  icon: any;
  link: string;
  onClick?: any;
  label?: string;
}

console.log('ADMIN');
const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const matches = useMediaQuery('(max-width: 768px)');
  const navigate = useNavigate();
  const [isOpen, setOpen] = useState(false);

  const [isSidebarCollapsed, setSidebarCollapse] = useState(matches);
  const { i18n, t } = useTranslation();
  const logoURL = isSidebarCollapsed ? '/assets/logo/logo.svg' : '/assets/logo/logo-row-ar.svg';
  const SidebarLogo = new URL(logoURL, import.meta.url ?? import.meta.env.BASE_URL).href;
  const NavItems: INavItems[][] = [
    [
      { title: 'Dashboard', icon: HiChartPie, link: ROUTES.DASHBOARD },
      { title: 'Pharmacies', icon: HiViewBoards, link: ROUTES.PHARMACIES },
      { title: 'Clients', icon: HiUser, link: ROUTES.CLIENTS },
      { title: 'Requests', icon: HiInbox, link: ROUTES.REQUESTS },
      { title: 'Orders', icon: HiShoppingBag, link: ROUTES.ORDERS },
    ],
    [
      {
        title: i18n.language === 'ar' ? 'English' : 'العربية',
        icon: HiOutlineGlobeAlt,
        link: '#',
        onClick: () => {
          const newLang = i18n.language === 'ar' ? 'en' : 'ar';
          localStorage.setItem('lang', newLang);
          i18n.changeLanguage(newLang);
        },
      },
    ],
    [
      {
        title: 'Settings',
        icon: HiCog,
        link: ROUTES.SETTINGS,
      },
      {
        title: 'Logout',
        icon: HiTable,
        link: '#',
        onClick: () => {
          setOpen(true);
        },
      },
    ],
  ];

  return (
    <>
      <div className="flex h-screen w-full flex-col overflow-hidden">
        <div className="flex w-full flex-row bg-gray-50 dark:bg-gray-900">
          <div className="dark h-screen w-fit">
            <Sidebar
              aria-label="Shefaa sidebar"
              collapsed={isSidebarCollapsed}
              className="dark relative transition-width [&>div]:rounded-none">
              <HiMenuAlt1
                size={25}
                onClick={() => setSidebarCollapse((s) => !s)}
                className="absolute top-1 z-10 cursor-pointer text-blue-2 drop-shadow-sm transition-colors hover:text-primary hover:drop-shadow-lg active:scale-95 active:drop-shadow-md ltr:-right-8 rtl:-left-8 rtl:-scale-x-100"
              />
              <Sidebar.Items className="mb-3 border-b-[1px] border-b-gray-1/10 pb-5 pt-2">
                <span className="flex flex-row items-center gap-3 self-center whitespace-nowrap text-xl font-semibold text-primary dark:text-white">
                  <ReactSVG
                    wrapper="svg"
                    src={SidebarLogo}
                    className="h-12 w-full"
                    beforeInjection={(svg) => {
                      svg.setAttribute('style', 'height: 100%;');
                      return svg;
                    }}
                    title="Shefaa Logo"
                  />
                </span>
              </Sidebar.Items>
              <Sidebar.Items className="flex min-h-[80vh] flex-col">
                {NavItems.map((group, groupIdx, arr) => (
                  <Sidebar.ItemGroup
                    key={groupIdx}
                    className={classNames({ 'mt-auto': arr.length - 1 === groupIdx })}>
                    {group.map((item, itemIdx) => {
                      const Icon = item.icon;

                      return (
                        <NavLink
                          to={item.link ?? '/'}
                          onClick={item.onClick}
                          className={({ isActive }): string =>
                            classNames('block rounded-lg transition-all', {
                              'text-primary/80 hover:bg-blue-5 hover:text-primary dark:text-blue-2/70 dark:hover:text-primary/80':
                                !isActive || item.link === '#',
                              'bg-primary text-white dark:bg-white dark:text-primary':
                                isActive && item.link !== '#',
                            })
                          }
                          key={itemIdx}>
                          {({ isActive }) => {
                            if (!isSidebarCollapsed)
                              return (
                                <li className="flex h-11 items-center rounded-lg p-2">
                                  <Icon className="h-6 w-6" />
                                  <span className="flex-1 whitespace-nowrap text-lg ltr:ml-3 rtl:mr-3">
                                    {t(item.title)}
                                  </span>
                                  <span className="inline-flex items-center justify-center rounded-full bg-gray-200 px-2 text-sm font-medium text-gray-800 ltr:ml-3 rtl:mr-3 dark:bg-gray-700 dark:text-gray-300">
                                    {!!item.label && t(item.label)}
                                  </span>
                                </li>
                              );
                            return (
                              <li className="flex h-11 items-center rounded-lg p-2">
                                <Tooltip
                                  placement="right"
                                  content={t(item.title)}
                                  animation="duration-300">
                                  <Icon className="h-6 w-6 ltr:mr-3 rtl:ml-3" />
                                </Tooltip>
                              </li>
                            );
                          }}
                        </NavLink>
                      );
                    })}
                  </Sidebar.ItemGroup>
                ))}
              </Sidebar.Items>
            </Sidebar>
          </div>
          <main className="relative mx-auto h-full max-h-screen w-full flex-1 overflow-y-auto px-3 pt-8 xs:px-5 sm:px-6 md:px-7 lg:px-8">
            <div className="mx-auto h-full max-w-7xl">{children}</div>
          </main>
          {isOpen && (
            <Modal
              size="md"
              dismissible
              popup={true}
              onClose={() => setOpen(false)}
              show={isOpen}
              className="absolute inset-0 !h-full"
              position="center">
              <Modal.Header />
              <Modal.Body>
                <div className="text-center">
                  <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                  <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                    Are you sure you want to logout?
                  </h3>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Button variant="primary" onClick={() => setOpen(false)}>
                      No, stay in site
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => {
                        navigate(ROUTES.LOGIN);

                        logout();
                      }}>
                      Yes, I&apos;m sure
                    </Button>
                  </div>
                </div>
              </Modal.Body>
            </Modal>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
