import React, { useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { LoadingContext } from './LoadingContext';
import type { LoadingContextType } from './LoadingContext';

interface LoadingProviderProps {
    children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
    const [isGlobalLoading, setIsGlobalLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('Loading...');

    const startGlobalLoading = useCallback((message: string = 'Loading...') => {
        setLoadingMessage(message);
        setIsGlobalLoading(true);
    }, []);

    const stopGlobalLoading = useCallback(() => {
        setIsGlobalLoading(false);
    }, []);

    const updateLoadingMessage = useCallback((message: string) => {
        setLoadingMessage(message);
    }, []);

    const value: LoadingContextType = {
        isGlobalLoading,
        loadingMessage,
        startGlobalLoading,
        stopGlobalLoading,
        setLoadingMessage: updateLoadingMessage,
    };

    return (
        <LoadingContext.Provider value={value}>
            {children}
        </LoadingContext.Provider>
    );
};
