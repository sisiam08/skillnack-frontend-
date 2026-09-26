export type SeriesDef = {
  key: string;
  label: string;
  color: string;
};

export type ChartDatum = Record<string, string | number>;

/** Serializable formatter selector — avoids passing functions across the RSC boundary. */
export type ValueFormat = "number" | "taka" | "decimal1" | "percent";

export const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const;

export const CHART_BRAND = "var(--brand)";

export const formatTaka = (value: number) =>
  `৳${Number(value).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

export const formatValue = (
  value: number,
  format?: ValueFormat,
): string => {
  const numeric = Number(value);
  switch (format) {
    case "taka":
      return formatTaka(numeric);
    case "decimal1":
      return numeric.toFixed(1);
    case "percent":
      return `${numeric}%`;
    case "number":
    default:
      return numeric.toLocaleString("en-US");
  }
};
