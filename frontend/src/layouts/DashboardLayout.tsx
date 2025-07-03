import React, { memo } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Sidebar from '../components/Sidebar';
import Chatbot from '../components/Chatbot';
import '../styles/pages/Dashboard.scss';

// Memoized components to prevent re-renders
const MemoizedSidebar = memo(Sidebar);
const MemoizedChatbot = memo(Chatbot);

const DashboardLayout: React.FC = () => {
    console.log('DashboardLayout rendering');
    const { userProfile } = useAuth();

    if (!userProfile) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="dashboard">
            <MemoizedSidebar />
            <div className="dashboard-content">
                <Outlet />
            </div>
            <MemoizedChatbot />
        </div>
    );
};

// Export memoized layout component
export default memo(DashboardLayout, () => true);
