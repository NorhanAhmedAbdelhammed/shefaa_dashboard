import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';
import { ELocalStorageKeys } from '@constants/keys';

// eslint-disable-next-line import/no-named-as-default-member
i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)

  .init({
    lng: localStorage.getItem(ELocalStorageKeys.LANGUAGE) ?? 'en',
    fallbackLng: 'en',
    supportedLngs: ['en', 'ar'],
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
  });

export default i18n;
