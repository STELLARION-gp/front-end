import React, { memo, useCallback } from 'react';

interface MessageProps {
    message: string;
    type: 'error' | 'success' | 'info' | 'warning';
    onClose?: () => void;
}

const Message: React.FC<MessageProps> = memo(({ message, type, onClose }) => {
    const getIcon = useCallback(() => {
        switch (type) {
            case 'error': return '⚠';
            case 'success': return '✓';
            case 'info': return 'ℹ';
            case 'warning': return '⚠';
            default: return 'ℹ';
        }
    }, [type]);

    const getClassName = useCallback(() => {
        const baseClass = 'auth-message';
        return `${baseClass} ${baseClass}--${type}`;
    }, [type]);

    const handleClose = useCallback(() => {
        onClose?.();
    }, [onClose]);

    const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
        if (event.key === 'Escape' && onClose) {
            onClose();
        }
    }, [onClose]);

    return (
        <div
            className={getClassName()}
            role="alert"
            aria-live="polite"
            onKeyDown={handleKeyDown}
            tabIndex={onClose ? 0 : -1}
        >
            <span className="auth-message__icon" aria-hidden="true">
                {getIcon()}
            </span>
            <span className="auth-message__text">{message}</span>
            {onClose && (
                <button
                    className="auth-message__close"
                    onClick={handleClose}
                    aria-label="Close message"
                    type="button"
                >
                    ×
                </button>
            )}
        </div>
    );
});

Message.displayName = 'Message';

export default Message;
