"use client";

import { useId } from "react";
import type { PricePoint } from "@/lib/types";

// Clean SVG probability chart (Lightweight-Charts style). Swap for
// TradingView Lightweight Charts by mounting on a ref if desired.
export function ProbabilityChart({
  data,
  height = 220,
  color = "#ADD800",
  showAxis = true,
}: {
  data: PricePoint[];
  height?: number;
  color?: string;
  showAxis?: boolean;
}) {
  const id = useId().replace(/:/g, "");
  const w = 720;
  const h = height;
  const padY = 16;
  const padX = 4;
  const xs = data.map((_, i) => padX + (i / (data.length - 1)) * (w - padX * 2));
  const ys = data.map(
    (p) => padY + (1 - p.yes / 100) * (h - padY * 2)
  );
  const line = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ");
  const area = `${line} L${xs[xs.length - 1].toFixed(1)},${h - padY} L${xs[0].toFixed(1)},${h - padY} Z`;
  const last = data[data.length - 1]?.yes ?? 50;

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full"
        style={{ height }}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={`grad-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.22" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {showAxis &&
          [25, 50, 75].map((g) => {
            const y = padY + (1 - g / 100) * (h - padY * 2);
            return (
              <line
                key={g}
                x1={padX}
                x2={w - padX}
                y1={y}
                y2={y}
                stroke="rgba(255,255,255,0.05)"
                strokeWidth={1}
              />
            );
          })}
        <path d={area} fill={`url(#grad-${id})`} />
        <path
          d={line}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <circle
          cx={xs[xs.length - 1]}
          cy={ys[ys.length - 1]}
          r={3.5}
          fill={color}
        />
      </svg>
      {showAxis && (
        <div className="mt-1 flex justify-between text-[11px] text-content-secondary/60">
          <span>30d ago</span>
          <span className="font-mono text-content-secondary">Now · {last}%</span>
        </div>
      )}
    </div>
  );
}

export function Sparkline({
  data,
  color = "#ADD800",
  width = 96,
  height = 32,
}: {
  data: PricePoint[];
  color?: string;
  width?: number;
  height?: number;
}) {
  const pts = data.slice(-24);
  const xs = pts.map((_, i) => (i / (pts.length - 1)) * width);
  const ys = pts.map((p) => (1 - p.yes / 100) * height);
  const line = xs
    .map((x, i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${ys[i].toFixed(1)}`)
    .join(" ");
  return (
    <svg width={width} height={height} className="overflow-visible">
      <path d={line} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  );
}
