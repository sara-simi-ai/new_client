import React, { useState } from 'react';
import './ManagementHome.css';
import DepartmentsPage from '../DepartmentsPage/DepartmentsPage';
import TeamsPage from '../TeamsPage/TeamsPage';
import ProjectsManagementPage from '../ProjectsManagementPage/ProjectsManagementPage';

export default function ManagementHome() {
  const [currentPage, setCurrentPage] = useState('landing');

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
        <h2 className="mgmt-title">מסכי ניהול</h2>
        <p className="mgmt-sub">פלטפורמה מרכזית לניהול מלא של אגפים, צוותות ופרויקטים  </p>
      </div>

      <div className="mgmt-cards mgmt-landing">
        <div className="mgmt-card card-small">
          <h3>ניהול אגפים</h3>
          <p className="muted">תחזוקה וארגון של אגפי הפעילות בחברה – הוסף, ערוך או מחק אגפים בקלות</p>
          <div className="card-actions">
            <button type="button" className="card-link-btn" onClick={() => setCurrentPage('departments')}>
             לניהול 
            </button>
          </div>
        </div>

        <div className="mgmt-card">
          <h3>ניהול צוותות</h3>
          <p className="muted">הנהלת צוותים וקבוצות עבודה – נהל את מבנה הצוותים והקשרים בתוך כל אגף</p>
          <div className="card-actions">
            <button type="button" className="card-link-btn" onClick={() => setCurrentPage('teams')}>
              לניהול 
            </button>
          </div>
        </div>

        <div className="mgmt-card card-small">
          <h3>ניהול פרויקטים</h3>
          <p className="muted">פיקוח עדכני על פרויקטים ותקדמותם – עקוב אחרי מעמד וביצועי כל פרויקט</p>
          <div className="card-actions">
            <button type="button" className="card-link-btn" onClick={() => setCurrentPage('projects')}>
              לניהול 
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
