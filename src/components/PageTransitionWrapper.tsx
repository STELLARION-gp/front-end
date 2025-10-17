import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useGlobalLoading } from '../hooks/useGlobalLoading';
import FullScreenLoader from './FullScreenLoader';

interface PageTransitionWrapperProps {
    children: React.ReactNode;
    loadingMessages?: string[];
    minimumLoadingTime?: number;
}

const PageTransitionWrapper: React.FC<PageTransitionWrapperProps> = ({
    children,
    loadingMessages = [
        'Loading...'
    ],
    minimumLoadingTime = 100, // Very short minimum loading time
}) => {
    const location = useLocation();
    const { isGlobalLoading, startGlobalLoading, stopGlobalLoading } = useGlobalLoading();
    const [isPageReady, setIsPageReady] = useState(false);

    useEffect(() => {
        // Start loading when location changes
        const startTime = Date.now();
        setIsPageReady(false);
        startGlobalLoading(loadingMessages[0]);

        // Simulate page preparation time (minimal delay)
        const timer = setTimeout(() => {
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(0, minimumLoadingTime - elapsedTime);

            // Ensure minimum loading time is met for smooth UX
            setTimeout(() => {
                setIsPageReady(true);
                stopGlobalLoading();
            }, remainingTime);
        }, 25); // Minimal delay to allow page to start mounting

        return () => {
            clearTimeout(timer);
            stopGlobalLoading();
        };
    }, [location.pathname, startGlobalLoading, stopGlobalLoading, loadingMessages, minimumLoadingTime]);

    // Don't render children until page is ready
    if (!isPageReady || isGlobalLoading) {
        return (
            <FullScreenLoader
                isVisible={true}
                message={loadingMessages}
                smoothTransitions={true}
                messageDuration={1000}
            />
        );
    }

    return <>{children}</>;
};

export default PageTransitionWrapper;
