import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface ContentLoaderProps {
    isLoading: boolean;
    children: React.ReactNode;
}

const ContentLoader: React.FC<ContentLoaderProps> = ({ isLoading, children }) => {
    if (isLoading) {
        return (
            <div className="content-loading">
                <LoadingSpinner
                    size="medium"
                    variant="white"
                    showMessage={false}
                    useLottie={false}
                />
            </div>
        );
    }

    return <>{children}</>;
};

export default ContentLoader;
