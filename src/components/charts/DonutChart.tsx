"use client";

import { Cell, Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartEmpty,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { CHART_COLORS, formatValue, type ChartDatum, type ValueFormat } from "./chart-types";

type DonutChartProps = {
  data: (ChartDatum & { fill?: string })[];
  nameKey: string;
  valueKey: string;
  colors?: readonly string[];
  height?: number;
  valueFormat?: ValueFormat;
  centerLabel?: string;
  centerValue?: string;
  emptyMessage?: string;
};

export default function DonutChart({
  data,
  nameKey,
  valueKey,
  colors = CHART_COLORS,
  height = 260,
  valueFormat,
  centerLabel,
  centerValue,
  emptyMessage,
}: DonutChartProps) {
  const hasData =
    Array.isArray(data) && data.some((row) => Number(row[valueKey]) > 0);

  if (!hasData) {
    return (
      <div style={{ height }}>
        <ChartEmpty message={emptyMessage} />
      </div>
    );
  }

  const config: ChartConfig = Object.fromEntries(
    data.map((row, index) => [
      String(row[nameKey]),
      {
        label: String(row[nameKey]),
        color: colors[index % colors.length],
      },
    ]),
  );

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
      <div className="relative w-full max-w-[240px]" style={{ height }}>
        <ChartContainer
          config={config}
          className="w-full"
          style={{ height, aspectRatio: "auto" }}
        >
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  hideLabel
                  valueFormatter={(value) => formatValue(value, valueFormat)}
                />
              }
            />
            <Pie
              data={data}
              dataKey={valueKey}
              nameKey={nameKey}
              innerRadius="58%"
              outerRadius="88%"
              paddingAngle={2}
              stroke="var(--background)"
              strokeWidth={2}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        {centerValue ? (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="ui-stat-compact">{centerValue}</span>
            {centerLabel ? (
              <span className="text-xs text-muted-foreground">
                {centerLabel}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>

      <ul className="grid w-full max-w-[260px] gap-2">
        {data.map((row, index) => (
          <li
            key={`legend-${String(row[nameKey])}`}
            className="flex items-center justify-between gap-3 text-sm"
          >
            <span className="flex items-center gap-2 text-muted-foreground">
              <span
                className="size-2.5 shrink-0 rounded-[2px]"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              {String(row[nameKey])}
            </span>
            <span className="font-medium tabular-nums">
              {formatValue(Number(row[valueKey]), valueFormat)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
