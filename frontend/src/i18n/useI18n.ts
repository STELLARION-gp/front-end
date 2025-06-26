import { useTranslation } from 'react-i18next';
import { supportedLanguages } from './index';

/**
 * Custom hook for translations with additional utilities
 * Provides easy access to translation functions and language management
 */
export const useI18n = () => {
    const { t, i18n } = useTranslation();

    /**
     * Change the current language
     * @param langCode - Language code (en, sin, ta)
     */
    const changeLanguage = (langCode: string) => {
        if (supportedLanguages.some(lang => lang.code === langCode)) {
            i18n.changeLanguage(langCode);
        } else {
            console.warn(`Language ${langCode} is not supported`);
        }
    };

    /**
     * Get the current language information
     */
    const getCurrentLanguage = () => {
        return supportedLanguages.find(lang => lang.code === i18n.language) || supportedLanguages[0];
    };

    /**
     * Check if the current language is RTL (Right-to-Left)
     * Useful for languages like Arabic, Hebrew
     */
    const isRTL = () => {
        const rtlLanguages = ['ar', 'he']; // Add RTL language codes here
        return rtlLanguages.includes(i18n.language);
    };

    /**
     * Get text direction based on current language
     */
    const getTextDirection = () => {
        return isRTL() ? 'rtl' : 'ltr';
    };

    /**
     * Format text with interpolation values
     * @param key - Translation key
     * @param values - Values for interpolation
     */
    const formatText = (key: string, values?: Record<string, string | number>) => {
        return t(key, values);
    };

    /**
     * Get all available languages
     */
    const getAvailableLanguages = () => {
        return supportedLanguages;
    };

    /**
     * Check if a translation key exists
     * @param key - Translation key to check
     */
    const keyExists = (key: string) => {
        return i18n.exists(key);
    };

    return {
        t,
        i18n,
        changeLanguage,
        getCurrentLanguage,
        isRTL,
        getTextDirection,
        formatText,
        getAvailableLanguages,
        keyExists,
        currentLanguage: i18n.language,
        isLanguageReady: i18n.isInitialized,
    };
};

/**
 * Translation key type helper for better TypeScript support
 * Usage: const key: TranslationKey = 'navbar.home';
 */
export type TranslationKey =
    | 'navbar.home'
    | 'navbar.about'
    | 'navbar.contact'
    | 'navbar.profile'
    | 'navbar.settings'
    | 'welcome'
    | 'hero.title'
    | 'hero.subtitle'
    | 'hero.description'
    | 'hero.getStarted'
    | 'hero.scrollToExplore'
    | 'auth.signIn'
    | 'auth.signUp'
    | 'auth.email'
    | 'auth.password'
    | 'auth.confirmPassword'
    | 'auth.forgotPassword'
    | 'auth.alreadyHaveAccount'
    | 'auth.dontHaveAccount'
    | 'auth.signOut'
    | 'pages.about.title'
    | 'pages.about.description'
    | 'pages.dashboard.title'
    | 'pages.dashboard.welcome'
    | 'pages.profile.title'
    | 'pages.profile.editProfile'
    | 'pages.settings.title'
    | 'pages.settings.language'
    | 'pages.settings.theme'
    | 'pages.settings.notifications'
    | 'common.loading'
    | 'common.error'
    | 'common.success'
    | 'common.cancel'
    | 'common.save'
    | 'common.edit'
    | 'common.delete'
    | 'common.confirm'
    | 'common.back'
    | 'common.next'
    | 'common.search'
    | 'features.exploration.title'
    | 'features.exploration.description'
    | 'features.learning.title'
    | 'features.learning.description'
    | 'features.community.title'
    | 'features.community.description';

export default useI18n;
