# Stellarion Multi-Language Support Documentation

## Overview

This document outlines the comprehensive multi-language implementation for the Stellarion website, supporting English, Sinhala, and Tamil languages using react-i18next.

## Architecture

### Folder Structure
```
src/
├── i18n/
│   ├── index.ts              # Main i18n configuration
│   ├── useI18n.ts           # Custom hook for translations
│   └── locales/             # Language files
│       ├── en.json          # English translations
│       ├── sin.json         # Sinhala translations
│       └── ta.json          # Tamil translations
├── components/
│   └── LanguageSwitcher.tsx # Language switcher component
└── styles/
    └── components/
        └── _languageSwitcher.scss # Language switcher styles
```

## Features

### 1. Supported Languages
- **English (en)**: Primary language, used as fallback
- **Sinhala (sin)**: Native Sri Lankan language
- **Tamil (ta)**: Secondary Sri Lankan language

### 2. Language Detection
- Automatically detects user's browser language
- Falls back to stored preference in localStorage
- Uses English as the ultimate fallback

### 3. Language Persistence
- User's language preference is saved in localStorage
- Remembers selection across browser sessions
- Key: `stellarion-language`

## Implementation Guide

### Setting Up Translations

#### 1. Adding New Translation Keys

Add new keys to all language files in the same structure:

**English (en.json):**
```json
{
  "newSection": {
    "title": "New Feature",
    "description": "This is a new feature description"
  }
}
```

**Sinhala (sin.json):**
```json
{
  "newSection": {
    "title": "නව විශේෂාංගය",
    "description": "මෙය නව විශේෂාංග විස්තරයකි"
  }
}
```

**Tamil (ta.json):**
```json
{
  "newSection": {
    "title": "புதிய அம்சம்",
    "description": "இது ஒரு புதிய அம்சத்தின் விளக்கம்"
  }
}
```

#### 2. Using Translations in Components

```tsx
import React from 'react';
import { useI18n } from '../i18n/useI18n';

const MyComponent = () => {
  const { t } = useI18n();

  return (
    <div>
      <h1>{t('newSection.title')}</h1>
      <p>{t('newSection.description')}</p>
    </div>
  );
};
```

#### 3. Using Translation Keys with TypeScript

For better TypeScript support, use the provided type:

```tsx
import { TranslationKey } from '../i18n/useI18n';

const key: TranslationKey = 'navbar.home';
const text = t(key);
```

### Language Switcher Component

#### Basic Usage

```tsx
import LanguageSwitcher from '../components/LanguageSwitcher';

// Dropdown variant (default)
<LanguageSwitcher />

// Button variant
<LanguageSwitcher variant="buttons" showLabels={true} />

// Flag variant
<LanguageSwitcher variant="flags" showLabels={false} />
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'dropdown' \| 'buttons' \| 'flags'` | `'dropdown'` | Display style |
| `showLabels` | `boolean` | `false` | Show language names |
| `className` | `string` | `''` | Additional CSS classes |

### Advanced Usage

#### 1. Conditional Text Based on Language

```tsx
const { getCurrentLanguage } = useI18n();
const currentLang = getCurrentLanguage();

if (currentLang.code === 'sin') {
  // Sinhala-specific logic
}
```

#### 2. Text Interpolation

```tsx
// In translation file
{
  "welcome": "Welcome, {{name}}!"
}

// In component
const { formatText } = useI18n();
const welcomeText = formatText('welcome', { name: 'John' });
```

#### 3. Checking if Translation Exists

```tsx
const { keyExists } = useI18n();

if (keyExists('optional.feature')) {
  // Render optional content
}
```

#### 4. Programmatic Language Change

```tsx
const { changeLanguage } = useI18n();

const handleLanguageSwitch = () => {
  changeLanguage('ta'); // Switch to Tamil
};
```

## Best Practices

### 1. Translation Key Naming

Use hierarchical naming for better organization:

```json
{
  "pages": {
    "home": {
      "title": "Home Page",
      "sections": {
        "hero": "Welcome Section"
      }
    }
  },
  "components": {
    "navbar": {
      "items": {
        "home": "Home",
        "about": "About"
      }
    }
  },
  "common": {
    "buttons": {
      "save": "Save",
      "cancel": "Cancel"
    }
  }
}
```

### 2. Avoid Hard-coded Text

