import React from 'react';
import { useGlobalLoading } from '../hooks/useGlobalLoading';
import FullScreenLoader from './FullScreenLoader';

const GlobalLoadingOverlay: React.FC = () => {
    const { isGlobalLoading, loadingMessage } = useGlobalLoading();

    return (
        <FullScreenLoader
            isVisible={isGlobalLoading}
            message={loadingMessage}
            opacity={0.8}
            smoothTransitions={true}
        />
    );
};

export default GlobalLoadingOverlay;
