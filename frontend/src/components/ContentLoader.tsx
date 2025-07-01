import React, { useState, useEffect, memo } from 'react';
import LoadingSpinner from './LoadingSpinner';
import '../styles/components/ContentLoader.scss';

interface ContentLoaderProps {
    isLoading: boolean;
    children: React.ReactNode;
    fadeTransition?: boolean;
    transitionDuration?: number;
}

const ContentLoader: React.FC<ContentLoaderProps> = memo(({
    isLoading,
    children,
    fadeTransition = true,
    transitionDuration = 300
}) => {
    const [prevChildren, setPrevChildren] = useState<React.ReactNode>(children);
    const [shouldRender, setShouldRender] = useState(!isLoading);

    useEffect(() => {
        // If not loading, update the content and show it
        if (!isLoading) {
            setPrevChildren(children);

            if (fadeTransition) {
                // Wait a small amount of time to ensure smooth transition
                const timer = setTimeout(() => {
                    setShouldRender(true);
                }, 30);  // Reduced timer for smoother transitions
                return () => clearTimeout(timer);
            } else {
                setShouldRender(true);
            }
        } else {
            // When starting to load, keep previous content but update shouldRender
            setShouldRender(false);
        }
    }, [isLoading, children, fadeTransition]);

    // Create dynamic class names
    const contentClass = `content-container 
        ${fadeTransition ? (shouldRender ? 'content-visible' : 'content-hidden') : ''} 
        ${(!fadeTransition && !shouldRender) ? 'content-display-none' : ''}`;

    // Add the transition duration as a CSS variable
    document.documentElement.style.setProperty('--transition-duration', `${transitionDuration}ms`);

    return (
        <div className="content-loader-wrapper">
            {isLoading && (
                <div className="content-loading">
                    <LoadingSpinner
                        size="small"
                        variant="white"
                        showMessage={false}
                        useLottie={false}
                    />
                </div>
            )}

            <div className={contentClass}>
                {shouldRender || fadeTransition ? children : prevChildren}
            </div>
        </div>
    );
});

export default ContentLoader;
