import React from 'react';
import '../styles/components/DashboardFooter.scss';

const DashboardFooter: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="dashboard-footer">
            <div className="dashboard-footer-content">
                <div className="footer-left">
                    <span className="brand-name">STELLARION</span>
                    <span className="separator">•</span>
                    <span className="tagline">Explore the Cosmos</span>
                </div>
                <div className="footer-right">
                    <span className="copyright">© {currentYear} All rights reserved</span>
                </div>
            </div>
        </footer>
    );
};

export default DashboardFooter;
