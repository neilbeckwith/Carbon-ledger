import { useEffect, useState } from "react";
import { KEELING } from "@/lib/budget";

type ChartModule = typeof import("recharts");

export function KeelingChart() {
  const [charts, setCharts] = useState<ChartModule | null>(null);

  useEffect(() => {
    let live = true;
    void import("recharts").then((mod) => {
      if (live) setCharts(mod);
    });
    return () => {
      live = false;
    };
  }, []);

  if (!charts) return <div className="chart-fallback" aria-hidden="true" />;

  const { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } = charts;

  return (
    <div className="chart-box">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={KEELING} margin={{ top: 12, right: 8, left: 0, bottom: 0 }}>
          <XAxis
            dataKey="year"
            tick={{ fill: "var(--color-mist)", fontSize: 12 }}
            axisLine={{ stroke: "var(--color-line)" }}
            tickLine={false}
            interval={4}
          />
          <YAxis
            domain={[300, 440]}
            tick={{ fill: "var(--color-mist)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip
            contentStyle={{
              background: "var(--color-panel)",
              border: "1px solid var(--color-line)",
              borderRadius: 8,
              color: "var(--color-bone)",
            }}
            formatter={(value) => [`${value} ppm`, "Annual mean"]}
          />
          <Area
            type="monotone"
            dataKey="ppm"
            stroke="var(--color-ember)"
            strokeWidth={1.75}
            fill="var(--color-ember)"
            fillOpacity={0.14}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
