import React, { memo } from 'react';
import { Outlet } from 'react-router-dom';
import NavBarComponent from './NavBarComponent';

/**
 * BaseLayout serves as the application's outermost layout wrapper
 * It contains elements that should always be present regardless of route
 * (navbar, global notifications, etc.)
 */
const BaseLayout: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <NavBarComponent />
            <main className="flex-grow">
                <Outlet />
            </main>
        </div>
    );
};

// Export memoized component to prevent unnecessary re-renders
export default memo(BaseLayout, () => true);
