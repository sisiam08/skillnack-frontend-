"use client";

import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartEmpty,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatValue, type ChartDatum, type SeriesDef, type ValueFormat } from "./chart-types";

type BarChartProps = {
  data: ChartDatum[];
  xKey: string;
  series: SeriesDef[];
  height?: number;
  horizontal?: boolean;
  stacked?: boolean;
  valueFormat?: ValueFormat;
  emptyMessage?: string;
};

const truncate = (value: unknown, max = 18) => {
  const text = String(value ?? "");
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
};

export default function BarChart({
  data,
  xKey,
  series,
  height = 280,
  horizontal = false,
  stacked = false,
  valueFormat,
  emptyMessage,
}: BarChartProps) {
  const config: ChartConfig = Object.fromEntries(
    series.map((item) => [item.key, { label: item.label, color: item.color }]),
  );

  const hasData = Array.isArray(data) && data.length > 0;
  const hasValue =
    hasData && data.some((row) => series.some((s) => Number(row[s.key]) !== 0));

  if (!hasValue) {
    return (
      <div style={{ height }}>
        <ChartEmpty message={emptyMessage} />
      </div>
    );
  }

  return (
    <ChartContainer
      config={config}
      className="w-full"
      style={{ height, aspectRatio: "auto" }}
    >
      <RechartsBarChart
        data={data}
        layout={horizontal ? "vertical" : "horizontal"}
        margin={{ left: 4, right: 12, top: 8, bottom: 4 }}
      >
        <CartesianGrid vertical={horizontal} horizontal={!horizontal} />
        {horizontal ? (
          <>
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatValue(Number(value), valueFormat)}
            />
            <YAxis
              type="category"
              dataKey={xKey}
              tickLine={false}
              axisLine={false}
              width={120}
              tickFormatter={(value) => truncate(value)}
            />
          </>
        ) : (
          <>
            <XAxis
              dataKey={xKey}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={8}
              tickFormatter={(value) => truncate(value, 12)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={48}
              tickFormatter={(value) => formatValue(Number(value), valueFormat)}
            />
          </>
        )}
        <ChartTooltip
          cursor={{ fill: "var(--muted)" }}
          content={
            <ChartTooltipContent
              valueFormatter={(value) => formatValue(value, valueFormat)}
            />
          }
        />
        {series.map((item) => (
          <Bar
            key={item.key}
            dataKey={item.key}
            fill={item.color}
            radius={4}
            stackId={stacked ? "stack" : undefined}
          />
        ))}
      </RechartsBarChart>
    </ChartContainer>
  );
}
