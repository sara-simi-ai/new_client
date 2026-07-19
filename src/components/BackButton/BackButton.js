import React from 'react';
import './BackButton.css';

export default function BackButton({ onClick, label = 'חזרה למסכי ניהול' }) {
  return (
    <button className="back-btn" type="button" onClick={onClick} title="חזרה" aria-label="חזרה">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>{label}</span>
    </button>
  );
}
