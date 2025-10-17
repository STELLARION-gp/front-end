import React, { memo } from 'react';

interface LoadingOverlayProps {
    isVisible: boolean;
    message?: string;
    type?: 'login' | 'signup' | 'google';
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = memo(({
    isVisible,
    message = 'Loading...',
    type = 'login'
}) => {
    if (!isVisible) return null;

    const getLoadingIcon = () => {
        switch (type) {
            case 'google':
                return (
                    <div className="loading-icon loading-icon--google">
                        <svg className="google-spinner" viewBox="0 0 24 24" width="32" height="32">
                            <path
                                fill="#EA4335"
                                d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"
                            />
                            <path
                                fill="#34A853"
                                d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2970142 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"
                            />
                            <path
                                fill="#4285F4"
                                d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"
                            />
                        </svg>
                    </div>
                );
            default:
                return (
                    <div className="loading-icon loading-icon--default">
                        <div className="stellar-spinner">
                            <div className="stellar-orbit">
                                <div className="stellar-planet"></div>
                            </div>
                            <div className="stellar-orbit stellar-orbit--2">
                                <div className="stellar-planet"></div>
                            </div>
                            <div className="stellar-orbit stellar-orbit--3">
                                <div className="stellar-planet"></div>
                            </div>
                            <div className="stellar-core"></div>
                        </div>
                    </div>
                );
        }
    };

    const getLoadingMessage = () => {
        switch (type) {
            case 'login':
                return 'Signing you in...';
            case 'signup':
                return 'Creating your account...';
            case 'google':
                return 'Connecting with Google...';
            default:
                return message;
        }
    };

    return (
        <div className="auth-loading-overlay" aria-live="polite" role="status">
            <div className="auth-loading-content">
                {getLoadingIcon()}
                <div className="loading-text">
                    <h3 className="loading-title">{getLoadingMessage()}</h3>
                    <p className="loading-subtitle">Please wait a moment</p>
                </div>
                <div className="loading-progress">
                    <div className="loading-progress-bar"></div>
                </div>
            </div>
            <div className="loading-particles">
                {Array.from({ length: 6 }, (_, i) => (
                    <div key={i} className={`particle particle--${i + 1}`}></div>
                ))}
            </div>
        </div>
    );
});

LoadingOverlay.displayName = 'LoadingOverlay';

export default LoadingOverlay;
