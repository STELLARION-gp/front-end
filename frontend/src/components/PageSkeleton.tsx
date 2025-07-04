import React from 'react';

interface PageSkeletonProps {
    title?: boolean;
    paragraphs?: number;
    cards?: number;
    className?: string;
}

const PageSkeleton: React.FC<PageSkeletonProps> = ({
    title = true,
    paragraphs = 3,
    cards = 0,
    className = ''
}) => {
    return (
        <div className={`animate-pulse p-6 ${className}`}>
            {title && (
                <div className="h-8 bg-gray-200 rounded-md w-1/3 mb-6"></div>
            )}

            {paragraphs > 0 && (
                <div className="space-y-3 mb-6">
                    {Array.from({ length: paragraphs }).map((_, index) => (
                        <div key={index} className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        </div>
                    ))}
                </div>
            )}

            {cards > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: cards }).map((_, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="h-32 bg-gray-200 rounded mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PageSkeleton;
