
export const MASLOL = {
  KIYUM: { value: "KIYUM", label: "קיום" },
  HITAZMUT: { value: "HITAZMUT", label: "התעצמות" },
};

export const MASLOL_OPTIONS = Object.values(MASLOL); 

export const STATUS_PAAR = {
  TAKIN: { value: "takin", label: "אין פער" },
  ODEF: { value: "odef", label: "פער בפלוס" },
  GERAON: { value: "geraon", label: "פער במינוס" },
};

export const STATUS_PAAR_OPTIONS = Object.values(STATUS_PAAR);

export const AGAF_OPTIONS = ["פיתוח", "תחזוקה", "מערכות מידע"];
export const YECHIDA_MEVATSAAT_OPTIONS = ["דיגיטל", "דבאופס", "תשתיות", "דיבי", "מערכות ליבה"];

export default { MASLOL, MASLOL_OPTIONS, STATUS_PAAR, STATUS_PAAR_OPTIONS, AGAF_OPTIONS, YECHIDA_MEVATSAAT_OPTIONS };