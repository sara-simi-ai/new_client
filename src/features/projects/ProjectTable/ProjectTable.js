import React from "react";
import { useProjects } from "../../../services/context/ProjectsContext";
import { MaslolElement, HemsheciElement } from "../ProjectElements/ProjectElements";
import { GapElement } from "../../../components/GapElement/GapElement";
import { formatMoney } from "../../../utils/formatMoneyHelper";
import { getGapStatus } from "../../../utils/calculateProjectFinanceHelper";
import { PROJECT_NAME_LABEL, AGAF_LABEL, UNIT_LABEL, CONTINUATION_LABEL, CONTINUATION_TRUE_LABEL, CONTINUATION_FALSE_LABEL, MASLOL_LABEL, HR_BUDGET_LABEL, PROCUREMENT_BUDGET_LABEL, PLANNED_HR_LABEL, GAPS_LABEL } from "../../../utils/Dec";
import GenericTable from "../../../components/GenericTable/GenericTable";
import "../ProjectsList/Project.css";
import "./ProjectTable.css";


const columns = [
  {
    key: "name",
    label: PROJECT_NAME_LABEL,
    headerClassName: "pt-th-name",
    cellClassName: "tr-name-cell",
    render: (row) => (
      <div className="tr-name" title={row.projectName}>{row.projectName}</div>
    ),
    renderTotal: () => "סה\"כ",
  },
  {
    key: "sector",
    label: AGAF_LABEL,
    cellClassName: "tr-sector",
    render: (row) => row.agaff,
  },
  {
    key: "unit",
    label: UNIT_LABEL,
    cellClassName: "tr-unit",
    render: (row) => row.yechidaMevatzat,
  },
  {
    key: "continuation",
    label: CONTINUATION_LABEL,
    cellClassName: "tr-continuation",
    render: (row) => (
      <HemsheciElement
        isHemshechi={row.logHemsheci}
        trueLabel={CONTINUATION_TRUE_LABEL}
        falseLabel={CONTINUATION_FALSE_LABEL}
      />
    ),
  },
  {
    key: "status",
    label: MASLOL_LABEL,
    headerClassName: "pt-th-status",
    cellClassName: "tr-status",
    render: (row) => <MaslolElement maslol={row.maslol} />,
  },
  {
    key: "plannedHr",
    label: PLANNED_HR_LABEL,
    cellClassName: "tr-num",
    render: (row) => formatMoney(row.financeData?.coachAdam || 0),
    renderTotal: (totals) => formatMoney(totals.totalPlannedHr),
  },
  {
    key: "hrBudget",
    label: HR_BUDGET_LABEL,
    cellClassName: "tr-num",
    render: (row) => formatMoney(row.financeData?.totalTakzivCoachAdam || 0),
    renderTotal: (totals) => formatMoney(totals.totalHR),
  },
  {
    key: "procBudget",
    label: PROCUREMENT_BUDGET_LABEL,
    cellClassName: "tr-num",
    render: (row) => formatMoney(row.financeData?.totalTakzivRechesh || 0),
    renderTotal: (totals) => formatMoney(totals.totalProcurement),
  },
  {
    key: "gaps",
    label: GAPS_LABEL,
    cellClassName: "tr-num",
    render: (row) => <GapElement financeData={row.financeData || {}} />,
    renderTotal: (totals) => (
      <GapElement
        financeData={{
          pearim: totals.totalGap,
          statusPearim: getGapStatus(totals.totalGap, totals.totalHR),
          totalTakzivCoachAdam: totals.totalHR,
        }}
      />
    ),
  },
];

export default function ProjectTable({ projects }) {
  const { selectedProjectId, setSelectedProjectId, projectFinanceMap } = useProjects();

  const rowsWithFinance = projects.map((project) => ({
    ...project,
    financeData: projectFinanceMap[project.id] || {},
  }));

  const totals = rowsWithFinance.reduce(
    (acc, project) => {
      const financeData = project.financeData || {};
      acc.totalHR += financeData.totalTakzivCoachAdam || 0;
      acc.totalPlannedHr += financeData.coachAdam || 0;
      acc.totalProcurement += financeData.totalTakzivRechesh || 0;
      acc.totalGap += financeData.pearim || 0;
      return acc;
    },
    { totalHR: 0, totalPlannedHr: 0, totalProcurement: 0, totalGap: 0 }
  );

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
      footerData={totals}
    />
  );
}