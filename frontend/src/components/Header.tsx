import React from 'react';
import '../styles/components/Header.scss';

interface HeaderProps {
    heading: string;
    subheading?: string;
    size?: 'small' | 'medium' | 'large' | 'xl';
    className?: string;
    theme?: 'theme1' | 'theme2' | 'theme3' | 'theme4' | 'theme5' | 'accent' | 'primary' | 'secondary';
    spacing?: 'tight' | 'normal' | 'relaxed';
}

const Header: React.FC<HeaderProps> = ({
    heading,
    subheading,
    size = 'medium',
    className = '',
    theme = 'theme3',
    spacing = 'normal',
}) => {
    // Size classes for heading
    const headingSizeClasses = {
        small: 'text-xl md:text-2xl',
        medium: 'text-2xl md:text-3xl lg:text-4xl',
        large: 'text-3xl md:text-4xl lg:text-5xl',
        xl: 'text-4xl md:text-5xl lg:text-6xl',
    } as const;

    // Size classes for subheading
    const subheadingSizeClasses = {
        small: 'text-sm md:text-base',
        medium: 'text-base md:text-lg',
        large: 'text-lg md:text-xl',
        xl: 'text-xl md:text-2xl',
    } as const;

    // Spacing classes
    const spacingClasses = {
        tight: 'space-y-1',
        normal: 'space-y-2',
        relaxed: 'space-y-4',
    } as const;

    // Theme color classes using your custom colors
    const themeColors = {
        theme1: {
            heading: 'text-theme1',
            subheading: 'text-theme1/80',
        },
        theme2: {
            heading: 'text-theme2',
            subheading: 'text-theme2/80',
        },
        theme3: {
            heading: 'text-theme3',
            subheading: 'text-theme3/80',
        },
        theme4: {
            heading: 'text-theme4',
            subheading: 'text-theme4/80',
        },
        theme5: {
            heading: 'text-theme5',
            subheading: 'text-theme5/80',
        },
        accent: {
            heading: 'text-accent',
            subheading: 'text-accent-light',
        },
        primary: {
            heading: 'text-primary',
            subheading: 'text-primary/80',
        },
        secondary: {
            heading: 'text-secondary',
            subheading: 'text-secondary/80',
        },
    } as const;

    return (
        <div className={`header-container text-center ${spacingClasses[spacing]} ${className}`}>
            <h1
                className={`
                    header-heading
                    header-${size}
                    header-${theme}
                    font-bold 
                    font-outfit
                    leading-tight 
                    tracking-tight 
                    ${headingSizeClasses[size]} 
                    ${themeColors[theme].heading}
                `}
            >
                {heading}
            </h1>

            {subheading && (
                <p
                    className={`
                        font-medium 
                        font-outfit
                        leading-relaxed 
                        ${subheadingSizeClasses[size]} 
                        ${themeColors[theme].subheading}
                    `}
                >
                    {subheading}
                </p>
            )}
        </div>
    );
};

export default Header;
