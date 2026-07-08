import React from "react";
import { useProjects } from "../../../services/context/ProjectsContext";
import { MaslolElement, PearimElement, HemsheciElement } from "../ProjectElements/ProjectElements";
import { formatMoney } from "../../../utils/formatMoney";
import GenericTable from "../../Common/GenericTable";
import "../ProjectsList/Project.css";
import "./ProjectTable.css";


const columns = [
  {
    key: "name",
    label: "שם הפרויקט",
    headerClassName: "pt-th-name",
    cellClassName: "tr-name-cell",
    render: (row) => (
      <div className="tr-name" title={row.projectName}>{row.projectName}</div>
    ),
  },
  {
    key: "sector",
    label: "אגף",
    cellClassName: "tr-sector",
    render: (row) => row.agaff,
  },
  {
    key: "unit",
    label: "יחידה מבצעת",
    cellClassName: "tr-unit",
    render: (row) => row.yechidaMevatzat,
  },
  {
    key: "continuation",
    label: "המשכיות",
    cellClassName: "tr-continuation",
    render: (row) => (
      <HemsheciElement
        isHemshechi={row.logHemsheci}
        trueLabel="המשכי: כן"
        falseLabel="חדש"
      />
    ),
  },
  {
    key: "status",
    label: "מסלול",
    headerClassName: "pt-th-status",
    cellClassName: "tr-status",
    render: (row) => <MaslolElement maslol={row.maslol} />,
  },
  {
    key: "hrBudget",
    label: 'תקציב כ"א',
    cellClassName: "tr-num",
    render: (row) => formatMoney(row.financeData?.totalTakzivCoachAdam || 0),
  },
  {
    key: "procBudget",
    label: "תקציב רכש",
    cellClassName: "tr-num",
    render: (row) => formatMoney(row.financeData?.totalTakzivRechesh || 0),
  },
  {
    key: "gaps",
    label: "פערים",
    cellClassName: "tr-num",
    render: (row) => <PearimElement financeData={row.financeData || {}} />,
  },
];

/**
 * Projects table wrapper.
 * Uses GenericTable with project-specific logic: selection, context integration.
 * Pass it any list of projects (full list, filtered list, a modal segment, etc.)
 */
export default function Table({ projects }) {
  const { selectedProjectId, setSelectedProjectId, projectFinanceMap } = useProjects();

  const rowsWithFinance = projects.map((project) => ({
    ...project,
    financeData: projectFinanceMap[project.id] || {},
  }));

  const handleRowClick = (row) => {
    const isSelected = selectedProjectId === row.id;
    setSelectedProjectId(isSelected ? null : row.id);
  };

  const getRowClassName = (row) => {
    const isSelected = selectedProjectId === row.id;
    return `tr-item ${isSelected ? "sel" : ""}`;
  };

  return (
    <GenericTable
      columns={columns}
      data={rowsWithFinance}
      tableClassName="p-table"
      wrapperClassName="p-table-wrap"
      rowClassName={getRowClassName}
      onRowClick={handleRowClick}
    />
  );
}