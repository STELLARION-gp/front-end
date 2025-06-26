# Stellarion Internationalization (i18n) Guide

## Overview

Stellarion supports three languages:
- **English** (`en`) - Default language
- **Sinhala** (`sin`) - Sinhala language for Sri Lankan users
- **Tamil** (`ta`) - Tamil language for Tamil-speaking users

## File Structure

```
src/i18n/
├── index.ts                    # i18n configuration
├── useI18n.ts                  # Custom hook with utilities
├── locales/
│   ├── en.json                # English translations
│   ├── sin.json               # Sinhala translations
│   └── ta.json                # Tamil translations
└── README.md                   # This documentation
```

## Setup and Configuration

### 1. Dependencies

The following packages are already installed:
- `i18next` - Core internationalization framework
- `react-i18next` - React bindings for i18next
- `i18next-browser-languagedetector` - Automatic language detection

### 2. Configuration

The i18n setup is in `src/i18n/index.ts` with:
- Language detection from localStorage, browser, and HTML tag
- Fallback to English if language is not supported
- Local storage caching with key `stellarion-language`

### 3. Initialization

i18n is initialized in `src/main.tsx`:
```tsx
import './i18n'
```

## How to Use Translations in Components

### Method 1: Using the Custom Hook (Recommended)

```tsx
import { useI18n } from '../i18n/useI18n';

const MyComponent = () => {
  const { t, changeLanguage, getCurrentLanguage } = useI18n();
  
  return (
    <div>
      <h1>{t('hero.title')}</h1>
      <p>{t('hero.description')}</p>
    </div>
  );
};
```

### Method 2: Using react-i18next Hook

```tsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('hero.title')}</h1>
      <button onClick={() => i18n.changeLanguage('sin')}>
        Switch to Sinhala
      </button>
    </div>
  );
};
```

## Available Translation Keys

### Navigation
- `navbar.home` - Home
- `navbar.about` - About
- `navbar.contact` - Contact
- `navbar.profile` - Profile
- `navbar.settings` - Settings

### Hero Section
- `hero.title` - Main title
- `hero.subtitle` - Subtitle
- `hero.description` - Description text
- `hero.getStarted` - Call-to-action button
- `hero.scrollToExplore` - Scroll instruction

### Authentication
- `auth.signIn` - Sign In
- `auth.signUp` - Sign Up
- `auth.email` - Email
- `auth.password` - Password
- `auth.confirmPassword` - Confirm Password
- `auth.forgotPassword` - Forgot Password?
- `auth.alreadyHaveAccount` - Already have an account?
- `auth.dontHaveAccount` - Don't have an account?
- `auth.signOut` - Sign Out

### Pages
- `pages.about.title` - About page title
- `pages.about.description` - About page description
- `pages.dashboard.title` - Dashboard title
- `pages.dashboard.welcome` - Dashboard welcome message
- `pages.profile.title` - Profile page title
- `pages.profile.editProfile` - Edit profile button
- `pages.settings.title` - Settings page title
- `pages.settings.language` - Language setting
- `pages.settings.theme` - Theme setting
- `pages.settings.notifications` - Notifications setting

### Common Terms
- `common.loading` - Loading...
- `common.error` - Error
- `common.success` - Success
- `common.cancel` - Cancel
- `common.save` - Save
- `common.edit` - Edit
- `common.delete` - Delete
- `common.confirm` - Confirm
- `common.back` - Back
- `common.next` - Next
- `common.search` - Search

### Features
- `features.exploration.title` - 3D Universe Exploration
- `features.exploration.description` - Exploration description
- `features.learning.title` - Astronomy Learning
- `features.learning.description` - Learning description
- `features.community.title` - Community
- `features.community.description` - Community description

## Language Switcher Component

### Basic Usage

```tsx
import LanguageSwitcher from '../components/LanguageSwitcher';

// Dropdown variant (default)
<LanguageSwitcher />

// Button variant
<LanguageSwitcher variant="buttons" showLabels={true} />

// Flag variant
<LanguageSwitcher variant="flags" showLabels={false} />
```

### Props

- `variant`: `'dropdown' | 'buttons' | 'flags'` (default: 'dropdown')
- `showLabels`: `boolean` - Show language names (default: false)
- `className`: `string` - Additional CSS classes

## Adding New Languages

