import React from 'react';
import './ManagementButton.css';
import { useProjects } from '../../../services/context/ProjectsContext';

export default function ManagementButton() {
  const { setActiveTab } = useProjects();

  const handleClick = () => {
    setActiveTab('management');
  };

  return (
    <button type="button" className="btn-management" onClick={handleClick} aria-label="מסך ניהול">
      מסך ניהול
    </button>
  );
}
