export const formatCurrency = (value: number, opts: { signed?: boolean } = {}) => {
  const sign = opts.signed && value > 0 ? "+" : "";
  const negative = value < 0;
  const abs = Math.abs(value);
  const str = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(abs);
  return negative ? `-${str}` : `${sign}${str}`;
};

export const formatCurrencyPrecise = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

export const formatPercent = (value: number) =>
  `${value > 0 ? "" : ""}${value.toFixed(1)}%`;

export const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-US").format(value);
