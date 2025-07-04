import React from 'react';

interface ParticipantsIconProps {
  className?: string;
  size?: number;
}

const ParticipantsIcon: React.FC<ParticipantsIconProps> = ({ className = '', size = 16 }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16 4C18.21 4 20 5.79 20 8C20 10.21 18.21 12 16 12C13.79 12 12 10.21 12 8C12 5.79 13.79 4 16 4ZM16 14C20.42 14 24 15.79 24 18V20H8V18C8 15.79 11.58 14 16 14ZM8 4C10.21 4 12 5.79 12 8C12 10.21 10.21 12 8 12C5.79 12 4 10.21 4 8C4 5.79 5.79 4 8 4ZM8 14C12.42 14 16 15.79 16 18V20H0V18C0 15.79 3.58 14 8 14Z"
      fill="currentColor"
    />
  </svg>
);

export default ParticipantsIcon;
