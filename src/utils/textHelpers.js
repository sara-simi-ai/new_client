export const isRealText = (value) => {
  const normalized = String(value || "").trim().toLowerCase();
  return normalized !== "" && normalized !== "string";
};
