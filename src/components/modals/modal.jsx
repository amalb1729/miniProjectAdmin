import React from "react";
import "./Modal.css"; // Styling for the modal

function Modal({ isOpen, closeModal, children }) {
  if (!isOpen) return null; // Don't render the modal if it's closed

  return (
    <div className="modalOverlay" onClick={closeModal}>
      <div className="modalContainer" onClick={(e) => e.stopPropagation()}>
        <button className="closeBtn" onClick={closeModal}>X</button>
        {children} {/* This allows passing different forms inside */}
      </div>
    </div>
  );
}

export default Modal;
