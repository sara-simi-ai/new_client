import React from "react";
import { formatGapDisplay } from "../../utils/calculateProjectFinanceHelper";
import { GAP_STATUS_BY_VALUE } from "../../utils/Dec";
// import "../../features/projects/ProjectElements/ProjectElements.css";

export const GapElement = ({ financeData = {}, className = "" }) => {
  const {
    pearim = 0,
    statusPearim = "takin",
    totalTakzivCoachAdam = 0,
  } = financeData || {};

  return (
    <span className={`pc-gap ${GAP_STATUS_BY_VALUE[statusPearim]?.className || ""} ${className}`}>
      {formatGapDisplay(pearim, totalTakzivCoachAdam)}
    </span>
  );
};

export default GapElement;
