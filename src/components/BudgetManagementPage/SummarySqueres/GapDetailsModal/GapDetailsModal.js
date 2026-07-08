import React from "react";
import { PearimElement, GapIndicator } from "../../ProjectElements/ProjectElements";
import { formatMoney } from "../../../../utils/formatMoney";
import GenericTable from "../../../Common/GenericTable";
import "./GapDetailsModal.css";

const columns = [
  {
    key: "name",
    header: "פרויקט",
    render: (row) => row.name,
    renderTotal: () => 'סה"כ',
  },
  {
    key: "actual",
    header: "תקציב בפועל",
    render: (row) => formatMoney(row.financeData.totalTakzivCoachAdam),
    renderTotal: (totals) => formatMoney(totals.totalActual),
  },
  {
    key: "planned",
    header: "תקציב מתוכנן",
    render: (row) => formatMoney(row.financeData.coachAdam),
    renderTotal: (totals) => formatMoney(totals.totalPlanned),
  },
  {
    key: "gap",
    header: "פער",
    render: (row) => <PearimElement financeData={row.financeData} />,
    renderTotal: (totals) => <GapIndicator value={totals.totalGap} />,
  },
];

export default function GapDetailsModal({ rows, totalGap, totalActual, onClose }) {
  
  const totalPlanned = rows.reduce((total, project) => total + (project.financeData.coachAdam || 0), 0);
  const totals = { totalPlanned, totalActual, totalGap };

  return (
    <div className="gdm-overlay" onClick={onClose}>
      <div className="gdm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="gdm-header">
          <div className="gdm-title">פערים בתקציב כ"א — {formatMoney(totalGap)}</div>
          <button className="gdm-close" onClick={onClose} aria-label="סגור">
            ✕
          </button>
        </div>

        <div className="gdm-body">
          <GenericTable
            columns={columns}
            data={rows}
            tableClassName="gdm-table"
            wrapperClassName=""
            footerData={totals}
          />
        </div>
      </div>
    </div>
  );
}