import React from "react";
import ButtonSvg from "../assets/svg/ButtonSvg";

interface ButtonProps {
  className?: string;
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  px?: string;
  white?: boolean;
  variant?: "primary" | "secondary";
}

const Button: React.FC<ButtonProps> = ({
  className = "",
  href,
  onClick,
  children,
  px = "",
  white = false,
  variant = "primary",
}) => {
  const classes = `btn btn--${variant} ${className} ${px}`.trim();

  const renderButton = () => (
    <button type="button" className={classes} onClick={onClick}>
      <span className={`btn__content ${white ? "white-true" : "white-false"}`}>{children}</span>
      <ButtonSvg white={white} />
    </button>
  );

  const renderLink = () => (
    <a href={href} className={classes}>
      <span className={`btn__content ${white ? "white-true" : "white-false"}`}>{children}</span>
      <ButtonSvg white={white} />
    </a>
  );

  return href ? renderLink() : renderButton();
};

export default Button;
