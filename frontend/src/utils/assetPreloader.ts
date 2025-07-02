/**
 * Asset preloading utilities for the homepage
 */

export const preloadImage = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = src;
    });
};

export const preloadImages = async (imageSources: string[]): Promise<void> => {
    try {
        await Promise.all(imageSources.map(src => preloadImage(src)));
    } catch (error) {
        console.warn('Some images failed to preload:', error);
    }
};

export const preloadHomeAssets = async (): Promise<void> => {
    // List of critical homepage assets to preload
    const imageAssets = [
        '/src/assets/logo-light.png',
        '/src/assets/logo-dark.png',
        '/src/assets/astro.png',
        '/src/assets/world.png',
        '/src/assets/world2.png',
    ];

    try {
        // Preload images
        await preloadImages(imageAssets);

        // Additional delay to allow 3D components to initialize
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log('Homepage assets preloaded successfully');
    } catch (error) {
        console.warn('Asset preloading completed with some errors:', error);
    }
};
