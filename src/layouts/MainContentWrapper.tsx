import React from 'react';
import { Outlet } from 'react-router-dom';
import PageTransitionWrapper from '../components/PageTransitionWrapper';

/**
 * MainContentWrapper serves as a container for the main page content
 * It applies page transitions only to the content area
 */
const MainContentWrapper: React.FC = () => {
    return (
        <PageTransitionWrapper
            loadingMessages={['Loading...']}
            minimumLoadingTime={100}
        >
            <Outlet />
        </PageTransitionWrapper>
    );
};

export default MainContentWrapper;