### 1. Create Translation File

Create a new JSON file in `src/i18n/locales/` (e.g., `fr.json` for French):

```json
{
  "navbar": {
    "home": "Accueil",
    "about": "À propos",
    // ... other translations
  }
  // ... rest of the structure
}
```

### 2. Update Configuration

In `src/i18n/index.ts`:

```tsx
// Import the new language
import fr from './locales/fr.json';

// Add to resources
const resources = {
  en: { translation: en },
  sin: { translation: sin },
  ta: { translation: ta },
  fr: { translation: fr }, // Add new language
};

// Add to supported languages
export const supportedLanguages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'sin', name: 'Sinhala', nativeName: 'සිංහල' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'fr', name: 'French', nativeName: 'Français' }, // Add new language
];
```

### 3. Update Language Switcher (Optional)

If using the flag variant, add the flag emoji in `LanguageSwitcher.tsx`:

```tsx
const flagMap: Record<string, string> = {
  'en': '🇺🇸',
  'sin': '🇱🇰',
  'ta': '🇱🇰',
  'fr': '🇫🇷', // Add new flag
};
```

## Adding New Translation Keys

### 1. Update All Language Files

Add the new key to all language files (`en.json`, `sin.json`, `ta.json`):

```json
{
  "newSection": {
    "newKey": "New English Text"
  }
}
```

### 2. Update TypeScript Types

In `src/i18n/useI18n.ts`, add the new key to the `TranslationKey` type:

```tsx
export type TranslationKey = 
  | 'navbar.home'
  // ... existing keys
  | 'newSection.newKey'; // Add new key
```

### 3. Use in Components

```tsx
const MyComponent = () => {
  const { t } = useI18n();
  
  return <div>{t('newSection.newKey')}</div>;
};
```

## Text Interpolation

For dynamic text with variables:

### Translation File
```json
{
  "welcome": "Welcome {{name}} to Stellarion!"
}
```

### Component Usage
```tsx
const { t } = useI18n();
const userName = "John";

return <h1>{t('welcome', { name: userName })}</h1>;
```

## Best Practices

### 1. Consistent Key Naming
- Use dot notation for nested keys: `section.subsection.key`
- Use camelCase for key names: `signUp`, `confirmPassword`
- Group related keys together: `auth.*`, `navbar.*`

### 2. Fallback Strategy
- Always provide English translations as fallback
- Keep translation keys meaningful and descriptive
- Avoid hardcoded strings in components

### 3. Context-Aware Translations
- Consider cultural differences in text length
- Be mindful of right-to-left languages if added later
- Test all languages in the UI to ensure proper display

### 4. Translation File Organization
```json
{
  "navigation": { ... },
  "authentication": { ... },
  "pages": {
    "pageName": {
      "title": "...",
      "content": { ... }
    }
  },
  "common": { ... },
  "errors": { ... }
}
```

## Language Detection Priority

1. **localStorage** - Previously selected language
2. **navigator** - Browser language preference
3. **htmlTag** - HTML lang attribute
4. **fallback** - English (if none detected)

## Development Tips

### 1. Missing Translation Detection

Use the development mode to see missing translations:
```tsx
// In development, missing keys are logged to console
const { keyExists } = useI18n();

if (!keyExists('some.key')) {
  console.warn('Missing translation for: some.key');
}
```

### 2. Language Testing

Quickly test different languages:
```tsx
const { changeLanguage } = useI18n();

// For development/testing
changeLanguage('sin'); // Switch to Sinhala
changeLanguage('ta');  // Switch to Tamil
changeLanguage('en');  // Switch to English
```

### 3. Debugging

Enable debug mode in development:
```tsx
// In src/i18n/index.ts
debug: process.env.NODE_ENV === 'development',
```

## Styling Considerations

### 1. Text Length Variations
Different languages have different text lengths. Ensure your CSS can accommodate:

```scss
.button-text {
  min-width: 120px; // Accommodate longer translations
  text-align: center;
}
```

### 2. Font Support
Ensure fonts support all character sets:

```scss
body {
  font-family: 'Inter', 'Noto Sans Sinhala', 'Noto Sans Tamil', sans-serif;
}
```

This comprehensive i18n setup provides a solid foundation for Stellarion's multilingual support with room for future expansion and easy maintenance.
