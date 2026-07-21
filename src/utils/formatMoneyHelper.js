export function formatMoney(value) {
  const n = Number(value || 0);
  return n.toLocaleString("he-IL");
}

export function formatNumberWithSeparators(value) {
  const n = Number(value || 0);
  return n.toLocaleString("he-IL");
}

export function parseFormattedNumber(value) {
  if (value === "" || value === null || value === undefined) {
    return 0;
  }
  
  // Convert string to number, removing any formatting characters
  // Hebrew locale uses comma as thousands separator and period as decimal
  const str = String(value).trim();
  
  // Remove thousands separators (commas)
  const cleaned = str.replace(/,/g, "");
  
  // Parse to number
  const num = Number(cleaned);
  
  return isNaN(num) ? 0 : num;
}

export default formatMoney;
