import React from 'react';


interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  size?: 'small' | 'medium' | 'large';
  padding?: 'none' | 'small' | 'medium' | 'large';
  rounded?: 'none' | 'small' | 'medium' | 'large' | 'full';
  shadow?: 'none' | 'small' | 'medium' | 'large';
  hover?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  image?: string;
  imageAlt?: string;
  imagePosition?: 'top' | 'left' | 'right';
  badge?: React.ReactNode;
  loading?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  size = 'medium',
  padding = 'medium',
  rounded = 'medium',
  shadow = 'medium',
  hover = false,
  clickable = false,
  onClick,
  header,
  footer,
  image,
  imageAlt = '',
  imagePosition = 'top',
  badge,
  loading = false,
}) => {
  // Build SCSS classes based on props
  const cardClasses = [
    'card',
    `card--${variant}`,
    `card--${size}`,
    `card--padding-${padding}`,
    `card--rounded-${rounded}`,
    `card--shadow-${shadow}`,
    hover ? 'card--hoverable' : '',
    clickable ? 'card--clickable' : '',
    loading ? 'card--loading' : '',
    className
  ].filter(Boolean).join(' ');

  const handleClick = () => {
    if (clickable && onClick) {
      onClick();
    }
  };

  if (loading) {
    return (
      <div className={cardClasses}>
        <div className="card-content">
          <div className="skeleton h-4 mb-3"></div>
          <div className="skeleton h-3 mb-2"></div>
          <div className="skeleton h-3 mb-2"></div>
          <div className="skeleton h-3 w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={cardClasses} onClick={handleClick}>
      {/* Badge */}
      {badge && (
        <div className="card__badge">
          {badge}
        </div>
      )}

      {/* Card Content Container */}
      <div className={`card__content-container ${image ? `card__content-container--${imagePosition}` : 'card__content-container--default'}`}>
        {/* Image */}
        {image && (
          <div className={`card__image card__image--${imagePosition}`}>
            <img
              src={image}
              alt={imageAlt}
              className="card__image"
            />
          </div>
        )}

        {/* Content */}
        <div className="card__content-wrapper">
          {/* Header */}
          {header && (
            <div className="card-header">
              {header}
            </div>
          )}

          {/* Main Content */}
          <div className="card-content">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="card-footer">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Card sub-components for better composition
export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`card-header ${className}`}>
    {children}
  </div>
);

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <h3 className={`card-title ${className}`}>
    {children}
  </h3>
);

export const CardSubtitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <p className={`card-subtitle ${className}`}>
    {children}
  </p>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`card-content ${className}`}>
    {children}
  </div>
);

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`card-footer ${className}`}>
    {children}
  </div>
);

export const CardActions: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`card-actions ${className}`}>
    {children}
  </div>
);

export default Card;