❌ **Don't do this:**
```tsx
<button>Save Changes</button>
```

✅ **Do this:**
```tsx
<button>{t('common.buttons.save')}</button>
```

### 3. Consistent Translation Structure

Keep the same key structure across all language files to avoid missing translations.

### 4. Use Descriptive Keys

❌ **Avoid:**
```json
{
  "text1": "Welcome",
  "btn1": "Click Here"
}
```

✅ **Prefer:**
```json
{
  "hero.welcome": "Welcome",
  "cta.getStarted": "Click Here"
}
```

## Content Guidelines

### 1. Sinhala Text Guidelines
- Use proper Unicode characters
- Ensure proper font support in CSS
- Consider text length differences (Sinhala can be longer)

### 2. Tamil Text Guidelines
- Use proper Tamil Unicode encoding
- Test with Tamil fonts
- Consider cultural context in translations

### 3. English Text Guidelines
- Use clear, concise language
- Avoid technical jargon
- Keep sentences short for easier translation

## Testing Translations

### 1. Manual Testing
1. Change language using the language switcher
2. Navigate through all pages
3. Check for missing translations (should fallback to English)
4. Verify text formatting and layout

### 2. Automated Testing
```tsx
// Example test
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';

test('renders translated text', () => {
  render(
    <I18nextProvider i18n={i18n}>
      <MyComponent />
    </I18nextProvider>
  );
  
  expect(screen.getByText('Home')).toBeInTheDocument();
});
```

## Common Issues & Solutions

### 1. Missing Translations
**Problem:** Text shows the key instead of translated text.
**Solution:** Check if the key exists in all language files.

### 2. Language Not Persisting
**Problem:** Language resets on page refresh.
**Solution:** Verify localStorage is working and `stellarion-language` key is being set.

### 3. Layout Issues with Long Text
**Problem:** Sinhala/Tamil text breaks layout.
**Solution:** Use CSS `word-break` and `overflow-wrap` properties.

```scss
.translatable-text {
  word-break: break-word;
  overflow-wrap: break-word;
}
```

## Performance Considerations

### 1. Lazy Loading (Future Enhancement)
For larger applications, consider lazy loading language files:

```tsx
// Future implementation
const loadLanguage = async (lang: string) => {
  const translations = await import(`./locales/${lang}.json`);
  return translations.default;
};
```

### 2. Translation Caching
The current implementation caches translations in memory. For production, consider:
- CDN caching for language files
- Service worker caching
- Browser cache headers

## Adding New Languages

To add a new language (e.g., French):

1. Create `src/i18n/locales/fr.json`
2. Add French translations following the existing structure
3. Update `src/i18n/index.ts`:
   ```tsx
   import fr from './locales/fr.json';
   
   const resources = {
     en: { translation: en },
     sin: { translation: sin },
     ta: { translation: ta },
     fr: { translation: fr }, // Add this
   };
   
   export const supportedLanguages = [
     // ... existing languages
     { code: 'fr', name: 'French', nativeName: 'Français' },
   ];
   ```
4. Update TypeScript types in `useI18n.ts`

## Deployment Considerations

### 1. Build Process
Ensure all language files are included in the build:
- Check that JSON files are copied to the dist folder
- Verify import paths are correct
- Test language switching in production build

### 2. SEO Considerations
For better SEO with multiple languages:
- Consider implementing URL-based language routing (`/en/`, `/sin/`, `/ta/`)
- Add `hreflang` attributes
- Use proper `lang` attribute on HTML element

### 3. Analytics
Track language usage:
```tsx
const { getCurrentLanguage } = useI18n();

// Track language change
analytics.track('language_changed', {
  from: 'en',
  to: getCurrentLanguage().code
});
```

## Support & Maintenance

### Regular Tasks
1. **Review Translations:** Regularly review and update translations for accuracy
2. **Add Missing Keys:** Monitor for hard-coded text and convert to translations
3. **Performance Monitoring:** Check bundle size impact of language files
4. **User Feedback:** Collect feedback on translation quality

### Tools for Translators
Consider using translation management tools:
- **i18next-parser:** Extract translation keys automatically
- **Crowdin/Lokalise:** Professional translation services
- **Translation validation scripts:** Ensure all keys exist in all languages

---

This implementation provides a robust foundation for multi-language support in the Stellarion website. Follow these guidelines to maintain consistency and ensure a great user experience across all supported languages.
