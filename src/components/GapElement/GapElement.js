import React from "react";
import { formatGapDisplay } from "../../utils/calculateProjectFinanceHelper";
import { GAP_CLASSES } from "../../utils/Dec";
import "../../features/projects/ProjectElements/ProjectElements.css";

export const GapElement = ({ financeData = {}, className = "" }) => {
  const {
    pearim = 0,
    statusPearim = "takin",
    totalTakzivCoachAdam = 0,
  } = financeData || {};

  return (
    <span className={`pc-gap ${GAP_CLASSES[statusPearim]} ${className}`}>
      {formatGapDisplay(pearim, totalTakzivCoachAdam)}
    </span>
  );
};

export default GapElement;
