import React from 'react';
import './ToggleActiveButton.css';

export default function ToggleActiveButton({ active = true, onClick, title, className = '', disabled = false }) {
  return (
    <button
      type="button"
      className={`toggle-active-button ${active ? 'on' : 'off'} ${className}`.trim()}
      onClick={onClick}
      aria-pressed={active}
      title={title || (active ? 'פעיל' : 'לא פעיל')}
      disabled={disabled}
    >
      {active ? 'פעיל' : 'לא פעיל'}
    </button>
  );
}
