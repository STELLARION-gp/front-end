import React, { useEffect } from 'react';
import { useI18n } from '../i18n/useI18n';
import '../styles/components/_logoutModal.scss';

interface LogoutModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onConfirm, onCancel }) => {
    const { t } = useI18n();

    // Prevent body scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            // Prevent scroll on body when modal is open
            document.body.style.overflow = 'hidden';
        } else {
            // Restore scrolling when modal is closed
            document.body.style.overflow = '';
        }

        return () => {
            // Cleanup - ensure scrolling is restored when component unmounts
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // Only close if clicking directly on the backdrop
        // This prevents closing when clicking on language selector or other elements
        if (e.target === e.currentTarget) {
            onCancel();
        }

        // Don't prevent event propagation for language switcher
        // e.stopPropagation() is intentionally NOT called here
    };

    return (
        <div className="logout-modal-backdrop" onClick={handleBackdropClick} data-testid="logout-modal-backdrop">
            <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
                <div className="logout-modal-header">
                    <h3 className="logout-modal-title">{t('logout.title')}</h3>
                </div>

                <div className="logout-modal-body">
                    <p className="logout-modal-message">{t('logout.message')}</p>
                </div>

                <div className="logout-modal-footer">
                    <button
                        className="logout-modal-button logout-modal-button--cancel"
                        onClick={onCancel}
                    >
                        {t('logout.cancelButton')}
                    </button>
                    <button
                        className="logout-modal-button logout-modal-button--confirm"
                        onClick={onConfirm}
                    >
                        {t('logout.confirmButton')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LogoutModal;
