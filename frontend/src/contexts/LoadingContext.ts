import { createContext } from 'react';

export interface LoadingContextType {
    isGlobalLoading: boolean;
    loadingMessage: string;
    startGlobalLoading: (message?: string) => void;
    stopGlobalLoading: () => void;
    setLoadingMessage: (message: string) => void;
}

export const LoadingContext = createContext<LoadingContextType | undefined>(undefined);
