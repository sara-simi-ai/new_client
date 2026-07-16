import { formatMoney } from './formatMoneyHelper';

const GAP_STATUS_THRESHOLD_PERCENT = Number(process.env.REACT_APP_GAP_STATUS_THRESHOLD_PERCENT) || 10;
export const GAP_STATUS_THRESHOLD = GAP_STATUS_THRESHOLD_PERCENT / 100;

export const computeProjectTotalBudget = (project) =>
  (project?.totalTakzivCoachAdam || 0) + (project?.totalTakzivRechesh || 0);

export const computeBudgetMinusPlanned = (project) =>
  (project?.totalTakzivCoachAdam || 0) - (project?.coachAdam || 0);

export const computeRelativeGap = (project) => {
  const gap = computeBudgetMinusPlanned(project);
  const budget = project?.totalTakzivCoachAdam || 0;
  return budget > 0 ? Math.abs(gap) / budget : 0;
};

export const isGapStatusExceeded = (project) => {
  const gap = computeBudgetMinusPlanned(project);
  return gap !== 0 && computeRelativeGap(project) >= GAP_STATUS_THRESHOLD;
};

export const compareByRelativeGap = (a, b) => {
  const gapDiff = computeRelativeGap(b) - computeRelativeGap(a);
  if (gapDiff !== 0) return gapDiff;

  const absA = Math.abs(computeBudgetMinusPlanned(a));
  const absB = Math.abs(computeBudgetMinusPlanned(b));
  if (absB !== absA) return absB - absA;

  return String(a.projectName || '').localeCompare(String(b.projectName || ''), 'he');
};

/**
 * קביעת סטטוס הפער (takin/geraon/odef)
 * @param {number} gapValue - ערך הפער
 * @param {number} totalBudget - סכום התקציב הכולל
 * @returns {string} - 'takin' (ללא חריגה) | 'geraon' (חריגה במינוס) | 'odef' (חריגה בפלוס)
 */
export const getGapStatus = (gapValue, totalBudget) => {
  if (gapValue === 0) return 'takin';
  
  const relativePercent = totalBudget > 0 ? Math.abs(gapValue) / totalBudget : 0;
  if (relativePercent >= GAP_STATUS_THRESHOLD) {
    return gapValue < 0 ? 'geraon' : 'odef';
  }
  
  return 'takin';
};

/**
 * פורמט אחיד להצגת פערים
 * @param {number} gapValue - ערך הפער
 * @param {number} totalBudget - סכום התקציב (לחישוב %)
 * @returns {string} - בפורמט: ₪0 (0%) או ▲ ₪100 (5%) או ▼ ₪50 (10%)
 */
export const formatGapDisplay = (gapValue, totalBudget) => {
  const absValue = Math.abs(gapValue);
  const displayValue = gapValue === 0
    ? `₪${formatMoney(absValue)}`
    : `${gapValue > 0 ? '▲ ' : '▼ '}₪${formatMoney(absValue)}`;
  
  if (totalBudget && totalBudget > 0) {
    const percent = Math.round(Math.abs(gapValue) / totalBudget * 100);
    return `${displayValue} (${percent}%)`;
  }
  
  return displayValue;
};

export const calculateProjectFinance = (project) => {
  const totalTakzivCoachAdam = project?.totalTakzivCoachAdam ?? 0;
  const totalTakzivRechesh = project?.totalTakzivRechesh || 0;
  const coachAdam = project?.coachAdam || 0;

  const totalTaktziv = totalTakzivCoachAdam + totalTakzivRechesh;
  const pearim = totalTakzivCoachAdam - coachAdam;

  const achuzPearim = (coachAdam > 0 && totalTakzivCoachAdam > 0)
    ? (pearim / totalTakzivCoachAdam) * 100
    : 0;

  const statusPearim = getGapStatus(pearim, totalTakzivCoachAdam);

  return {
    totalTakzivCoachAdam,
    totalTakzivRechesh,
    coachAdam,
    totalTaktziv,
    pearim,
    achuzPearim: Math.round(Math.abs(achuzPearim)),
    statusPearim,
  };
};
