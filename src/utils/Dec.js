
export const MASLOL = {
  KIYUM: { value: "KIYUM", label: "קיום" },
  HITAZMUT: { value: "HITAZMUT", label: "התעצמות" },
};

export const MASLOL_OPTIONS = Object.values(MASLOL);

export const GAP_STATUS = {
  TAKIN: { value: "takin", label: "אין פער", className: 'gap--neutral' },
  ODEF: { value: "odef", label: "פער בפלוס", className: 'gap--surplus' },
  GERAON: { value: "geraon", label: "פער במינוס", className: 'gap--over' },
};

export const GAP_STATUS_OPTIONS = [
  { value: "__all__", label: "כל הפערים" },
  ...Object.values(GAP_STATUS),
];

export const GAP_STATUS_BY_VALUE = Object.fromEntries(
  Object.values(GAP_STATUS).map((status) => [status.value, status])
);

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

// Management Home texts
export const MANAGEMENT_TITLE = 'מסכי ניהול';
export const MANAGEMENT_SUBTITLE = 'פלטפורמה מרכזית לניהול מלא של אגפים, צוותות ופרויקטים  ';

// Departments/Agaff Management
export const DEPARTMENTS_TITLE = 'ניהול אגפים';
export const DEPARTMENTS_SUBTITLE = 'הוסף, ערוך או מחק אגפים במערכת.';
export const DEPARTMENTS_SEARCH_PLACEHOLDER = 'חיפוש לפי שם אגף';
export const DEPARTMENTS_ADD_BUTTON = 'הוספת אגף +';
export const DEPARTMENTS_ADD_MODAL_TITLE = 'הוספת אגף חדש';
export const DEPARTMENTS_ADD_MODAL_DESC = 'הכנס שם לאגף החדש';
export const DEPARTMENTS_EDIT_MODAL_TITLE = 'עריכת אגף';
export const DEPARTMENTS_EDIT_MODAL_DESC = 'ערוך את שם האגף';
export const DEPARTMENTS_DELETE_MODAL_TITLE = 'מחיקת אגף';
export const DEPARTMENTS_ITEM_PLACEHOLDER = 'שם אגף';
export const DEPARTMENTS_CARD_DESC = 'תחזוקה וארגון של אגפי הפעילות בחברה – הוסף, ערוך או מחק אגפים בקלות';

// Teams/Tsevet Management
export const TEAMS_TITLE = 'ניהול צוותות';
export const TEAMS_SUBTITLE = 'הוסף, ערוך או מחק צוותות במערכת.';
export const TEAMS_SEARCH_PLACEHOLDER = 'חיפוש לפי שם צוות';
export const TEAMS_ADD_BUTTON = 'הוספת צוות +';
export const TEAMS_ADD_MODAL_TITLE = 'הוספת צוות חדש';
export const TEAMS_ADD_MODAL_DESC = 'הכנס שם לצוות החדש';
export const TEAMS_EDIT_MODAL_TITLE = 'עריכת צוות';
export const TEAMS_EDIT_MODAL_DESC = 'ערוך את שם הצוות';
export const TEAMS_DELETE_MODAL_TITLE = 'מחיקת צוות';
export const TEAMS_ITEM_PLACEHOLDER = 'שם צוות';
export const TEAMS_CARD_DESC = 'הנהלת צוותים וקבוצות עבודה – נהל את מבנה הצוותים והקשרים בתוך כל אגף';
export const DUPLICATE_NAME_ERROR = 'שם עם השם הזה כבר קיים';
export const DEPARTMENTS_DELETE_CONFIRM_TEXT = 'האם אתה בטוח שברצונך למחוק את האגף';
export const TEAMS_DELETE_CONFIRM_TEXT = 'האם אתה בטוח שברצונך למחוק את הצוות';

// Projects Management
export const PROJECTS_TITLE = 'ניהול פרויקטים';
export const PROJECTS_SUBTITLE = 'הוסף, ערוך או מחק פרויקטים במערכת.';
export const PROJECTS_SEARCH_PLACEHOLDER = 'חיפוש לפי שם פרויקט';
export const PROJECTS_ADD_BUTTON = 'הוספת פרויקט +';
export const PROJECTS_ADD_MODAL_TITLE = 'הוספת פרויקט חדש';
export const PROJECTS_ADD_MODAL_DESC = 'הכנס שם לפרויקט החדש';
export const PROJECTS_EDIT_MODAL_TITLE = 'עריכת פרויקט';
export const PROJECTS_EDIT_MODAL_DESC = 'ערוך את שם הפרויקט';
export const PROJECTS_DELETE_MODAL_TITLE = 'מחיקת פרויקט';
export const PROJECTS_ITEM_PLACEHOLDER = 'שם פרויקט';
export const PROJECTS_DELETE_CONFIRM_TEXT = 'האם אתה בטוח שברצונך למחוק את הפרויקט';
export const PROJECTS_EMPTY_STATE = 'לא נמצאו פרויקטים';
export const PROJECTS_CARD_DESC = 'פיקוח עדכני על פרויקטים ותקדמותם – עקוב אחרי מעמד וביצועי כל פרויקט';

