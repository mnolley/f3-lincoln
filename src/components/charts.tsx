"use client";

import type { LeaderboardRow, MonthBucket } from "@/lib/stats";

const RED = "#dc2626";
const MUTED = "#9ca3af";
const GRID = "#374151";

type LineChartProps = {
  data: MonthBucket[];
  /** Accessible title */
  title?: string;
};

/** Simple SVG line chart — monthly totals over time. */
export function MonthlyLineChart({ data, title = "Monthly totals" }: LineChartProps) {
  if (data.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-ink-dim">No monthly data to chart.</p>
    );
  }

  const width = 640;
  const height = 260;
  const padL = 40;
  const padR = 16;
  const padT = 20;
  const padB = 48;
  const innerW = width - padL - padR;
  const innerH = height - padT - padB;
  const maxY = Math.max(1, ...data.map((d) => d.count));
  const n = data.length;

  const xAt = (i: number) =>
    padL + (n === 1 ? innerW / 2 : (i / (n - 1)) * innerW);
  const yAt = (v: number) => padT + innerH - (v / maxY) * innerH;

  const points = data.map((d, i) => `${xAt(i)},${yAt(d.count)}`).join(" ");
  const areaPoints = [
    `${xAt(0)},${padT + innerH}`,
    ...data.map((d, i) => `${xAt(i)},${yAt(d.count)}`),
    `${xAt(n - 1)},${padT + innerH}`,
  ].join(" ");

  // Y ticks
  const tickCount = Math.min(5, maxY);
  const yTicks: number[] = [];
  for (let i = 0; i <= tickCount; i++) {
    yTicks.push(Math.round((maxY * i) / tickCount));
  }
  const uniqueY = [...new Set(yTicks)];

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full min-w-[280px]"
        role="img"
        aria-label={title}
      >
        <title>{title}</title>
        {uniqueY.map((v) => (
          <g key={v}>
            <line
              x1={padL}
              x2={width - padR}
              y1={yAt(v)}
              y2={yAt(v)}
              stroke={GRID}
              strokeDasharray="3 4"
              strokeWidth={1}
            />
            <text
              x={padL - 8}
              y={yAt(v) + 4}
              textAnchor="end"
              fill={MUTED}
              fontSize={11}
              fontFamily="system-ui, sans-serif"
            >
              {v}
            </text>
          </g>
        ))}

        <polygon points={areaPoints} fill={RED} opacity={0.12} />
        <polyline
          points={points}
          fill="none"
          stroke={RED}
          strokeWidth={2.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {data.map((d, i) => (
          <g key={d.key}>
            <circle cx={xAt(i)} cy={yAt(d.count)} r={4} fill={RED} />
            <text
              x={xAt(i)}
              y={yAt(d.count) - 10}
              textAnchor="middle"
              fill="#f9fafb"
              fontSize={11}
              fontWeight={700}
              fontFamily="system-ui, sans-serif"
            >
              {d.count}
            </text>
            <text
              x={xAt(i)}
              y={height - 12}
              textAnchor="middle"
              fill={MUTED}
              fontSize={10}
              fontFamily="system-ui, sans-serif"
            >
              {d.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

type BarChartProps = {
  rows: LeaderboardRow[];
  title?: string;
  /** Max bars to show (already sorted high → low) */
  limit?: number;
  valueLabel?: string;
};

/** Horizontal bar chart — highest count at top. */
export function LeaderboardBarChart({
  rows,
  title = "Leaderboard",
  limit = 15,
  valueLabel = "count",
}: BarChartProps) {
  const data = rows.slice(0, limit);
  if (data.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-ink-dim">No data to chart.</p>
    );
  }

  const max = Math.max(1, ...data.map((r) => r.count));
  const rowH = 28;
  const padL = 110;
  const padR = 40;
  const padT = 8;
  const padB = 8;
  const barMaxW = 400;
  const width = padL + barMaxW + padR;
  const height = padT + data.length * rowH + padB;

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full min-w-[300px]"
        role="img"
        aria-label={title}
      >
        <title>{title}</title>
        {data.map((row, i) => {
          const y = padT + i * rowH;
          const barW = (row.count / max) * barMaxW;
          return (
            <g key={row.name}>
              <text
                x={padL - 10}
                y={y + 16}
                textAnchor="end"
                fill="#e5e7eb"
                fontSize={12}
                fontFamily="system-ui, sans-serif"
              >
                {row.name.length > 14 ? `${row.name.slice(0, 13)}…` : row.name}
              </text>
              <rect
                x={padL}
                y={y + 4}
                width={Math.max(barW, 2)}
                height={18}
                rx={3}
                fill={RED}
                opacity={0.85 - i * 0.03}
              />
              <text
                x={padL + barW + 6}
                y={y + 16}
                fill={MUTED}
                fontSize={11}
                fontWeight={700}
                fontFamily="system-ui, sans-serif"
              >
                {row.count}
              </text>
            </g>
          );
        })}
        <text
          x={padL}
          y={height - 2}
          fill={MUTED}
          fontSize={9}
          fontFamily="system-ui, sans-serif"
        >
          {valueLabel} (high → low)
        </text>
      </svg>
    </div>
  );
}
