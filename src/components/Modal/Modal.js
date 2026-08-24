import React, { useEffect } from "react";
import "./Modal.css";

/**
 * Reusable Modal Component
 * @param {Function} onClose - Callback function when modal closes
 * @param {React.ReactNode} children - Modal content
 * @param {number} maxWidth - Maximum width of modal (default: 520px)
 * @param {boolean} closeOnBackdropClick - Whether to close on backdrop click (default: true)
 * @param {boolean} closeOnEscape - Whether to close on Escape key (default: true)
 */
export default function Modal({
  onClose,
  children,
  maxWidth = 520,
  closeOnBackdropClick = true,
  closeOnEscape = true,
}) {
  const handleOverlayClick = (e) => {
    e.stopPropagation();
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    if (!closeOnEscape) return;

    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose, closeOnEscape]);

  const style = {};
  // allow numeric (px) or string (%, rem, px) values for maxWidth
  if (typeof maxWidth === 'number') style.maxWidth = `${maxWidth}px`;
  else if (typeof maxWidth === 'string') style.maxWidth = maxWidth;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div
        className="modal"
        dir="rtl"
        style={style}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}