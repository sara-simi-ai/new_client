import React from "react";
import { formatGapDisplay } from "../../../utils/calculateProjectFinanceHelper";
import { GAP_CLASSES, MASLOL_OPTIONS, MASLOL, CONTINUATION_TRUE_LABEL, CONTINUATION_FALSE_LABEL, CONTINUATION_LABEL } from "../../../utils/Dec"; 
import "./ProjectElements.css";

export const isKiyumMaslol = (maslol) => maslol === MASLOL.KIYUM.value; 

export const MaslolElement = ({ maslol }) => {
  const isKiyum = isKiyumMaslol(maslol);
  const label = MASLOL_OPTIONS.find((o) => o.value === maslol)?.label || "לא ידוע";

  return (
    <span className={`badge ${isKiyum ? "b-kioom" : "b-hit"}`}>
      {label}
    </span>
  );
};

export const HemsheciElement = ({
  isHemshechi,
  trueLabel = CONTINUATION_TRUE_LABEL,
  falseLabel = CONTINUATION_FALSE_LABEL,
}) => {
  const isContinuation = Boolean(isHemshechi);

  return (
    <span className={`badge ${isContinuation ? "b-yes" : "b-no"}`}>
      {CONTINUATION_LABEL}: {isContinuation ? trueLabel : falseLabel}
    </span>
  );
};