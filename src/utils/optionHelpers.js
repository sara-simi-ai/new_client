// NEW FILE — getOptionKey/getOptionLabel extracted from 3 identical copies in
// Dropdown.js, FilterBar.js, ProjectForm.js. getOptionLabelByValue extracted
// from the old ProjectMetadata.js / dead ProjectCommon.js (different signature, same idea).
// Normalizes a single option that may be either a plain value or an { value, label } object.
export const getOptionKey = (option) => (typeof option === "object" ? option.value : option);
export const getOptionLabel = (option) => (typeof option === "object" ? option.label : option);

export const isAllOption = (option) => getOptionKey(option) === "__all__";

export const withoutAllOption = (options = []) =>
  (Array.isArray(options) ? options : []).filter((option) => !isAllOption(option));

export const isAllOptionsSelected = (selectedOptions = [], options = []) => {
  const realOptions = withoutAllOption(options);
  if (!Array.isArray(selectedOptions) || selectedOptions.length === 0 || realOptions.length === 0) {
    return false;
  }

  return realOptions.every((item) =>
    selectedOptions.some((selected) => getOptionKey(selected) === getOptionKey(item))
  );
};

// Looks up the label for a given value inside a { value, label }[] options list.
export const getOptionLabelByValue = (options, value, fallback = "לא ידוע") =>
  options.find((item) => item.value === value)?.label || fallback;
