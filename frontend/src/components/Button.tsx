import React from "react";
import ButtonSvg from "../assets/svg/ButtonSvg";

interface ButtonProps {
  className?: string;
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  px?: string;
  white?: boolean;
  variant?: "primary" | "secondary" | "success" | "danger" | "ghost";
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
  const sizeClass = size ? `btn--${size}` : "";
  const fullWidthClass = fullWidth ? "btn--full-width" : "";
  const disabledClass = disabled ? "btn--disabled" : "";
  const loadingClass = loading ? "btn--loading" : "";

  const classes = `btn btn--${variant} ${sizeClass} ${fullWidthClass} ${disabledClass} ${loadingClass} ${className} ${px}`.trim();

  const renderContent = () => (
    <>
      {loading ? (
        <span className="btn__spinner">⟳</span>
      ) : (
        <>
          {icon && iconPosition === "left" && <span className="btn__icon btn__icon--left">{icon}</span>}
          <span className={`btn__content ${white ? "white-true" : "white-false"}`}>{children}</span>
          {icon && iconPosition === "right" && <span className="btn__icon btn__icon--right">{icon}</span>}
        </>
      )}
    </>
  );

  const renderButton = () => (
    <button type={type} className={classes} onClick={onClick} disabled={disabled || loading}>
      {renderContent()}
      <ButtonSvg white={white} />
    </button>
  );

  const renderLink = () => (
    <a href={href} className={classes}>
      {renderContent()}
      <ButtonSvg white={white} />
    </a>
  );

  return href ? renderLink() : renderButton();
};

export default Button;
