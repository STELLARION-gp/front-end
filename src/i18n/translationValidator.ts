import { supportedLanguages } from './index';
import en from './locales/en.json';
import sin from './locales/sin.json';
import ta from './locales/ta.json';

/**
 * Translation validation utilities for development
 */

const translations = {
    en,
    sin,
    ta,
};

/**
 * Get all translation keys from a nested object
 */
function getAllKeys(obj: Record<string, unknown>, prefix = ''): string[] {
    let keys: string[] = [];

    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const fullKey = prefix ? `${prefix}.${key}` : key;

            if (typeof obj[key] === 'object' && obj[key] !== null) {
                keys = keys.concat(getAllKeys(obj[key] as Record<string, unknown>, fullKey));
            } else {
                keys.push(fullKey);
            }
        }
    }

    return keys;
}

/**
 * Validate translations across all languages
 */
export function validateTranslations(): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    stats: Record<string, number>;
} {
    const errors: string[] = [];
    const warnings: string[] = [];
    const stats: Record<string, number> = {};

    // Get all keys from each language
    const languageKeys = Object.fromEntries(
        supportedLanguages.map(lang => [
            lang.code,
            getAllKeys(translations[lang.code as keyof typeof translations])
        ])
    );

    // Count keys per language
    Object.entries(languageKeys).forEach(([lang, keys]) => {
        stats[lang] = keys.length;
    });

    // Find missing keys
    const allUniqueKeys = Array.from(
        new Set(Object.values(languageKeys).flat())
    );

    supportedLanguages.forEach(lang => {
        const langKeys = languageKeys[lang.code];
        const missingKeys = allUniqueKeys.filter(key => !langKeys.includes(key));

        if (missingKeys.length > 0) {
            errors.push(
                `Language '${lang.code}' (${lang.name}) is missing keys: ${missingKeys.join(', ')}`
            );
        }

        // Check for empty values
        const emptyKeys = checkEmptyValues(translations[lang.code as keyof typeof translations]);
        if (emptyKeys.length > 0) {
            warnings.push(
                `Language '${lang.code}' has empty values for keys: ${emptyKeys.join(', ')}`
            );
        }
    });

    return {
        isValid: errors.length === 0,
        errors,
        warnings,
        stats,
    };
}

/**
 * Check for empty or undefined values in translations
 */
function checkEmptyValues(obj: Record<string, unknown>, prefix = ''): string[] {
    let emptyKeys: string[] = [];

    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const fullKey = prefix ? `${prefix}.${key}` : key;

            if (typeof obj[key] === 'object' && obj[key] !== null) {
                emptyKeys = emptyKeys.concat(checkEmptyValues(obj[key] as Record<string, unknown>, fullKey));
            } else if (!obj[key] || obj[key]?.toString().trim() === '') {
                emptyKeys.push(fullKey);
            }
        }
    }

    return emptyKeys;
}

/**
 * Get translation key suggestions based on partial input
 */
export function getKeySuggestions(partialKey: string): string[] {
    const allKeys = getAllKeys(en);

    return allKeys
        .filter(key => key.toLowerCase().includes(partialKey.toLowerCase()))
        .sort()
        .slice(0, 10); // Limit to 10 suggestions
}

/**
 * Generate a report of translation status
 */
export function generateTranslationReport(): string {
    const validation = validateTranslations();

    let report = '# Translation Report\n\n';

    // Stats
    report += '## Statistics\n\n';
    Object.entries(validation.stats).forEach(([lang, count]) => {
        const langInfo = supportedLanguages.find(l => l.code === lang);
        report += `- **${langInfo?.name}** (${lang}): ${count} keys\n`;
    });

    // Errors
    if (validation.errors.length > 0) {
        report += '\n## ❌ Errors\n\n';
        validation.errors.forEach(error => {
            report += `- ${error}\n`;
        });
    } else {
        report += '\n## ✅ No Errors Found\n\n';
    }

    // Warnings
    if (validation.warnings.length > 0) {
        report += '\n## ⚠️ Warnings\n\n';
        validation.warnings.forEach(warning => {
            report += `- ${warning}\n`;
        });
    } else {
        report += '\n## ✅ No Warnings Found\n\n';
    }

    return report;
}

/**
 * Development helper to log translation validation
 */
export function devValidateTranslations(): void {
    if (process.env.NODE_ENV === 'development') {
        const validation = validateTranslations();

        if (!validation.isValid) {
            console.group('🌐 Translation Validation');
            console.warn('Translation validation failed:');
            validation.errors.forEach(error => console.error(`❌ ${error}`));
            validation.warnings.forEach(warning => console.warn(`⚠️ ${warning}`));
            console.log('📊 Stats:', validation.stats);
            console.groupEnd();
        } else {
            console.log('✅ All translations are valid');
        }
    }
}
