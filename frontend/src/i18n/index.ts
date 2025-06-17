import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './en.json';
import sin from './sin.json';

i18n
  .use(LanguageDetector) // optional: detects user language
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      sin: { translation: sin },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
