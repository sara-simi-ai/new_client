import React from "react";
import { useProjects } from "../../../services/context/ProjectsContext";
import { GapElement } from "../../../components/GapElement/GapElement";
import { formatMoney } from "../../../utils/formatMoneyHelper";
import { getGapStatus } from "../../../utils/calculateProjectFinanceHelper";
import { PROJECT_NAME_LABEL, AGAF_LABEL, TSEVET_LABEL, CONTINUATION_LABEL, CONTINUATION_TRUE_LABEL, CONTINUATION_FALSE_LABEL, MASLOL_LABEL, HR_BUDGET_LABEL, PROCUREMENT_BUDGET_LABEL, PLANNED_HR_LABEL, GAPS_LABEL, MASLOL_OPTIONS, MASLOL } from "../../../utils/Dec";
import { getOptionLabelByValue } from "../../../utils/optionHelpers";
import GenericTable from "../../../components/GenericTable/GenericTable";
import "../ProjectsList/Project.css";
import "./ProjectTable.css";


const columns = [
  {
    key: "checkbox",
    label: "",
    headerClassName: "pt-th-checkbox",
    cellClassName: "tr-checkbox",
    render: (row) => (
      <input type="checkbox" className="project-checkbox" data-id={row.id} />
    ),
  },
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
    render: (row) => row.agaffName,
  },
  {
    key: "unit",
    label: TSEVET_LABEL,
    cellClassName: "tr-unit",
    render: (row) => row.tsevetMevatseaName,
  },
  {
    key: "continuation",
    label: CONTINUATION_LABEL,
    cellClassName: "tr-continuation",
    render: (row) => {
      const isContinuation = Boolean(row.logHemsheci);
      const continuationText = isContinuation ? CONTINUATION_TRUE_LABEL : CONTINUATION_FALSE_LABEL;
      return continuationText;
    },
  },
  {
    key: "status",
    label: MASLOL_LABEL,
    headerClassName: "pt-th-status",
    cellClassName: "tr-status",
    render: (row) => {
      return getOptionLabelByValue(MASLOL_OPTIONS, row.maslol);
    },
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

export default function ProjectTable({ projects, onRowClick }) {
  const { projectFinanceMap } = useProjects();

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

  const columnsWithoutCheckbox = columns.filter((col) => col.key !== "checkbox");

  const getRowClassName = () => "tr-item";

  const handleRowClick = (row) => {
    if (onRowClick) {
      onRowClick(row.id);
    }
  };

  return (
    <div>
      <GenericTable
        columns={columnsWithoutCheckbox}
        data={rowsWithFinance}
        tableClassName="p-table"
        wrapperClassName="p-table-wrap"
        footerData={totals}
        onRowClick={handleRowClick}
      />
    </div>
  );
}