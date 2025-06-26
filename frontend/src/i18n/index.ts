import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import language files from the new locales folder
import en from './locales/en.json';
import sin from './locales/sin.json';
import ta from './locales/ta.json';

// Import validation for development
import { devValidateTranslations } from './translationValidator';

// Language resources
const resources = {
  en: { translation: en },
  sin: { translation: sin },
  ta: { translation: ta },
};

// Supported languages configuration
export const supportedLanguages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'sin', name: 'Sinhala', nativeName: 'සිංහල' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
];

// Language detector options
const languageDetectorOptions = {
  // order and from where user language should be detected
  order: ['localStorage', 'navigator', 'htmlTag'],

  // keys or params to lookup language from
  lookupLocalStorage: 'stellarion-language',

  // cache user language on
  caches: ['localStorage'],

  // optional expire and domain for set cookie
  cookieMinutes: 10,
  cookieDomain: 'stellarion.com',

  // only detect languages that are in supported list
  checkWhitelist: true,
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',

    // Language detection options
    detection: languageDetectorOptions,

    // Supported languages (replaces whitelist in newer versions)
    supportedLngs: supportedLanguages.map(lang => lang.code),

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    // React specific options
    react: {
      useSuspense: false,
    },
  });

// Run validation in development mode
if (process.env.NODE_ENV === 'development') {
  devValidateTranslations();
}

export default i18n;
