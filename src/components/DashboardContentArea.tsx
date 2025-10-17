import { memo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ContentLoader from './ContentLoader';
import { useDashboardLoading } from '../hooks/useDashboardLoading';
import DashboardFooter from './DashboardFooter';
import DashboardRoutes from '../routes/DashboardRoutes';
import '../styles/pages/Dashboard.scss';

/**
 * The DashboardContentArea component handles the loading state for dashboard pages
 * It wraps the DashboardRoutes component that contains all the dashboard subroutes
 */
const DashboardContentArea = () => {
    const { isLoadingContent } = useDashboardLoading();
    const location = useLocation();

    console.log('DashboardContentArea rendering for path:', location.pathname);

    // Reset scroll position when route changes
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <main className="dashboard-content">
            <div className="routes-container">
                <ContentLoader isLoading={isLoadingContent}>
                    <DashboardRoutes />
                </ContentLoader>
            </div>
            <DashboardFooter />
        </main>
    );
};

export default memo(DashboardContentArea, () => true);
