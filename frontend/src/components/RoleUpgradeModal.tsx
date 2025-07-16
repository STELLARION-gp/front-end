
import React, { useEffect } from 'react';
import { useI18n } from '../i18n/useI18n';
import '../styles/components/_logoutModal.scss';

interface RoleUpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (role: 'guide' | 'influencer') => void;
    selectedRole: string;
    setSelectedRole: (role: string) => void;
}

const RoleUpgradeModal: React.FC<RoleUpgradeModalProps> = ({ isOpen, onClose, onSelect, selectedRole, setSelectedRole }) => {
    const { t } = useI18n();
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);
    if (!isOpen) return null;
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };
    return (
        <div className="logout-modal-backdrop" onClick={handleBackdropClick}>
            <div className="logout-modal" onClick={e => e.stopPropagation()}>
                <div className="logout-modal-header">
                    <h3 className="logout-modal-title">{t('roleUpgrade.title', 'Upgrade Your Role')}</h3>
                </div>
                <div className="logout-modal-body">
                    <p className="logout-modal-message">{t('roleUpgrade.desc', 'Choose a role to upgrade to:')}</p>
                    <div className="logout-modal-radio-group">
                        <label
                            className={
                                'logout-modal-radio' + (selectedRole === 'guide' ? ' selected' : '')
                            }
                        >
                            <input
                                type="radio"
                                name="role"
                                value="guide"
                                checked={selectedRole === 'guide'}
                                onChange={() => setSelectedRole('guide')}
                            />
                            {t('roleUpgrade.guide', 'Guide')}
                        </label>
                        <label
                            className={
                                'logout-modal-radio' + (selectedRole === 'influencer' ? ' selected' : '')
                            }
                        >
                            <input
                                type="radio"
                                name="role"
                                value="influencer"
                                checked={selectedRole === 'influencer'}
                                onChange={() => setSelectedRole('influencer')}
                            />
                            {t('roleUpgrade.influencer', 'Influencer')}
                        </label>
                    </div>
                </div>
                <div className="logout-modal-footer">
                    <button
                        className="logout-modal-button logout-modal-button--cancel"
                        type="button"
                        onClick={onClose}
                    >
                        {t('roleUpgrade.cancelButton', 'Cancel')}
                    </button>
                    <button
                        className="logout-modal-button logout-modal-button--confirm"
                        type="button"
                        disabled={!selectedRole}
                        onClick={() => selectedRole && onSelect(selectedRole as 'guide' | 'influencer')}
                    >
                        {t('roleUpgrade.confirmButton', 'Confirm')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoleUpgradeModal;
