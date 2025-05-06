import SuspenseLoader from '@UI/Loaders/SuspenseLoader';
import i18n from '@app/locales/i18n';
import { router } from '@app/router';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { SWRConfig } from 'swr';
import store from './store/store';


import './index.css';

document.querySelector('#loader.shefaa-loader')?.remove();

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        <HelmetProvider>
          <SWRConfig
            value={{
              revalidateIfStale: false,
              revalidateOnMount: true,
              revalidateOnFocus: true,
              dedupingInterval: 6000,
              loadingTimeout: 4000,
              errorRetryCount: 3,
            }}>
            <Suspense fallback={<SuspenseLoader />}>
              <RouterProvider router={router} />
            </Suspense>
          </SWRConfig>
          <ToastContainer autoClose={1500} position="bottom-right" theme="colored" />
        </HelmetProvider>
      </Provider>
    </I18nextProvider>
  </React.StrictMode>
);
