import React, { useRef, useCallback } from "react";
import LoadingSpinner from "./LoadingSpinner";

interface ButtonProps {
  className?: string;
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  px?: string;
  white?: boolean;
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "border";
  size?: "small" | "medium" | "large";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactElement;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  className = "",
  href,
  onClick,
  children,
  px = "",
  white = false,
  variant = "primary",
  size = "medium",
  type = "button",
  disabled = false,
  loading = false,
  icon,
  iconPosition = "left",
  fullWidth = false,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const circleRef = useRef<HTMLSpanElement>(null);
  const lastPositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseEnter = useCallback((e: React.MouseEvent) => {
    if (disabled || loading || variant !== "primary") return;

    const target = e.currentTarget as HTMLElement;
    const circle = circleRef.current;
    if (!circle) return;

    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Update position tracking
    lastPositionRef.current = { x, y };

    // Calculate the maximum distance to cover the entire button
    const maxDistance = Math.sqrt(
      Math.pow(Math.max(x, rect.width - x), 2) +
      Math.pow(Math.max(y, rect.height - y), 2)
    ) * 2;

    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;
    circle.style.setProperty('--circle-size', `${maxDistance}px`);
    circle.classList.remove('circle-shrink');
    circle.classList.add('circle-expand');
  }, [disabled, loading, variant]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (disabled || loading || variant !== "primary") return;

    const target = e.currentTarget as HTMLElement;
    const circle = circleRef.current;
    if (!circle || !circle.classList.contains('circle-expand')) return;

    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Only update if the position has changed significantly (performance optimization)
    const lastPos = lastPositionRef.current;
    if (Math.abs(x - lastPos.x) < 2 && Math.abs(y - lastPos.y) < 2) return;

    lastPositionRef.current = { x, y };

    // Calculate the maximum distance to cover the entire button from current position
    const maxDistance = Math.sqrt(
      Math.pow(Math.max(x, rect.width - x), 2) +
      Math.pow(Math.max(y, rect.height - y), 2)
    ) * 2;

    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;
    circle.style.setProperty('--circle-size', `${maxDistance}px`);
  }, [disabled, loading, variant]);

  const handleMouseLeave = useCallback(() => {
    if (disabled || loading || variant !== "primary") return;

    const circle = circleRef.current;
    if (!circle) return;

    circle.classList.remove('circle-expand');
    circle.classList.add('circle-shrink');
  }, [disabled, loading, variant]);

  const sizeClass = size ? `btn--${size}` : "";
  const fullWidthClass = fullWidth ? "btn--full-width" : "";
  const disabledClass = disabled ? "btn--disabled" : "";
  const loadingClass = loading ? "btn--loading" : "";

  const classes = `btn btn--${variant} ${sizeClass} ${fullWidthClass} ${disabledClass} ${loadingClass} ${className} ${px}`.trim();

  const renderContent = () => (
    <>
      {loading ? (
        <span className="btn__spinner">
          <LoadingSpinner
            size="small"
            useLottie={true}
            variant={white ? "white" : "primary"}
          />
        </span>
      ) : (
        <>
          {icon && iconPosition === "left" && <span className="btn__icon btn__icon--left">{icon}</span>}
          <span className={`btn__content ${white ? "white-true" : "white-false"}`}>{children}</span>
          {icon && iconPosition === "right" && <span className="btn__icon btn__icon--right">{icon}</span>}
        </>
      )}
      {variant === "primary" && <span ref={circleRef} className="btn__circle"></span>}
    </>
  );

  const renderButton = () => (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      ref={buttonRef}
    >
      {renderContent()}
    </button>
  );

  const renderLink = () => (
    <a
      href={href}
      className={classes}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      ref={linkRef}
    >
      {renderContent()}
    </a>
  );

  return href ? renderLink() : renderButton();
};

export default Button;