// Management UI Common
export const MANAGEMENT_MANAGE_BUTTON = 'לניהול';
export const MANAGEMENT_EMPTY_TEXT = 'לא נמצאו תוצאות';
export const MANAGEMENT_ADD_ACTION = 'הוספה';
export const MANAGEMENT_SAVE_ACTION = 'שמור';
export const MANAGEMENT_DELETE_ACTION = 'מחק';
export const MANAGEMENT_CANCEL_ACTION = 'ביטול';
export const MANAGEMENT_TOGGLE_INACTIVE = 'העבר ל"לא פעיל"';
export const MANAGEMENT_TOGGLE_ACTIVE = 'העבר ל"פעיל"';
export const MANAGEMENT_EDIT_ACTION = 'ערוך';

export default { 
  MASLOL, 
  MASLOL_OPTIONS, 
  GAP_STATUS, 
  GAP_STATUS_OPTIONS, 
  GAP_STATUS_BY_VALUE, 
  HR_BUDGET_LABEL, 
  PROCUREMENT_BUDGET_LABEL, 
  PLANNED_HR_LABEL, 
  GAPS_LABEL, 
  TOTAL_BUDGET_LABEL, 
  TOTAL_GAPS_LABEL, 
  PROJECT_NAME_LABEL, 
  AGAF_LABEL, 
  TSEVET_LABEL, 
  CONTINUATION_LABEL, 
  CONTINUATION_TRUE_LABEL, 
  CONTINUATION_FALSE_LABEL, 
  MASLOL_LABEL,
  MANAGEMENT_TITLE,
  MANAGEMENT_SUBTITLE,
  DUPLICATE_NAME_ERROR,
  DEPARTMENTS_TITLE,
  DEPARTMENTS_SUBTITLE,
  DEPARTMENTS_SEARCH_PLACEHOLDER,
  DEPARTMENTS_ADD_BUTTON,
  DEPARTMENTS_ADD_MODAL_TITLE,
  DEPARTMENTS_ADD_MODAL_DESC,
  DEPARTMENTS_EDIT_MODAL_TITLE,
  DEPARTMENTS_EDIT_MODAL_DESC,
  DEPARTMENTS_DELETE_MODAL_TITLE,
  DEPARTMENTS_ITEM_PLACEHOLDER,
  DEPARTMENTS_DELETE_CONFIRM_TEXT,
  TEAMS_TITLE,
  TEAMS_SUBTITLE,
  TEAMS_SEARCH_PLACEHOLDER,
  TEAMS_ADD_BUTTON,
  TEAMS_ADD_MODAL_TITLE,
  TEAMS_ADD_MODAL_DESC,
  TEAMS_EDIT_MODAL_TITLE,
  TEAMS_EDIT_MODAL_DESC,
  TEAMS_DELETE_MODAL_TITLE,
  TEAMS_ITEM_PLACEHOLDER,
  TEAMS_DELETE_CONFIRM_TEXT,
  PROJECTS_TITLE,
  PROJECTS_SUBTITLE,
  PROJECTS_SEARCH_PLACEHOLDER,
  PROJECTS_ADD_BUTTON,
  PROJECTS_ADD_MODAL_TITLE,
  PROJECTS_ADD_MODAL_DESC,
  PROJECTS_EDIT_MODAL_TITLE,
  PROJECTS_EDIT_MODAL_DESC,
  PROJECTS_DELETE_MODAL_TITLE,
  PROJECTS_ITEM_PLACEHOLDER,
  PROJECTS_DELETE_CONFIRM_TEXT,
  PROJECTS_EMPTY_STATE,
  PROJECTS_CARD_DESC,
  MANAGEMENT_MANAGE_BUTTON,
  MANAGEMENT_EMPTY_TEXT,
  MANAGEMENT_ADD_ACTION,
  MANAGEMENT_SAVE_ACTION,
  MANAGEMENT_DELETE_ACTION,
  MANAGEMENT_CANCEL_ACTION,
  MANAGEMENT_TOGGLE_INACTIVE,
  MANAGEMENT_TOGGLE_ACTIVE,
  MANAGEMENT_EDIT_ACTION,
};
