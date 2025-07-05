import React from 'react';
import { Outlet } from 'react-router-dom';
import '../styles/components/_auth-layout.scss';

// This is a minimal layout that doesn't include a navbar or any other shared components
const AuthLayout: React.FC = () => {
    return (
        <div className="auth-layout-container">
            <Outlet />
        </div>
    );
};

export default AuthLayout;
