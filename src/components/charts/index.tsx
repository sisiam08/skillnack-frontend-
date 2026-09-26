"use client";

import dynamic from "next/dynamic";

// Charts are client-only and lazy-loaded (recharts is large), mirroring the
// existing dynamic-import pattern used for the Zego live-class component.
const ChartLoading = () => (
  <div className="h-[280px] w-full animate-pulse rounded-lg bg-muted/40" />
);

export const TrendLineChart = dynamic(() => import("./TrendLineChart"), {
  ssr: false,
  loading: ChartLoading,
});

export const BarChart = dynamic(() => import("./BarChart"), {
  ssr: false,
  loading: ChartLoading,
});

export const DonutChart = dynamic(() => import("./DonutChart"), {
  ssr: false,
  loading: ChartLoading,
});

export const ScatterPlot = dynamic(() => import("./ScatterPlot"), {
  ssr: false,
  loading: ChartLoading,
});
