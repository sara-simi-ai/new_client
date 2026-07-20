import React, { useEffect } from 'react';
import '../ManagementShared.css';
import '../ManagementOptionsPage/ManagementOptionsPage.css';
import './ProjectsManagementPage.css';
import BackButton from '../../../components/BackButton/BackButton';
import ToggleActiveButton from '../../../components/ToggleActiveButton/ToggleActiveButton';
import { useProjects } from '../../../services/context/ProjectsContext';

export default function ProjectsManagementPage({ onBack }) {
  const { loadAllProjects, allProjects, updateProjectData } = useProjects();

  useEffect(() => {
    if (!allProjects?.length) {
      loadAllProjects().catch(() => {});
    }
  }, []);

  const toggleActive = async (project) => {
    const updated = { ...project, active: !project.active };
    await updateProjectData(updated);
  };

  return (
    <div className="mgmt-page no-card-bg" dir="rtl">
      <div className="mgmt-page-header">
        <div>
          <h1 className="mgmt-page-title">ניהול פרויקטים</h1>
          <p className="mgmt-page-subtitle">סקירת כל הפרויקטים וניהול המצב הפעיל שלהם.</p>
        </div>
        <BackButton onClick={onBack} />
      </div>

      <div className="mgmt-page-content">
        <div className="mgmt-card">
          <div className="agaff-list">
            {!allProjects?.length && <div className="agaff-empty">לא נמצאו פרויקטים. טוען...</div>}
            {allProjects?.map((project) => (
              <div className="agaff-item" key={project.id}>
                <div className="agaff-name">{project.projectName || project.teur || '—'}</div>
                <div className="agaff-actions">
                  <ToggleActiveButton
                    active={project.active !== false}
                    onClick={() => toggleActive(project)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
