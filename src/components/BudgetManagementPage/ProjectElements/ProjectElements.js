import React from "react";
import { formatMoney } from "../../../utils/formatMoney";
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

/**
 * תצוגה משותפת לכל סכום פער (חיובי/שלילי) עם חץ מתאים.
 * משמש גם בשורת/כרטיס פרויקט בודד וגם בריבועי הסיכום.
 */
export const GapIndicator = ({ value, statusPearim, achuzPearim, className = "" }) => {
  const isNegative = value < 0;
  const fallbackStatus = value === 0 ? STATUS_PAAR.TAKIN : (isNegative ? STATUS_PAAR.GERAON : STATUS_PAAR.ODEF);
  let status = statusPearim || fallbackStatus;
  if (value < 0 && status === STATUS_PAAR.TAKIN) {
    status = STATUS_PAAR.GERAON;
  }
  const absValue = Math.abs(value);
  const displayValue = value === 0
    ? `₪${formatMoney(absValue)}`
    : `${isNegative ? "▼ " : "▲ +"}${formatMoney(absValue)}`;

  return (
    <span className={`pc-gap pc-gap--${status} ${className}`} >
      {displayValue}
      {achuzPearim !== undefined && ` (${achuzPearim}%)`}
    </span>
  );
};

export const PearimElement = ({ financeData }) => {
  const { pearim, achuzPearim, statusPearim } = financeData;

  return (
    <GapIndicator value={pearim} achuzPearim={achuzPearim} statusPearim={statusPearim} />
  );
};