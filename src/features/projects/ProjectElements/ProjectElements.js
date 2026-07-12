import React from "react";
import { formatGapDisplay } from "../../../utils/calculateProjectFinance";
import { STATUS_PAAR, MASLOL_OPTIONS, MASLOL } from "../../../constants/constants"; 
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
  trueLabel = "המשכי",
  falseLabel = "חדש",
}) => {
  const isContinuation = Boolean(isHemshechi);

  return (
    <span className={`badge ${isContinuation ? "b-yes" : "b-no"}`}>
      {isContinuation ? trueLabel : falseLabel}
    </span>
  );
};


const normalizeGapStatus = (value, statusPearim) => {
  if (typeof statusPearim === "string" && statusPearim) {
    return statusPearim;
  }

  if (value === 0) return STATUS_PAAR.TAKIN.value;
  return value < 0 ? STATUS_PAAR.GERAON.value : STATUS_PAAR.ODEF.value;
};

export const PearimElement = ({ financeData }) => {
  const { pearim, statusPearim, totalTakzivCoachAdam } = financeData;
  const status = normalizeGapStatus(pearim, statusPearim);

  return (
    <span className={`pc-gap pc-gap--${status}`}>
      {formatGapDisplay(pearim, totalTakzivCoachAdam)}
    </span>
  );
};