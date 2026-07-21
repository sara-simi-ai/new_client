
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

export const GAP_STATUS_OPTIONS = [
  { value: "__all__", label: "כל הפערים" },
  ...Object.values(GAP_STATUS),
];

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
export const TSEVET_LABEL = 'מבוצע ע"י';
export const CONTINUATION_LABEL = 'המשכי';
export const CONTINUATION_TRUE_LABEL = 'כן';
export const CONTINUATION_FALSE_LABEL = 'לא';
export const MASLOL_LABEL = 'מסלול';

export const AGAF_OPTIONS = [
  { value: "__all__", label: "כל האגפים" },
  { value: "פיתוח", label: "פיתוח" },
  { value: "תחזוקה", label: "תחזוקה" },
  { value: "מערכות מידע", label: "מערכות מידע" },
];

export const YECHIDA_MEVATSAAT_OPTIONS = [
  { value: "__all__", label: "כל היחידות המבצעות" },
  { value: "דיגיטל", label: "דיגיטל" },
  { value: "דבאופס", label: "דבאופס" },
  { value: "תשתיות", label: "תשתיות" },
  { value: "דיבי", label: "דיבי" },
  { value: "מערכות ליבה", label: "מערכות ליבה" },
];

export default { MASLOL, MASLOL_OPTIONS, GAP_STATUS, GAP_STATUS_OPTIONS, GAP_CLASSES, AGAF_OPTIONS, YECHIDA_MEVATSAAT_OPTIONS, HR_BUDGET_LABEL, PROCUREMENT_BUDGET_LABEL, PLANNED_HR_LABEL, GAPS_LABEL, TOTAL_BUDGET_LABEL, TOTAL_GAPS_LABEL, PROJECT_NAME_LABEL, AGAF_LABEL, TSEVET_LABEL, CONTINUATION_LABEL, CONTINUATION_TRUE_LABEL, CONTINUATION_FALSE_LABEL, MASLOL_LABEL };