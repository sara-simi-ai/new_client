import { formatMoney } from './formatMoneyHelper';

const GAP_STATUS_THRESHOLD_PERCENT = Number(process.env.REACT_APP_GAP_STATUS_THRESHOLD_PERCENT) || 10;
export const GAP_STATUS_THRESHOLD = GAP_STATUS_THRESHOLD_PERCENT / 100;

export const computeProjectTotalBudget = (project) =>
  coerceToNumber(project?.totalTakzivCoachAdam) + coerceToNumber(project?.totalTakzivRechesh);

export const computeBudgetMinusPlanned = (project) =>
  coerceToNumber(project?.totalTakzivCoachAdam) - coerceToNumber(project?.coachAdam);

export const computeRelativeGap = (project) => {
  const gap = computeBudgetMinusPlanned(project);
  const budget = coerceToNumber(project?.totalTakzivCoachAdam);
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

export const coerceToNumber = (value) => {
  if (value === null || value === undefined || value === '') return 0;

  if (typeof value === 'string') {
    const normalized = value.trim();
    if (!normalized || normalized === '----' || normalized === 'לא הוכנס תכנון') return 0;

    const parsed = Number(normalized.replace(/[$₪\s,]/g, '').replace('%', ''));
    return Number.isFinite(parsed) ? parsed : 0;
  }

  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : 0;
};

export const hasMissingPlannedHrValue = (value) => {
  const plannedHr = coerceToNumber(value);
  return Number.isFinite(plannedHr) && plannedHr === 0;
};

export const isMissingPlannedHrValue = hasMissingPlannedHrValue;

export const getProjectGapStatus = (financeData = {}, project = {}) => {
  const plannedValue = Number(financeData?.coachAdam ?? project?.coachAdam ?? 0);

  if (hasMissingPlannedHrValue(plannedValue)) {
    return 'missing_planning';
  }

  return financeData?.statusPearim || 'takin';
};

/**
 * Returns the display text for planned HR values.
 * When the value is not entered, show the shared placeholder instead of 0.
 */
export const formatPlannedHrValue = (value, { showPlaceholder = true } = {}) => {
  const numericValue = coerceToNumber(value);

  if (showPlaceholder && hasMissingPlannedHrValue(numericValue)) {
    return '----';
  }

  return formatMoney(numericValue);
};

/**
 * פורמט אחיד להצגת פערים
 * @param {number} gapValue - ערך הפער
 * @param {number} totalBudget - סכום התקציב (לחישוב %)
 * @param {{ signStyle?: 'arrow' | 'plusMinus', plannedValue?: number, showMissingPlanningPlaceholder?: boolean }} [options]
 * @returns {string} - e.g. ₪0 (0%) or ▲ ₪100 (5%) / + ₪100 (5%) or ▼ ₪50 (10%) / - ₪50 (10%)
 */
export const formatGapDisplay = (gapValue, totalBudget, { signStyle = 'arrow', plannedValue, showMissingPlanningPlaceholder = true } = {}) => {
  const safeGapValue = coerceToNumber(gapValue);
  const safeTotalBudget = coerceToNumber(totalBudget);
  const safePlannedValue = coerceToNumber(plannedValue);
  const absValue = Math.abs(safeGapValue);
  const numericPercent = safeTotalBudget && safeTotalBudget > 0 ? Math.round((absValue / safeTotalBudget) * 100) : 0;

  if (showMissingPlanningPlaceholder && hasMissingPlannedHrValue(safePlannedValue)) {
    return '----';
  }

  const signs = signStyle === 'plusMinus' ? { positive: '+ ', negative: '- ' } : { positive: '▲ ', negative: '▼ ' };
  const displayValue = safeGapValue === 0
    ? `₪${formatMoney(absValue)}`
    : `${safeGapValue > 0 ? signs.positive : signs.negative}₪${formatMoney(absValue)}`;

  if (safeTotalBudget && safeTotalBudget > 0) {
    return `${displayValue} (${numericPercent}%)`;
  }

  return displayValue;
};

export const calculateProjectFinance = (project) => {
  const totalTakzivCoachAdam = coerceToNumber(project?.totalTakzivCoachAdam ?? 0);
  const totalTakzivRechesh = coerceToNumber(project?.totalTakzivRechesh ?? 0);
  const coachAdam = coerceToNumber(project?.coachAdam ?? 0);

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