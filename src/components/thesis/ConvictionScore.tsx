import { cn } from "@/lib/utils";

function scoreColor(score: number): string {
  if (score >= 90) return "#ADD800";
  if (score >= 75) return "#22C55E";
  if (score >= 55) return "#F59E0B";
  return "#A1A1AA";
}

export function ConvictionRing({
  score,
  label,
  size = 132,
}: {
  score: number;
  label?: string;
  size?: number;
}) {
  const stroke = 9;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const color = scoreColor(score);
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.16,1,0.3,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold tabular-nums" style={{ color }}>
          {score}
        </span>
        {label && (
          <span className="mt-0.5 max-w-[80%] text-center text-[10px] font-medium uppercase tracking-wide text-content-secondary">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}

export function ConvictionPill({
  score,
  className,
}: {
  score: number;
  className?: string;
}) {
  const color = scoreColor(score);
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative h-1.5 w-16 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-sm font-semibold tabular-nums" style={{ color }}>
        {score}%
      </span>
    </div>
  );
}
