import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useDashboardLoading = () => {
    const [isLoadingContent, setIsLoadingContent] = useState(false);
    const location = useLocation();

    useEffect(() => {
        // Show loading when route changes
        setIsLoadingContent(true);

        // Simulate content loading time (or replace with actual data fetching)
        const timer = setTimeout(() => {
            setIsLoadingContent(false);
        }, 300); // Reduced to 300ms for smooth experience

        return () => clearTimeout(timer);
    }, [location.pathname]);

    return { isLoadingContent };
};
