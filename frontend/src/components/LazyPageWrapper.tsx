import React, { Suspense } from 'react';
import PageSkeleton from './PageSkeleton';

interface LazyPageWrapperProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    skeletonProps?: {
        title?: boolean;
        paragraphs?: number;
        cards?: number;
        className?: string;
    };
}

const LazyPageWrapper: React.FC<LazyPageWrapperProps> = ({
    children,
    fallback,
    skeletonProps = {}
}) => {
    const defaultFallback = <PageSkeleton {...skeletonProps} />;

    return (
        <Suspense fallback={fallback || defaultFallback}>
            {children}
        </Suspense>
    );
};

export default LazyPageWrapper;
