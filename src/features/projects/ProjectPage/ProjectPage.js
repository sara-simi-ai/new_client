import React from "react";
import FilterBar from "../FilterBar/FilterBar";
import ProjectsList from "../ProjectsList/ProjectsList";
import ProjectsToolbar from "../ProjectsToolbar/ProjectsToolbar";

export default function ProjectsPage() {

  return (
    <>

      <main className="page-shell">
        <FilterBar />
        <ProjectsToolbar />
        <ProjectsList />
      </main>
    </>
  );
}