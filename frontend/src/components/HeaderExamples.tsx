// Example usage of the simplified Header component with theme colors

import React from 'react';
import Header from '../components/Header';

const HeaderExamples: React.FC = () => {
    return (
        <div className="p-8 space-y-12 bg-background-light dark:bg-background-dark min-h-screen">
            {/* Basic usage with default theme3 */}
            <Header
                heading="Welcome to STELLARION"
                subheading="Explore the universe of possibilities"
            />

            {/* Theme1 - Dark blue */}
            <Header
                heading="Dark Theme"
                subheading="Using theme1 colors for deep space feeling"
                size="large"
                theme="theme1"
            />

            {/* Theme2 - Medium blue */}
            <Header
                heading="Ocean Theme"
                subheading="Using theme2 colors for oceanic depth"
                size="medium"
                theme="theme2"
            />

            {/* Theme3 - Bright blue (default) */}
            <Header
                heading="Sky Theme"
                subheading="Using theme3 colors for bright highlights"
                size="large"
                theme="theme3"
            />

            {/* Theme4 - Muted gray-blue */}
            <Header
                heading="Subtle Theme"
                subheading="Using theme4 colors for elegant subtlety"
                size="medium"
                theme="theme4"
            />

            {/* Theme5 - Light blue */}


            {/* Accent theme */}
            <Header
                heading="Accent Colors"
                subheading="Using accent color scheme for highlights"
                size="xl"
                theme="accent"
                spacing="relaxed"
            />

            {/* Primary theme */}
            <Header
                heading="Primary Colors"
                subheading="Using primary color scheme"
                size="medium"
                theme="primary"
            />

            {/* Secondary theme */}
            <Header
                heading="Secondary Colors"
                subheading="Using secondary color scheme"
                size="large"
                theme="secondary"
                spacing="tight"
            />

            {/* Extra large with custom spacing */}
            <Header
                heading="STELLARION"
                subheading="The Future of Space Exploration"
                size="xl"
                theme="theme3"
                spacing="relaxed"
                className="border border-border rounded-lg p-6 bg-background-light/50 dark:bg-background-dark/50 backdrop-blur-sm"
            />

            {/* Small header */}
            <Header
                heading="Mission Dashboard"
                subheading="Control center for your space missions"
                size="small"
                theme="theme4"
            />
        </div>
    );
};

export default HeaderExamples;
