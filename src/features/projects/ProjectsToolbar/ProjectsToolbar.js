import React from "react";
import "./ProjectsToolbar.css";
import NewProjectButton from "./NewProjectButton/NewProjectButton";
import ViewToggle from "./ViewToggle/ViewToggle";
import { useProjects } from "../../../services/context/ProjectsContext";

export default function ProjectsToolbar() {
  const { viewMode, setViewMode } = useProjects();

  return (
    <div className="projects-toolbar" dir="rtl">
      <NewProjectButton />
      <ViewToggle view={viewMode} onChange={setViewMode} />
    </div>
  );
}