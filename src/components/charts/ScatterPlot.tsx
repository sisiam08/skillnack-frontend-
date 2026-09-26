"use client";

import { CartesianGrid, Scatter, ScatterChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartEmpty,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart";
import { CHART_BRAND, formatValue, type ValueFormat } from "./chart-types";

type ScatterPoint = {
  x: number;
  y: number;
  label?: string;
};

type ScatterPlotProps = {
  data: ScatterPoint[];
  xLabel: string;
  yLabel: string;
  height?: number;
  xFormat?: ValueFormat;
  yFormat?: ValueFormat;
  emptyMessage?: string;
};

export default function ScatterPlot({
  data,
  xLabel,
  yLabel,
  height = 300,
  xFormat,
  yFormat,
  emptyMessage,
}: ScatterPlotProps) {
  const hasData = Array.isArray(data) && data.length > 0;

  if (!hasData) {
    return (
      <div style={{ height }}>
        <ChartEmpty message={emptyMessage} />
      </div>
    );
  }

  const config: ChartConfig = {
    x: { label: xLabel, color: CHART_BRAND },
    y: { label: yLabel, color: CHART_BRAND },
  };

  return (
    <ChartContainer
      config={config}
      className="w-full"
      style={{ height, aspectRatio: "auto" }}
    >
      <ScatterChart margin={{ left: 4, right: 12, top: 8, bottom: 16 }}>
        <CartesianGrid />
        <XAxis
          type="number"
          dataKey="x"
          name={xLabel}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => formatValue(Number(value), xFormat)}
        />
        <YAxis
          type="number"
          dataKey="y"
          name={yLabel}
          tickLine={false}
          axisLine={false}
          width={44}
          tickFormatter={(value) => formatValue(Number(value), yFormat)}
        />
        <ChartTooltip
          cursor={{ strokeDasharray: "3 3" }}
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const point = payload[0].payload as ScatterPoint;
            return (
              <div className="grid gap-1.5 rounded-lg border border-border/60 bg-background px-2.5 py-1.5 text-xs shadow-xl">
                {point.label ? (
                  <div className="font-medium text-foreground">
                    {point.label}
                  </div>
                ) : null}
                <div className="text-muted-foreground">
                  {xLabel}:{" "}
                  <span className="font-mono text-foreground">
                    {formatValue(point.x, xFormat)}
                  </span>
                </div>
                <div className="text-muted-foreground">
                  {yLabel}:{" "}
                  <span className="font-mono text-foreground">
                    {formatValue(point.y, yFormat)}
                  </span>
                </div>
              </div>
            );
          }}
        />
        <Scatter data={data} fill={CHART_BRAND} fillOpacity={0.7} />
      </ScatterChart>
    </ChartContainer>
  );
}
