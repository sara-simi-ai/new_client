// keep only colors that are actually used by the dashboard components
export const DASH_COLORS = ['#1e3a5f', '#3b82f6'];

// Format large numbers compactly: 1_000 -> '1K', 1_000_000 -> '1.0M'
export const formatCompactNumber = (n) =>
  n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
    ? `${(n / 1_000).toFixed(0)}K`
    : String(n);

// compute total budget for a project (HR budget + procurement budget)
export const computeProjectTotalBudget = (p) => (p.totalTakzuvCoachAdam || 0) + (p.totalTakzivRechesh || 0);

// compute budget gap as (HR budget - planned HR)
export const computeBudgetMinusPlanned = (p) => (p.totalTakzuvCoachAdam || 0) - (p.coachAdam || 0);

const STATUS_PAAR_THRESHOLD_PERCENT = Number(process.env.REACT_APP_STATUS_PAAR_THRESHOLD_PERCENT) || 10;
export const STATUS_PAAR_THRESHOLD = STATUS_PAAR_THRESHOLD_PERCENT / 100; // פער נחשב כחריגה החל מ-10% או לפי env
export const GAP_DISPLAY_THRESHOLD = 0.4; // תצוגה ראשונית של פרויקטים עם פער גבוה מ-40%

export const computeRelativeGap = (p) => {
  const g = computeBudgetMinusPlanned(p);
  const base = Math.max(p.coachAdam || 0, p.totalTakzuvCoachAdam || 0, 1);
  return Math.abs(g) / base;
};

export const isGapStatusExceeded = (p) => {
  const g = computeBudgetMinusPlanned(p);
  return g !== 0 && computeRelativeGap(p) >= STATUS_PAAR_THRESHOLD;
};

export const isProjectShownInGapChart = (p) => {
  const g = computeBudgetMinusPlanned(p);
  return g !== 0 && computeRelativeGap(p) >= GAP_DISPLAY_THRESHOLD;
};

// Donut geometry constants (clearer names)
export const CIRCLE_RADIUS = 48;
export const CIRCLE_CENTER_X = 56;
export const CIRCLE_CENTER_Y = 56;
export const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;
