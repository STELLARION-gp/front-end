import React from 'react';
import Lottie from 'lottie-react';
import loadingAnimation from '../assets/loading.json';

export interface LoadingSpinnerProps {
  /** Size variant for the spinner */
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  /** Custom width override */
  width?: number;
  /** Custom height override */
  height?: number;
  /** Loading message to display */
  message?: string;
  /** Whether to show the message */
  showMessage?: boolean;
  /** Color theme variant */
  variant?: 'primary' | 'secondary' | 'white' | 'dark';
  /** Additional CSS classes */
  className?: string;
  /** Animation speed (default: 1) - Note: Currently not supported by lottie-react */
  // speed?: number;
  /** Whether to use the Lottie animation or fallback CSS spinner */
  useLottie?: boolean;
  /** Center the spinner in its container */
  centered?: boolean;
  /** Controls message visibility for smooth transitions */
  messageVisible?: boolean;
  /** Enable smooth message transitions */
  smoothTransitions?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  width,
  height,
  message = 'Loading...',
  showMessage = false,
  variant = 'primary',
  className = '',
  useLottie = true,
  centered = false,
  messageVisible = true,
  smoothTransitions = false,
}) => {
  // Size configurations
  const sizeConfig = {
    small: { width: 24, height: 24 },
    medium: { width: 48, height: 48 },
    large: { width: 80, height: 80 },
    fullscreen: { width: 120, height: 120 },
  };

  const { width: defaultWidth, height: defaultHeight } = sizeConfig[size];
  const spinnerWidth = width || defaultWidth;
  const spinnerHeight = height || defaultHeight;

  // Variant styles
  const variantClasses = {
    primary: 'text-blue-500',
    secondary: 'text-gray-500',
    white: 'text-white',
    dark: 'text-gray-800',
  };

  // Base classes
  const baseClasses = `loading-spinner loading-spinner--${size} loading-spinner--${variant}`;
  const containerClasses = `${baseClasses} ${centered ? 'loading-spinner--centered' : ''} ${className}`;

  // Lottie animation component
  const LottieSpinner = () => (
    <div
      className="lottie-spinner-container"
      data-width={spinnerWidth}
      data-height={spinnerHeight}
    >
      <Lottie
        animationData={loadingAnimation}
        loop={true}
        autoplay={true}
        className="lottie-spinner"
      />
    </div>
  );

  // CSS fallback spinner
  const CSSSpinner = () => (
    <div
      className={`css-spinner ${variantClasses[variant]}`}
      data-width={spinnerWidth}
      data-height={spinnerHeight}
    >
      <div className="css-spinner-inner" />
    </div>
  );

  return (
    <div className={containerClasses}>
      <div className="loading-spinner-content">
        {useLottie ? <LottieSpinner /> : <CSSSpinner />}
        {showMessage && (
          <div
            className={`loading-message loading-message--${variant} ${smoothTransitions ? 'loading-message--smooth' : ''
              } ${smoothTransitions ? (messageVisible ? 'loading-message--visible' : 'loading-message--hidden') : ''
              }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;
