export const MASLOL = {
  KIYUM: { value: "KIYUM", label: "קיום" },
  HITAZMUT: { value: "HITAZMUT", label: "התעצמות" },
};

export const MASLOL_OPTIONS = Object.values(MASLOL); 

export const STATUS_PAAR = {
  TAKIN: "takin",
  ODEF: "odef",
  GERAON: "geraon",
};

export const STATUS_PEARIM_MAP = {
  "אין פער": STATUS_PAAR.TAKIN,
  "פער בפלוס": STATUS_PAAR.ODEF,
  "פער במינוס": STATUS_PAAR.GERAON,
};

export const AGAF_OPTIONS = ["פיתוח", "תחזוקה", "מערכות מידע"];
export const YECHIDA_MEVATSAAT_OPTIONS = ["דיגיטל", "דבאופס", "תשתיות", "דיבי", "מערכות ליבה"];

export default { MASLOL, MASLOL_OPTIONS, STATUS_PAAR, STATUS_PEARIM_MAP, AGAF_OPTIONS, YECHIDA_MEVATSAAT_OPTIONS };