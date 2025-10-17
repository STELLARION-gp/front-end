import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export const useDashboardLoading = () => {
    const [isLoadingContent, setIsLoadingContent] = useState(false);
    const location = useLocation();
    const prevLocationRef = useRef(location.pathname);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Function to trigger loading manually if needed
    const startLoading = useCallback(() => {
        setIsLoadingContent(true);
    }, []);

    // Function to stop loading manually if needed
    const stopLoading = useCallback(() => {
        setIsLoadingContent(false);
    }, []);

    useEffect(() => {
        // Only show loading when actual path changes, not query params or hash
        if (prevLocationRef.current !== location.pathname) {
            // Show loading when route changes
            setIsLoadingContent(true);
            prevLocationRef.current = location.pathname;

            // Simulate content loading time (or replace with actual data fetching)
            // Clear any existing timer
            if (timerRef.current) clearTimeout(timerRef.current);

            // Set new timer
            timerRef.current = setTimeout(() => {
                setIsLoadingContent(false);
                timerRef.current = null;
            }, 100); // Reduced to 100ms for even smoother experience
        }

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [location.pathname]);

    return {
        isLoadingContent,
        startLoading,
        stopLoading
    };
};
