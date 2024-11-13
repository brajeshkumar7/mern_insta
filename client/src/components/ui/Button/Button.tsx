import React from "react";
import "./Button.css";

interface ButtonProps {
  disabled: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ disabled, children }) => {
  return (
    <button className="btn-primary" disabled={disabled}>
      {children}
    </button>
  );
};

interface IconButtonProps extends ButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
}

const IconButton: React.FC<IconButtonProps> = ({ disabled, icon, onClick }) => {
  return (
    <button className="btn-icon" disabled={disabled} onClick={onClick}>
      <span className="icon">{icon}</span>
    </button>
  );
};

export default Button;
export { IconButton };
