import React from 'react';
import './MainTabs.css';
import { useProjects } from '../../../services/context/ProjectsContext';
import ProjectsPage from '../ProjectPage/ProjectPage';
import DashboardModule from '../Dashboard/DashboardModule/DashboardModule';

const TABS = [
  { id: 'projects',  label: 'פרויקטים' },
  { id: 'dashboard', label: 'תמונת מצב' },
];

export default function MainTabs() {
  const { activeTab, setActiveTab } = useProjects();

  return (
    <div className="main-tabs">
      <div className="main-tabs-nav">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`main-tabs-btn ${activeTab === t.id ? 'main-tabs-btn--active' : ''}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="main-tabs-content">
        {activeTab === 'projects'  && <ProjectsPage />}
        {activeTab === 'dashboard' && <DashboardModule />}
      </div>
    </div>
  );
}
