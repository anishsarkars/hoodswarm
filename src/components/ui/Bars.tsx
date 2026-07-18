import { cn } from "@/lib/utils";

// Horizontal Believe/Hood probability split bar
export function ProbabilitySplit({
  yes,
  className,
  size = "md",
}: {
  yes: number;
  className?: string;
  size?: "sm" | "md";
}) {
  const no = 100 - yes;
  return (
    <div className={cn("w-full", className)}>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="font-semibold text-bullish">Believe {yes}%</span>
        <span className="font-semibold text-bearish">Hood {no}%</span>
      </div>
      <div
        className={cn(
          "flex w-full overflow-hidden rounded-full bg-white/[0.04]",
          size === "sm" ? "h-1.5" : "h-2.5"
        )}
      >
        <div className="h-full bg-bullish/80" style={{ width: `${yes}%` }} />
        <div className="h-full bg-bearish/70" style={{ width: `${no}%` }} />
      </div>
    </div>
  );
}

export function ConsensusBar({
  believe,
  className,
}: {
  believe: number;
  className?: string;
}) {
  const cope = 100 - believe;
  return (
    <div className={cn("w-full", className)}>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-semibold text-bullish">Believe {believe}%</span>
        <span className="font-semibold text-bearish">Hood {cope}%</span>
      </div>
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-white/[0.04]">
        <div className="h-full bg-bullish" style={{ width: `${believe}%` }} />
        <div className="h-full bg-bearish" style={{ width: `${cope}%` }} />
      </div>
    </div>
  );
}

export function MeterBar({
  value,
  label,
  color = "#ADD800",
}: {
  value: number;
  label?: string;
  color?: string;
}) {
  return (
    <div>
      {label && (
        <div className="mb-1.5 flex items-center justify-between text-sm">
          <span className="text-content-secondary">{label}</span>
          <span className="font-mono font-medium">{value}</span>
        </div>
      )}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.05]">
        <div
          className="h-full rounded-full"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
