import { ROUTES } from '@constants/routes';
import authService from '@services/auth.service';
import { Navigate, createBrowserRouter } from 'react-router-dom';
import App from '@/App';
import ForgotPassword from '@/modules/Auth/ForgotPassowrd';
import Login from '@/modules/Auth/Login';
import SendForgotMail from '@/modules/Auth/SendForgotMail';
import PharmaciesListPage from '@/modules/Pharmacies/_pages/PharmaciesListPage/PharmaciesListPage';
import PharmacyDetailsPage from '@/modules/Pharmacies/_pages/PharmacyDetailsPage/PharmacyDetailsPage';
import RequestsListPage from '@/modules/Requests/_pages/RequestsListPage';
import SettingsPage from '@/modules/Settings/SettingsPage';
import ErrorBoundary from '@/shared/Layouts/ErrorBoundary';
import ErrorComponent from '@/shared/Layouts/ErrorComponent';

type TLoginLoader = Promise<{
  isLoggedIn: boolean;
}>;

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    loader: async (): TLoginLoader => ({ isLoggedIn: await authService.isLoggedIn() }),
    errorElement: <ErrorBoundary isRoot />,
    children: [
      {
        path: ROUTES.DASHBOARD,
        element: <ErrorComponent error="soon" />,
      },
      {
        path: ROUTES.PHARMACIES,
        element: <PharmaciesListPage />,
      },
      {
        path: ROUTES.PHARMACIES + '/:pharmacyId',
        element: <PharmacyDetailsPage />,
      },
      { path: ROUTES.CLIENTS, element: <ErrorComponent error="soon" /> },
      { path: ROUTES.REQUESTS, element: <RequestsListPage /> },
      {
        path: ROUTES.ORDERS,
        element: <ErrorComponent error="soon" />,
      },
      {
        path: ROUTES.SETTINGS,
        element: <SettingsPage />,
      },
      {
        index: true,
        element: <Navigate to={ROUTES.PHARMACIES} />,
      },
    ],
  },
  {
    path: ROUTES.LOGIN,
    loader: async (): TLoginLoader => ({ isLoggedIn: await authService.isLoggedIn() }),
    element: <Login />,
  },
  {
    path: ROUTES.FORGOTPASSWORD,
    element: <ForgotPassword />,
  },
  {
    path: ROUTES.SENDFORGOTMAIL,
    element: <SendForgotMail />,
  },
]);
