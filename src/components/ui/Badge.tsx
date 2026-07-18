import { cn } from "@/lib/utils";
import type { BeliefStatus, MarketStatus } from "@/lib/types";

export function Badge({
  children,
  className,
  dot,
}: {
  children: React.ReactNode;
  className?: string;
  dot?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        className
      )}
    >
      {dot && (
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: dot }}
        />
      )}
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: BeliefStatus | MarketStatus }) {
  const map: Record<string, { label: string; cls: string; dot: string }> = {
    open: { label: "Open", cls: "border-primary/25 bg-primary/10 text-primary", dot: "#ADD800" },
    debating: { label: "AI Debating", cls: "border-ai/25 bg-ai/10 text-ai", dot: "#3B82F6" },
    market: { label: "Live Market", cls: "border-bullish/25 bg-bullish/10 text-bullish", dot: "#22C55E" },
    resolved: { label: "Resolved", cls: "border-white/10 bg-white/[0.04] text-content-secondary", dot: "#A1A1AA" },
    closing: { label: "Closing Soon", cls: "border-warning/25 bg-warning/10 text-warning", dot: "#F59E0B" },
  };
  const s = map[status] ?? map.open;
  return (
    <Badge className={s.cls} dot={s.dot}>
      {s.label}
    </Badge>
  );
}
