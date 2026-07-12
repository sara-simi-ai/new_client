import React from 'react';
import './ViewToggle.css';

const CardsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <rect x="1" y="1" width="7" height="7" rx="1.5" fill="currentColor" stroke="currentColor" strokeWidth="1.5" />
    <rect x="10" y="1" width="7" height="7" rx="1.5" fill="currentColor" stroke="currentColor" strokeWidth="1.5" />
    <rect x="1" y="10" width="7" height="7" rx="1.5" fill="currentColor" stroke="currentColor" strokeWidth="1.5" />
    <rect x="10" y="10" width="7" height="7" rx="1.5" fill="currentColor" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const TableIcon  = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <rect x="1" y="1" width="16" height="2" rx="1" fill="currentColor" stroke="currentColor" strokeWidth="1" />
    <rect x="1" y="5" width="16" height="2" rx="1" fill="currentColor" stroke="currentColor" strokeWidth="1" />
    <rect x="1" y="9" width="16" height="2" rx="1" fill="currentColor" stroke="currentColor" strokeWidth="1" />
    <rect x="1" y="13" width="16" height="2" rx="1" fill="currentColor" stroke="currentColor" strokeWidth="1" />
  </svg>
);

const ViewToggle = ({ view = 'cards', onChange }) => {
  const btn = (type, Icon, label) => (
    <button
      onClick={() => onChange?.(type)}
      title={label}
      className={`vt-btn${view === type ? ' active' : ''}`}
    >
      <Icon />
    </button>
  );

  return (
    <div className="vt-wrapper">
      {btn('cards', CardsIcon, 'Cards View')}
      {btn('table', TableIcon, 'Table View')}
    </div>
  );
};

export default ViewToggle;