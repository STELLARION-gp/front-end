/**
 * TypeScript interfaces for i18n translations
 * This provides type safety for translation keys
 */

export interface NavbarTranslations {
    home: string;
    about: string;
    contact: string;
    profile: string;
    settings: string;
}

export interface HeroTranslations {
    title: string;
    subtitle: string;
    description: string;
    getStarted: string;
    scrollToExplore: string;
}

export interface AuthTranslations {
    signIn: string;
    signUp: string;
    email: string;
    password: string;
    confirmPassword: string;
    forgotPassword: string;
    alreadyHaveAccount: string;
    dontHaveAccount: string;
    signOut: string;
}

export interface PageTranslations {
    about: {
        title: string;
        description: string;
    };
    dashboard: {
        title: string;
        welcome: string;
    };
    profile: {
        title: string;
        editProfile: string;
    };
    settings: {
        title: string;
        language: string;
        theme: string;
        notifications: string;
    };
}

export interface CommonTranslations {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    save: string;
    edit: string;
    delete: string;
    confirm: string;
    back: string;
    next: string;
    search: string;
}

export interface FeatureTranslations {
    exploration: {
        title: string;
        description: string;
    };
    learning: {
        title: string;
        description: string;
    };
    community: {
        title: string;
        description: string;
    };
}

/**
 * Main translation interface
 * This should match the structure of your JSON files
 */
export interface Translations {
    navbar: NavbarTranslations;
    welcome: string;
    hero: HeroTranslations;
    auth: AuthTranslations;
    pages: PageTranslations;
    common: CommonTranslations;
    features: FeatureTranslations;
}

/**
 * Supported language interface
 */
export interface SupportedLanguage {
    code: string;
    name: string;
    nativeName: string;
}

/**
 * i18n Configuration interface
 */
export interface I18nConfig {
    defaultLanguage: string;
    supportedLanguages: SupportedLanguage[];
    fallbackLanguage: string;
    storageKey: string;
}

export type { Translations as default };
