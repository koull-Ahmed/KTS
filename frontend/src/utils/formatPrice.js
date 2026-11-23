export function formatAlgerianPrice(price) {
  const amount = Number(price);

  if (!Number.isFinite(amount)) return "Price unavailable";

  return `${new Intl.NumberFormat("fr-DZ", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)} DA`;
}
