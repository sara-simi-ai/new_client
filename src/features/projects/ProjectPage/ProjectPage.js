import React from "react";
import FilterBar from "../FilterBar/FilterBar";
import SummarySquares from "../../../app/SummarySqueres/SummarySquares";
import ProjectsList from "../ProjectsList/ProjectsList";
import ProjectsToolbar from "../ProjectsToolbar/ProjectsToolbar";

export default function ProjectsPage() {

  return (
    <>

      <main className="page-shell">
        <FilterBar />
        <SummarySquares />
        <ProjectsToolbar />
        <ProjectsList />
      </main>
    </>
  );
}