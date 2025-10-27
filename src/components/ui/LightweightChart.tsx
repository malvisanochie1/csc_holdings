// components/LightweightChart.tsx
"use client";
import { useEffect, useRef } from "react";
import { ISeriesApi, createChart } from "lightweight-charts";

export default function LightweightChart({
  data,
}: {
  data: { time: string; value: number }[];
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!ref.current) return;
    const chart = createChart(ref.current, {
      width: 600,
      height: 300,
    });
    const series = chart.addSeries({
      type: "Line",
    });
    series.setData(data);
    // cleanup
    return () => chart.remove();
  }, [data]);
  return <div ref={ref} />;
}
