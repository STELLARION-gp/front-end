import React, { memo } from 'react';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import NavBarComponent from './NavBarComponent';
import NavBar from './NavBar';
import Chatbot from '../components/Chatbot';
import SubscriptionNotification from '../components/SubscriptionNotification';

/**
 * BaseLayout serves as the application's outermost layout wrapper
 * It contains elements that should always be present regardless of route
 * (navbar, global notifications, etc.)
*/

const MemoizedChatbot = memo(Chatbot);



// Custom hook to detect screen size
function useIsSmallScreen(breakpoint = 768) {
    const [isSmall, setIsSmall] = useState(() => window.innerWidth < breakpoint);
    useEffect(() => {
        const handleResize = () => setIsSmall(window.innerWidth < breakpoint);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [breakpoint]);
    return isSmall;
}

const BaseLayout: React.FC = () => {
    const isSmallScreen = useIsSmallScreen();
    return (
        <div className="min-h-screen flex flex-col">
            {isSmallScreen ? <NavBar /> : <NavBarComponent />}
            <SubscriptionNotification />
            <main className="flex-grow">
                <Outlet />
            </main>
            <MemoizedChatbot />
        </div>
    );
};

// Export memoized component to prevent unnecessary re-renders
export default memo(BaseLayout, () => true);
