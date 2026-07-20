export function formatMoney(value) {
  const n = Number(value || 0);
  return n.toLocaleString("he-IL");
}

export function parseMoney(value) {
  const cleaned = String(value || '').replace(/,/g, '').trim();
  return cleaned === '' ? 0 : Number(cleaned);
}

export default formatMoney;
