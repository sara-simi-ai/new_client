export function formatMoney(value) {
  const n = Number(value || 0);
  return n.toLocaleString("he-IL");
}

export default formatMoney;
