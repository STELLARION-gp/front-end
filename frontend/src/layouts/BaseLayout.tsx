import React, { memo } from 'react';
import { Outlet } from 'react-router-dom';
import NavBarComponent from './NavBarComponent';
import Chatbot from '../components/Chatbot';

/**
 * BaseLayout serves as the application's outermost layout wrapper
 * It contains elements that should always be present regardless of route
 * (navbar, global notifications, etc.)
*/

const MemoizedChatbot = memo(Chatbot);


const BaseLayout: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <NavBarComponent />
            <main className="flex-grow">
                <Outlet />
            </main>
               <MemoizedChatbot />
        </div>
    );
};

// Export memoized component to prevent unnecessary re-renders
export default memo(BaseLayout, () => true);
