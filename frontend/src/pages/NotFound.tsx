import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../components/Button';
import BlackHole from '../components/BlackHole';
import '../styles/pages/NotFound.scss';

const NotFound: React.FC = () => {
    const { t } = useTranslation();

    // Add transparent navbar class when component mounts
    useEffect(() => {
        document.body.classList.add('transparent-navbar');
        document.body.classList.add('dark-background'); // Add dark background
        return () => {
            document.body.classList.remove('transparent-navbar');
            document.body.classList.remove('dark-background'); // Remove on unmount
        };
    }, []);

    return (
        <div className="not-found-container">
            {/* 3D Black Hole Background */}
            <BlackHole />

            <div className="not-found-content">
                {/* 404 Number - static, no animations */}
                <div className="error-code">
                    <span className="error-number">4</span>
                    <span className="error-number">0</span>
                    <span className="error-number">4</span>
                </div>

                {/* Main message */}
                <h1 className="error-title">
                    {t('notFound.title', 'Page Not Found')}
                </h1>

                <p className="error-description">
                    {t('notFound.description', 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.')}
                </p>

                {/* Action buttons */}
                <div className="error-actions">
                    <Link to="/" className="home-button">
                        <Button
                            variant="primary"
                            size="large"
                        >
                            {t('notFound.goHome', 'Go to Homepage')}
                        </Button>
                    </Link>

                    <Button
                        variant="primary"
                        size="large"
                        onClick={() => window.history.back()}
                        className="back-button"
                    >
                        {t('notFound.goBack', 'Go Back')}
                    </Button>
                </div>

                {/* Additional help links */}
                <div className="help-links">
                    <p className="help-text">
                        {t('notFound.helpText', 'Still can\'t find what you\'re looking for?')}
                    </p>
                    <div className="help-actions">
                        <Link to="/about" className="help-link">
                            {t('navbar.about', 'About Us')}
                        </Link>
                        <span className="separator">|</span>
                        <Link to="#" className="help-link">
                            {t('navbar.contact', 'Contact')}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
