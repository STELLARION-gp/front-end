import { useState, useCallback } from 'react';

interface UseLoadingReturn {
    isLoading: boolean;
    startLoading: () => void;
    stopLoading: () => void;
    withLoading: <T>(asyncFn: () => Promise<T>) => Promise<T>;
}

/**
 * Custom hook for managing loading states consistently across the application
 * @param initialState - Initial loading state (default: false)
 * @returns Object with loading state and control functions
 */
export const useLoading = (initialState: boolean = false): UseLoadingReturn => {
    const [isLoading, setIsLoading] = useState(initialState);

    const startLoading = useCallback(() => {
        setIsLoading(true);
    }, []);

    const stopLoading = useCallback(() => {
        setIsLoading(false);
    }, []);

    const withLoading = useCallback(async <T>(asyncFn: () => Promise<T>): Promise<T> => {
        try {
            setIsLoading(true);
            const result = await asyncFn();
            return result;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        isLoading,
        startLoading,
        stopLoading,
        withLoading,
    };
};
