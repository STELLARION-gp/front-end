# LoadingSpinner Implementation Guide

This guide covers the comprehensive loading animation system implemented across the STELLARION frontend project using Lottie animations and consistent loading states.

## 🎯 Overview

The LoadingSpinner component provides a unified loading experience throughout the application with:
- **Lottie Animation**: Beautiful solar system animation from `loading.json`
- **CSS Fallback**: Smooth spinning animation for fallback scenarios
- **Multiple Variants**: Different sizes, colors, and message options
- **Consistent Integration**: Used across buttons, page transitions, and auth flows

## 📦 Components

### 1. LoadingSpinner Component
**Location**: `src/components/LoadingSpinner.tsx`

**Props**:
```typescript
interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  width?: number;              // Custom width override
  height?: number;             // Custom height override
  message?: string;            // Loading message
  showMessage?: boolean;       // Show/hide message
  variant?: 'primary' | 'secondary' | 'white' | 'dark';
  className?: string;          // Additional CSS classes
  useLottie?: boolean;         // Use Lottie vs CSS fallback
  centered?: boolean;          // Center in container
}
```

**Usage Examples**:
```tsx
// Basic spinner
<LoadingSpinner />

// Large spinner with message
<LoadingSpinner 
  size="large" 
  showMessage={true} 
  message="Loading dashboard..." 
/>

// Button spinner
<LoadingSpinner 
  size="small" 
  variant="white" 
  useLottie={true} 
/>

// Fullscreen loader
<LoadingSpinner 
  size="fullscreen" 
  variant="white" 
  showMessage={true} 
  message="Authenticating..." 
  centered={true} 
/>
```

### 2. FullScreenLoader Component
**Location**: `src/components/FullScreenLoader.tsx`

**Props**:
```typescript
interface FullScreenLoaderProps {
  isVisible: boolean;
  message?: string;
  opacity?: number;     // Background overlay opacity (0-1)
  className?: string;
}
```

**Usage**:
```tsx
<FullScreenLoader 
  isVisible={isLoading} 
  message="Loading application..." 
  opacity={0.7} 
/>
```

### 3. useLoading Hook
**Location**: `src/hooks/useLoading.ts`

**Returns**:
```typescript
interface UseLoadingReturn {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
  withLoading: <T>(asyncFn: () => Promise<T>) => Promise<T>;
}
```

**Usage**:
```tsx
const { isLoading, withLoading } = useLoading();

// Wrap async operations
await withLoading(async () => {
  const data = await fetchData();
  setData(data);
});

// Manual control
const { isLoading, startLoading, stopLoading } = useLoading();
```

## 🎨 Implementation Details

### Lottie Animation
- **Source**: `src/assets/loading.json`
- **Animation**: Solar system with orbiting planets
- **Library**: `lottie-react` (already installed)
- **Fallback**: CSS spinner when `useLottie={false}`

### CSS Styling
- **Location**: `src/styles/components/_loadingSpinner.scss`
- **Features**: Size variants, color themes, animations
- **Integration**: Imported in `src/styles/main.scss`

### Size Variants
- **small**: 24x24px (for buttons)
- **medium**: 48x48px (default)
- **large**: 80x80px (for cards/sections)
- **fullscreen**: 120x120px (for page overlays)

### Color Variants
- **primary**: Blue theme (#3b82f6)
- **secondary**: Gray theme (#6b7280)
- **white**: White theme (for dark backgrounds)
- **dark**: Dark theme (#1f2937)

## 🔧 Integration Points

### 1. Button Component
**File**: `src/components/Button.tsx`
- Integrated LoadingSpinner for loading states
- Uses `size="small"` with appropriate color variant
- Replaces previous simple "⟳" spinner

### 2. Authentication Flow
**Files**: 
- `src/pages/Login.tsx`
- `src/pages/Signup.tsx`
- `src/components/ProtectedRoute.tsx`

**Updates**:
- Replaced manual loading state with `useLoading` hook
- Added LoadingSpinner for better UX
- Consistent error handling

### 3. Protected Routes
**File**: `src/components/ProtectedRoute.tsx`
- Shows LoadingSpinner during authentication check
- Uses "Authenticating..." message
- White variant for visibility

## 📱 Usage Scenarios

### Button Loading States
```tsx
<Button 
  loading={isLoading} 
  onClick={handleSubmit}
>
  Submit
</Button>
```

### Page Loading States
```tsx
{isLoading ? (
  <LoadingSpinner 
    size="large" 
    showMessage={true} 
    message="Loading content..." 
  />
) : (
  <PageContent />
)}
```

### Full Screen Loading
```tsx
<FullScreenLoader 
  isVisible={isPageLoading} 
  message="Initializing application..." 
/>
```

### API Call Loading
```tsx
const { isLoading, withLoading } = useLoading();

const handleFetch = async () => {
  await withLoading(async () => {
    const response = await api.getData();
    setData(response);
  });
};
```

## 🎯 Best Practices

### 1. Choose Appropriate Sizes
- **Buttons**: Use `size="small"`
- **Content Areas**: Use `size="medium"` or `size="large"`
- **Full Page**: Use `size="fullscreen"` or `FullScreenLoader`

### 2. Color Matching
- **Dark backgrounds**: Use `variant="white"`
- **Light backgrounds**: Use `variant="primary"` or `variant="dark"`
- **Branded areas**: Use `variant="primary"`

### 3. Messages
- Keep messages short and descriptive
- Use present continuous tense ("Loading...", "Authenticating...")
- Match your app's tone

### 4. Performance
- Use `useLottie={false}` for very small spinners or high-frequency updates
- Use `useLottie={true}` for better visual appeal in prominent locations

## 🔄 Migration from Old System

### Before
```tsx
// Old button loading
{loading && <span className="btn__spinner">⟳</span>}

// Old page loading
<div className="loading-container">
  <div className="loading-spinner">Loading...</div>
</div>
```

### After
```tsx
// New button loading
<LoadingSpinner size="small" variant="white" />

// New page loading
<LoadingSpinner 
  size="large" 
  showMessage={true} 
  message="Loading..." 
  variant="white"
/>
```

## 🎨 Customization

### Adding New Variants
1. Add variant to TypeScript interface
2. Add color styles in `_loadingSpinner.scss`
3. Update variant mapping in component

### Custom Animations
1. Replace `loading.json` with your Lottie file
2. Ensure animation loops properly
3. Test performance across devices

### Size Customization
- Use `width` and `height` props for exact sizing
- Or extend size variants in CSS

## 🐛 Troubleshooting

### Animation Not Loading
- Check if `lottie-react` is properly installed
- Verify `loading.json` path is correct
- Fall back to CSS spinner if needed

### Performance Issues
- Use CSS spinner for small/frequent animations
- Optimize Lottie file size if needed
- Consider reducing animation complexity

### Styling Conflicts
- Check CSS specificity
- Ensure proper import order in `main.scss`
- Use className prop for custom overrides

## 🚀 Future Enhancements

1. **Theme Integration**: Connect with app-wide theming system
2. **Custom Messages**: I18n support for loading messages
3. **Progress Indicators**: Add percentage-based progress bars
4. **Animation Variations**: Multiple Lottie animations for different contexts
5. **Accessibility**: Enhanced screen reader support and reduced motion options

This implementation provides a solid foundation for consistent, beautiful loading states throughout the STELLARION application while maintaining excellent performance and accessibility.
