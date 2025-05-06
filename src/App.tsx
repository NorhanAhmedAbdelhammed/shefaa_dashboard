import { ROUTES } from '@constants/routes';
import { useAppDispatch } from '@hooks';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, Outlet, useLoaderData } from 'react-router-dom';
import AdminLayout from './shared/Layouts/AdminLayout';
import { getAdminProfileThunk } from './store/slices/auth.slice';

const App = (): JSX.Element => {
  const { i18n } = useTranslation();
  const { isLoggedIn } = useLoaderData() as { isLoggedIn: boolean };
  const dispatch = useAppDispatch();

  useEffect(() => {
    // this is controlled by "lang" key in the local storage
    document.documentElement.dir = i18n.dir();
  }, [i18n.language]);

  useEffect(() => {
    if (isLoggedIn) dispatch(getAdminProfileThunk());
  }, []);

  if (!isLoggedIn) return <Navigate to={ROUTES.LOGIN} />;

  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
};

export default App;
