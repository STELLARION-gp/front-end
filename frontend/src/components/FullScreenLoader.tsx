import React, { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface FullScreenLoaderProps {
    /** Whether the loader is visible */
    isVisible: boolean;
    /** Loading message to display */
    message?: string | string[];
    /** Background overlay opacity (0-1) */
    opacity?: number;
    /** Custom className for the overlay */
    className?: string;
    /** Duration for each message when using array (in ms) */
    messageDuration?: number;
    /** Enable smooth message transitions */
    smoothTransitions?: boolean;
}

const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({
    isVisible,
    message = 'Loading...',
    opacity = 0.5,
    className = '',
    messageDuration = 2000,
    smoothTransitions = true,
}) => {
    const [currentMessage, setCurrentMessage] = useState<string>('');
    const [messageIndex, setMessageIndex] = useState(0);
    const [isMessageVisible, setIsMessageVisible] = useState(true);

    // Handle message cycling
    useEffect(() => {
        if (!isVisible) return;

        const messages = Array.isArray(message) ? message : [message];

        // Initialize first message
        if (currentMessage === '') {
            setCurrentMessage(messages[0]);
        }

        if (messages.length > 1 && smoothTransitions) {
            const interval = setInterval(() => {
                // Fade out current message
                setIsMessageVisible(false);

                setTimeout(() => {
                    // Update message and fade in
                    const nextIndex = (messageIndex + 1) % messages.length;
                    setMessageIndex(nextIndex);
                    setCurrentMessage(messages[nextIndex]);
                    setIsMessageVisible(true);
                }, 600); // Match the CSS transition duration
            }, messageDuration);

            return () => clearInterval(interval);
        }
    }, [isVisible, message, messageDuration, smoothTransitions, messageIndex, currentMessage]);

    // Reset when visibility changes
    useEffect(() => {
        if (isVisible) {
            setMessageIndex(0);
            setIsMessageVisible(true);
            const messages = Array.isArray(message) ? message : [message];
            setCurrentMessage(messages[0]);
        }
    }, [isVisible, message]);

    if (!isVisible) return null;

    return (
        <div
            className={`fullscreen-loader ${className}`}
            data-opacity={opacity}
        >
            <LoadingSpinner
                size="fullscreen"
                variant="white"
                showMessage={true}
                message={currentMessage}
                useLottie={true}
                centered={true}
                messageVisible={isMessageVisible}
                smoothTransitions={smoothTransitions}
            />
        </div>
    );
};

export default FullScreenLoader;
