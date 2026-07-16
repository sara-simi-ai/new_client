import React, { useState, useMemo } from "react";
import { useProjects } from "../../services/context/ProjectsContext";
import { formatMoney } from "../../utils/formatMoneyHelper";
import { formatGapDisplay, getGapStatus } from "../../utils/calculateProjectFinanceHelper";
import { GapElement } from "../../components/GapElement/GapElement";
import { GAP_CLASSES, HR_BUDGET_LABEL, PROCUREMENT_BUDGET_LABEL, TOTAL_BUDGET_LABEL, GAPS_LABEL, PLANNED_HR_LABEL } from "../../utils/Dec";
import GapDetailsModal from "./GapDetailsModal/GapDetailsModal";
import "./SummarySquares.css";

export default function SummarySquares() {
  const { summaryData, isLoading, gapDetails } = useProjects();
  const { totalCount, totalActive, totalHR, totalProc, totalBudget, totalGap } = summaryData;
  const [isGapOpen, setIsGapOpen] = useState(false);

  const totalGapStatus = useMemo(() => {
    return getGapStatus(totalGap, totalHR);
  }, [totalGap, totalHR]);

  const totalPlanned = useMemo(() => {
    return gapDetails.reduce((total, project) => total + (project.financeData.coachAdam || 0), 0);
  }, [gapDetails]);

  const summaryCards = [
    { label: "פרויקטים", value: totalCount },
    { label: TOTAL_BUDGET_LABEL, value: formatMoney(totalBudget) },
    { label: PROCUREMENT_BUDGET_LABEL, value: formatMoney(totalProc) },
    { label: PLANNED_HR_LABEL, value: formatMoney(totalPlanned) },
    { label: HR_BUDGET_LABEL, value: formatMoney(totalHR) },
  ];

  if (isLoading) return <div className="ss-wrapper">טוען סיכומים...</div>;

  return (
    <div className="ss-wrapper">
      <div className="ss-grid">
        {summaryCards.map(({ label, value }) => (
          <div key={label} className="ss-card">
            <div className="ss-title">{label}</div>
            <div className="ss-value">{value}</div>
          </div>
        ))}

        <div
          className={`ss-card ss-card--clickable${isGapOpen ? " ss-card--active" : ""}`}
          onClick={() => setIsGapOpen(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setIsGapOpen(true);
          }}
        >
          <div className="ss-title">{GAPS_LABEL}</div>
          <div className="ss-value">
            <GapElement financeData={{ pearim: totalGap, statusPearim: totalGapStatus, totalTakzivCoachAdam: totalHR }} />
          </div>
        </div>
      </div>

      {isGapOpen && (
        <GapDetailsModal
          rows={gapDetails}
          totalGap={totalGap}
          totalHR={totalHR}
          totalPlanned={totalPlanned}
          onClose={() => setIsGapOpen(false)}
        />
      )}
    </div>
  );
}