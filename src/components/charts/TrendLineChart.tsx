"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartEmpty,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatValue, type ChartDatum, type SeriesDef, type ValueFormat } from "./chart-types";

type TrendLineChartProps = {
  data: ChartDatum[];
  xKey: string;
  series: SeriesDef[];
  height?: number;
  valueFormat?: ValueFormat;
  emptyMessage?: string;
};

export default function TrendLineChart({
  data,
  xKey,
  series,
  height = 280,
  valueFormat,
  emptyMessage,
}: TrendLineChartProps) {
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
      <LineChart data={data} margin={{ left: 4, right: 12, top: 8, bottom: 4 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={xKey}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={16}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={48}
          tickFormatter={(value) => formatValue(Number(value), valueFormat)}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              valueFormatter={(value) => formatValue(value, valueFormat)}
            />
          }
        />
        {series.map((item) => (
          <Line
            key={item.key}
            type="monotone"
            dataKey={item.key}
            stroke={item.color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        ))}
      </LineChart>
    </ChartContainer>
  );
}
