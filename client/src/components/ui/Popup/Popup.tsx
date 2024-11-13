import React from "react";
import "./popup.css";

interface PopupPoprs {
  disabled: boolean;
  message: string;
  onClose?: () => void;
  onClick?: () => void;
}

const Popup: React.FC<PopupPoprs> = ({ disabled, message, onClose, onClick }) => {
  return (
    <div className="popup-container">
      <div className="popup">
        <p>{message}</p>
        <div className="btn-group">
          <button className="close-btn" onClick={onClose}>
            Close
          </button>
          <button onClick={onClick} disabled={disabled} className="delete-btn">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
