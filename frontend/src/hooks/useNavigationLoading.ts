import { useNavigate } from 'react-router-dom';
import { useGlobalLoading } from './useGlobalLoading';

interface NavigationLoadingOptions {
    loadingMessage?: string;
    minimumLoadingTime?: number;
}

export const useNavigationLoading = (options: NavigationLoadingOptions = {}) => {
    const navigate = useNavigate();
    const { startGlobalLoading, stopGlobalLoading } = useGlobalLoading();

    const {
        loadingMessage = 'Navigating...',
        minimumLoadingTime = 200
    } = options;

    const navigateWithLoading = async (to: string, replace = false) => {
        const startTime = Date.now();
        startGlobalLoading(loadingMessage);

        // Navigate
        navigate(to, { replace });

        // Ensure minimum loading time for smooth UX
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minimumLoadingTime - elapsedTime);

        setTimeout(() => {
            stopGlobalLoading();
        }, remainingTime);
    };

    return {
        navigateWithLoading,
        startGlobalLoading,
        stopGlobalLoading
    };
};
