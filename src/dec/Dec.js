
export const MASLOL = {
  KIYUM: { value: "KIYUM", label: "קיום" },
  HITAZMUT: { value: "HITAZMUT", label: "התעצמות" },
};

export const MASLOL_OPTIONS = Object.values(MASLOL); 

export const GAP_STATUS = {
  TAKIN: { value: "takin", label: "אין פער" },
  ODEF: { value: "odef", label: "פער בפלוס" },
  GERAON: { value: "geraon", label: "פער במינוס" },
};

export const GAP_STATUS_OPTIONS = Object.values(GAP_STATUS);

export const GAP_CLASSES = {
  takin: 'gap--neutral',
  odef: 'gap--surplus',
  geraon: 'gap--over'
};

export const HR_BUDGET_LABEL = 'תקציב כ"א';
export const PROCUREMENT_BUDGET_LABEL = 'תקציב רכש';
export const PLANNED_HR_LABEL = 'תכנון כ"א';
export const GAPS_LABEL = 'פערים';
export const TOTAL_BUDGET_LABEL = 'סה"כ תקציב';
export const TOTAL_GAPS_LABEL = 'סה"כ פערים';
export const PROJECT_NAME_LABEL = 'שם הפרויקט';
export const AGAF_LABEL = 'אגף';
export const UNIT_LABEL = 'יחידה מבצעת';
export const CONTINUATION_LABEL = 'המשכיות';
export const MASLOL_LABEL = 'מסלול';

export const AGAF_OPTIONS = ["פיתוח", "תחזוקה", "מערכות מידע"];
export const YECHIDA_MEVATSAAT_OPTIONS = ["דיגיטל", "דבאופס", "תשתיות", "דיבי", "מערכות ליבה"];

export default { MASLOL, MASLOL_OPTIONS, GAP_STATUS, GAP_STATUS_OPTIONS, GAP_CLASSES, AGAF_OPTIONS, YECHIDA_MEVATSAAT_OPTIONS, HR_BUDGET_LABEL, PROCUREMENT_BUDGET_LABEL, PLANNED_HR_LABEL, GAPS_LABEL, TOTAL_BUDGET_LABEL, TOTAL_GAPS_LABEL, PROJECT_NAME_LABEL, AGAF_LABEL, UNIT_LABEL, CONTINUATION_LABEL, MASLOL_LABEL };