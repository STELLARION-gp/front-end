import * as THREE from 'three';

// Galaxy color constants to maintain consistency between JS/TS and SCSS
// These values should match the ones in _galaxy-colors.scss

/**
 * Galaxy color palette for use in React components
 * This ensures consistent colors between CSS and JS code
 */
export const GALAXY_COLORS = {
    PINK: '#FF61F6',           // Bright Pink
    PURPLE: '#7B4BFF',         // Bright Purple
    CYAN: '#00E5FF',           // Bright Cyan
    AQUA: '#5DF9FF',           // Bright Aqua
    GOLD: '#FFD500',           // Bright Gold
    ORANGE: '#FF7D00',         // Bright Orange
    HOT_PINK: '#FF0070',       // Hot Pink
    ELECTRIC_BLUE: '#01FEFE',  // Electric Blue
    GREEN: '#01FF89',          // Bright Green
    WHITE: '#FFFFFF',          // Pure White (for stars)
} as const;

/**
 * Accretion disk colors from BlackHole component
 */
export const ACCRETION_COLORS = {
    INNER: '#FFFFFF',   // Inner disk color
    MIDDLE: '#FF4000',  // Middle disk color
    OUTER: '#FF1020',   // Outer disk color
} as const;

/**
 * Theme colors
 */
export const THEME_COLORS = {
    THEME1: '#040C24',  // Deep Space Blue
    THEME2: '#0A205A',  // Space Navy
    THEME3: '#108CFF',  // Bright Blue
    THEME4: '#9DA5BD',  // Steel Gray
    THEME5: '#E6F9FF',  // Ice Blue
} as const;

export type GalaxyColorKey = keyof typeof GALAXY_COLORS;
export type AccretionColorKey = keyof typeof ACCRETION_COLORS;
export type ThemeColorKey = keyof typeof THEME_COLORS;

/**
 * Helper function to create THREE.Color from our palette
 * @param colorKey - Key from GALAXY_COLORS
 * @returns THREE.Color
 */
export const getGalaxyColor = (colorKey: GalaxyColorKey): THREE.Color => {
    return new THREE.Color(GALAXY_COLORS[colorKey]);
};

/**
 * Helper function to get an array of THREE.Color objects from our palette
 * @param colorKeys - Array of keys from GALAXY_COLORS
 * @returns Array of THREE.Color objects
 */
export const getGalaxyColorArray = (colorKeys: GalaxyColorKey[]): THREE.Color[] => {
    return colorKeys.map(key => getGalaxyColor(key));
};

/**
 * Get all galaxy colors as THREE.Color objects
 * @returns Array of all galaxy colors
 */
export const getAllGalaxyColors = (): THREE.Color[] => {
    return Object.values(GALAXY_COLORS).map(color => new THREE.Color(color));
};

export default GALAXY_COLORS;
