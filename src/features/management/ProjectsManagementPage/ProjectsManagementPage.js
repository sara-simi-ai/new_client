import React, { useEffect } from 'react';
import '../ManagementShared.css';
import '../ManagementOptionsPage/ManagementOptionsPage.css';
import './ProjectsManagementPage.css';
import BackButton from '../../../components/BackButton/BackButton';
import ToggleActiveButton from '../../../components/ToggleActiveButton/ToggleActiveButton';
import { useProjects } from '../../../services/context/ProjectsContext';
import {
  PROJECTS_TITLE,
  PROJECTS_SUBTITLE,
  PROJECTS_EMPTY_STATE,
} from '../../../utils/Dec';

export default function ProjectsManagementPage({ onBack }) {
  const { loadAllProjects, allProjects, toggleProjectStatus } = useProjects();

  useEffect(() => {
    if (!allProjects?.length) {
      loadAllProjects().catch(() => {});
    }
  }, []);

  const toggleActive = async (project) => {
    if (!project?.id) return;

    try {
      await toggleProjectStatus(project.id);
    } catch (error) {
      console.error("Failed to toggle project active status:", error);
    }
  };

  return (
    <div className="mgmt-page no-card-bg" dir="rtl">
      <div className="mgmt-page-header">
        <div>
          <h1 className="mgmt-page-title">{PROJECTS_TITLE}</h1>
          <p className="mgmt-page-subtitle">{PROJECTS_SUBTITLE}</p>
        </div>
        <BackButton onClick={onBack} />
      </div>

      <div className="mgmt-page-content">
        <div className="mgmt-card">
          <div className="agaff-list">
            {!allProjects?.length && <div className="agaff-empty">{PROJECTS_EMPTY_STATE}</div>}
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
