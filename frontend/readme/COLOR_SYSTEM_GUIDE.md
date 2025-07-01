# STELLARION Color System Documentation

This document outlines the complete color system for the STELLARION project, ensuring consistency across all components, styles, and themes.

## 📂 File Structure

```
src/
├── styles/
│   ├── abstracts/
│   │   ├── _variables.scss          # Main color variables
│   │   ├── _galaxy-colors.scss      # Galaxy-specific colors
│   │   ├── _colors.scss            # Central import file
│   │   └── _mixins.scss            # Color-related mixins
│   └── utilities/
│       └── _galaxy.scss            # Galaxy utility classes
├── utils/
│   ├── galaxyColors.js             # JS color constants
│   └── galaxyColors.ts             # TS color constants
└── tailwind.config.js              # Tailwind color configuration
```

## 🎨 Color Palettes

### Galaxy Colors (Primary)
These are bright, vibrant colors used for UI accents and 3D visualizations:

- **Pink**: `#FF61F6` - Bright pink for highlights
- **Purple**: `#7B4BFF` - Bright purple for primary actions
- **Cyan**: `#00E5FF` - Bright cyan for information
- **Aqua**: `#5DF9FF` - Bright aqua for secondary actions
- **Gold**: `#FFD500` - Bright gold for success states
- **Orange**: `#FF7D00` - Bright orange for warnings
- **Hot Pink**: `#FF0070` - Hot pink for special emphasis
- **Electric Blue**: `#01FEFE` - Electric blue for links
- **Green**: `#01FF89` - Bright green for positive feedback
- **White**: `#FFFFFF` - Pure white for text and stars

### Theme Colors (Base)
Foundation colors for the application structure:

- **Theme1**: `#040C24` - Deep space blue (backgrounds)
- **Theme2**: `#0A205A` - Space navy (sections)
- **Theme3**: `#108CFF` - Bright blue (primary)
- **Theme4**: `#9DA5BD` - Steel gray (text)
- **Theme5**: `#E6F9FF` - Ice blue (highlights)

### Accretion Disk Colors (3D Components)
Specific colors for the BlackHole component:

- **Inner**: `#FFFFFF` - White hot center
- **Middle**: `#FF4000` - Orange-red middle
- **Outer**: `#FF1020` - Deep red outer edge

## 🛠 Usage

### In SCSS Files

```scss
@use '../abstracts/colors' as *;

.my-component {
  color: $galaxy-purple;
  background: $galaxy-gradient-1;
  @include cosmic-glow($galaxy-cyan);
}
```

### In Tailwind Classes

```html
<div class="text-galaxy-purple bg-galaxyGradient1">
  <button class="text-galaxy-white bg-galaxy-hotPink">
    Galaxy Button
  </button>
</div>
```

### In React/TypeScript Components

```tsx
import { GALAXY_COLORS, getGalaxyColor } from '../utils/galaxyColors';

// Direct usage
const myColor = GALAXY_COLORS.PURPLE;

// For Three.js
const threeColor = getGalaxyColor('PURPLE');
```

## 🎯 Utility Classes

### Text Colors
- `.text-galaxy-pink`
- `.text-galaxy-purple`
- `.text-galaxy-cyan`
- ... (one for each galaxy color)

### Background Gradients
- `.bg-galaxy-gradient-1` - Purple to Pink
- `.bg-galaxy-gradient-2` - Cyan to Electric Blue
- `.bg-galaxy-gradient-3` - Hot Pink to Purple to Cyan

### Special Effects
- `.galaxy-text-gradient` - Gradient text effect
- `.cosmic-glow` - Glowing border effect
- `.btn-galaxy` - Galaxy-themed button
- `.galaxy-pulse` - Pulsing animation

## 📋 Best Practices

1. **Always use variables/constants** instead of hardcoded hex values
2. **Use the utility classes** for common color applications
3. **Import from the central files** to ensure consistency
4. **Test colors in both light and dark modes** when applicable
5. **Use galaxy colors for space-themed elements**
6. **Use theme colors for structural elements**

## 🔄 Consistency Rules

- All particle effects should use `getAllGalaxyColors()`
- BlackHole component should use `ACCRETION_COLORS`
- UI buttons and accents should use galaxy colors
- Backgrounds and structure should use theme colors
- Always import from the utils file for JS/TS components

## 📝 Examples

### Galaxy Button Component
```tsx
import { GALAXY_COLORS } from '../utils/galaxyColors';

const GalaxyButton = ({ children }) => (
  <button 
    className="btn-galaxy"
    style={{ color: GALAXY_COLORS.WHITE }}
  >
    {children}
  </button>
);
```

### Particle System
```tsx
import { getAllGalaxyColors } from '../utils/galaxyColors';

const ParticleSystem = () => {
  const colors = useMemo(() => getAllGalaxyColors(), []);
  // Use colors array for particles
};
```

This color system ensures visual consistency across the entire STELLARION application while maintaining the space/galaxy theme throughout all components.
