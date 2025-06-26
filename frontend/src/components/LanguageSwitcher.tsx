import React from 'react';
import { useI18n } from '../i18n/useI18n';
import '../styles/components/_languageSwitcher.scss';

interface LanguageSwitcherProps {
    className?: string;
    showLabels?: boolean;
    variant?: 'dropdown' | 'buttons' | 'flags';
}

/**
 * Language Switcher Component
 * Provides multiple variants for language switching
 */
const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
    className = '',
    showLabels = false,
    variant = 'dropdown'
}) => {
    const { changeLanguage, getCurrentLanguage, getAvailableLanguages } = useI18n();
    const currentLang = getCurrentLanguage();
    const availableLanguages = getAvailableLanguages();

    const handleLanguageChange = (langCode: string) => {
        changeLanguage(langCode);
    };

    if (variant === 'dropdown') {
        return (
            <div className={`language-switcher ${className}`}>
                <select
                    value={currentLang.code}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="language-select"
                    aria-label="Select Language"
                >
                    {availableLanguages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                            {showLabels ? `${lang.nativeName} (${lang.name})` : lang.nativeName}
                        </option>
                    ))}
                </select>
            </div>
        );
    }

    if (variant === 'buttons') {
        return (
            <div className={`language-switcher language-buttons ${className}`}>
                {availableLanguages.map((lang) => (
                    <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`language-button ${currentLang.code === lang.code ? 'active' : ''}`}
                        aria-label={`Switch to ${lang.name}`}
                    >
                        {showLabels ? lang.name : lang.nativeName}
                    </button>
                ))}
            </div>
        );
    }

    if (variant === 'flags') {
        // Flag emoji mapping (can be replaced with actual flag images)
        const flagMap: Record<string, string> = {
            'en': '🇺🇸',
            'sin': '🇱🇰',
            'ta': '🇱🇰' // Tamil also uses Sri Lankan flag, or you could use a different representation
        };

        return (
            <div className={`language-switcher language-flags ${className}`}>
                {availableLanguages.map((lang) => (
                    <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`language-flag-button ${currentLang.code === lang.code ? 'active' : ''}`}
                        aria-label={`Switch to ${lang.name}`}
                        title={lang.name}
                    >
                        <span className="flag-emoji">{flagMap[lang.code] || '🌐'}</span>
                        {showLabels && <span className="flag-label">{lang.nativeName}</span>}
                    </button>
                ))}
            </div>
        );
    }

    return null;
};

export default LanguageSwitcher;
