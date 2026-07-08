import React from "react";
import { useProjects } from "../../../services/context/ProjectsContext";
import ProjectCard from "./ProjectCard/ProjectCard";
import ProjectDetailModal from "../../Common/ProjectDetailModal";
import ProjectTable from "../ProjectTable/ProjectTable";
import "./ProjectsList.css";

export default function ProjectsList() {

  const {
    filteredProjects, isLoading, viewMode, selectedProject, setSelectedProjectId } = useProjects();

  if (isLoading) {
    return <section className="p-list-section p-table--load" dir="rtl"><p>טוען פרויקטים...</p></section>;
  }

  if (!filteredProjects?.length) {
    return <section className="p-list-section p-table--empty" dir="rtl"><p>לא נמצאו פרויקטים להצגה.</p></section>;
  }

  const closeDetail = () => setSelectedProjectId(null);

  return (
    <section className="p-list-section" dir="rtl">
      {viewMode === "table" ? (
        <div className="p-table-layout">
          <ProjectTable projects={filteredProjects} />
        </div>
      ) : (
        <div className="p-grid">
          {filteredProjects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
      <ProjectDetailModal project={selectedProject} onClose={closeDetail} />
    </section>
  );
}