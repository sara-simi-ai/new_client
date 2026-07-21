// NEW FILE — getOptionKey/getOptionLabel extracted from 3 identical copies in
// Dropdown.js, FilterBar.js, ProjectForm.js. getOptionLabelByValue extracted
// from the old ProjectMetadata.js / dead ProjectCommon.js (different signature, same idea).
// Normalizes a single option that may be either a plain value or an { value, label } object.
export const getOptionKey = (option) => (typeof option === "object" ? option.value : option);
export const getOptionLabel = (option) => (typeof option === "object" ? option.label : option);

// Looks up the label for a given value inside a { value, label }[] options list.
export const getOptionLabelByValue = (options, value, fallback = "לא ידוע") =>
  options.find((item) => item.value === value)?.label || fallback;
