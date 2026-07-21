import React, { useState } from 'react';
import './ManagementHome.css';
import DepartmentsPage from '../DepartmentsPage/DepartmentsPage';
import TeamsPage from '../TeamsPage/TeamsPage';
import ProjectsManagementPage from '../ProjectsManagementPage/ProjectsManagementPage';
import {
  MANAGEMENT_TITLE,
  MANAGEMENT_SUBTITLE,
  DEPARTMENTS_TITLE,
  DEPARTMENTS_CARD_DESC,
  TEAMS_TITLE,
  TEAMS_CARD_DESC,
  PROJECTS_TITLE,
  PROJECTS_CARD_DESC,
  MANAGEMENT_MANAGE_BUTTON,
} from '../../../utils/Dec';

export default function ManagementHome() {
  const [currentPage, setCurrentPage] = useState('landing');

  const cards = [
    {
      title: DEPARTMENTS_TITLE,
      description: DEPARTMENTS_CARD_DESC,
      page: 'departments',
      className: 'mgmt-card card-small',
    },
    {
      title: TEAMS_TITLE,
      description: TEAMS_CARD_DESC,
      page: 'teams',
      className: 'mgmt-card',
    },
    {
      title: PROJECTS_TITLE,
      description: PROJECTS_CARD_DESC,
      page: 'projects',
      className: 'mgmt-card card-small',
    },
  ];

  const renderPage = () => {
    if (currentPage === 'departments') {
      return <DepartmentsPage onBack={() => setCurrentPage('landing')} />;
    }
    if (currentPage === 'teams') {
      return <TeamsPage onBack={() => setCurrentPage('landing')} />;
    }
    if (currentPage === 'projects') {
      return <ProjectsManagementPage onBack={() => setCurrentPage('landing')} />;
    }
    return null;
  };

  if (currentPage !== 'landing') {
    return renderPage();
  }

  return (
    <div className="mgmt" dir="rtl">
      <div className="mgmt-header">
        <h2 className="mgmt-title">{MANAGEMENT_TITLE}</h2>
        <p className="mgmt-sub">{MANAGEMENT_SUBTITLE}</p>
      </div>

      <div className="mgmt-cards mgmt-landing">
        {cards.map(({ title, description, page, className }) => (
          <div key={page} className={className}>
            <h3>{title}</h3>
            <p className="muted">{description}</p>
            <div className="card-actions">
              <button
                type="button"
                className="card-link-btn"
                onClick={() => setCurrentPage(page)}
              >
                {MANAGEMENT_MANAGE_BUTTON}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
