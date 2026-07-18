"use client";

import { useState } from "react";
import Link from "next/link";
import { users } from "@/lib/data";
import { Avatar } from "@/components/ui/Avatar";
import { cn, formatPoints, formatNumber, ratingColor } from "@/lib/utils";
import { ChevronDown, Trophy } from "lucide-react";

type Metric = "overall" | "accuracy" | "profit" | "research" | "debate";

const METRICS: { id: Metric; label: string }[] = [
  { id: "overall", label: "Conviction Score" },
  { id: "accuracy", label: "Accuracy" },
  { id: "profit", label: "Winnings" },
  { id: "research", label: "Research" },
  { id: "debate", label: "Debate" },
];

export default function LeaderboardPage() {
  const [metric, setMetric] = useState<Metric>("overall");
  const [open, setOpen] = useState(false);

  const sorted = [...users].sort((a, b) => {
    switch (metric) {
      case "accuracy": return b.accuracy - a.accuracy;
      case "profit": return b.totalWinnings - a.totalWinnings;
      case "research": return b.reputation.research - a.reputation.research;
      case "debate": return b.reputation.debate - a.reputation.debate;
      default: return b.reputation.overall - a.reputation.overall;
    }
  });

  return (
    <div className="container-narrow py-10">
      <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
        <Trophy className="h-6 w-6 text-primary" />
        Leaderboard
      </h1>
      <p className="mt-1 text-sm text-content-secondary">
        Track the sharpest minds in the swarm this season.
      </p>
      <span className="mt-3 inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
        Jun 30, 2026 – Jul 31, 2026 (UTC)
      </span>

      <div className="mt-6 flex flex-wrap gap-2">
        {METRICS.map((m) => (
          <button
            key={m.id}
            onClick={() => setMetric(m.id)}
            className={cn("chip", metric === m.id && "chip-active")}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-col">
        {sorted.map((u, i) => (
          <Link
            key={u.id}
            href={`/profile/${u.username}`}
            className="list-row items-center hover:bg-white/[0.015]"
          >
            <span
              className={cn(
                "flex w-8 shrink-0 items-center justify-center text-sm font-bold tabular-nums",
                i === 0 ? "text-primary" : "text-content-secondary"
              )}
            >
              #{i + 1}
            </span>
            <Avatar src={u.avatar} alt={u.name} size={44} ring={i === 0} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate font-semibold">{u.name}</span>
                <span className={cn("rounded-full border border-current/20 px-1.5 py-0.5 text-[10px] font-bold", ratingColor(u.rating))}>
                  {u.rating}
                </span>
                {i < 3 && (
                  <span className="rounded-full border border-primary/20 bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                    TOP {i + 1}
                  </span>
                )}
              </div>
              <p className="mt-0.5 truncate text-xs text-content-secondary">
                {u.reputation.overall} swarm score · {u.accuracy}% accuracy · {u.winRate}% win rate
              </p>
              <p className="truncate text-xs text-content-secondary/70">
                +{formatPoints(u.totalWinnings, true)} won · {formatNumber(u.followers, true)} followers · {u.marketsCreated} markets
              </p>
            </div>
            <div className="hidden shrink-0 text-right sm:block">
              <p className={cn("text-lg font-bold tabular-nums", ratingColor(u.rating))}>
                {metricValue(u, metric)}
              </p>
              <p className="text-[11px] text-content-secondary">
                {METRICS.find((m) => m.id === metric)?.label}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="card mt-6 overflow-hidden">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between px-5 py-4 text-left"
        >
          <span className="text-sm font-semibold">How rankings and reputation work</span>
          <ChevronDown className={cn("h-4 w-4 text-content-secondary transition-transform", open && "rotate-180")} />
        </button>
        {open && (
          <div className="border-t border-border px-5 py-4 text-sm leading-relaxed text-content-secondary">
            Your <span className="text-white">Swarm Rating</span> (AAA–B) blends four
            scores: Research, Debate, Prediction, and Community. Prediction accuracy and
            realized market profit drive most of the ranking, while research depth and
            debate quality reward well-argued, well-sourced beliefs. Rankings reset each
            season.
          </div>
        )}
      </div>
    </div>
  );
}

function metricValue(u: (typeof users)[number], metric: Metric): string {
  switch (metric) {
    case "accuracy": return `${u.accuracy}%`;
    case "profit": return formatPoints(u.totalWinnings, true);
    case "research": return `${u.reputation.research}`;
    case "debate": return `${u.reputation.debate}`;
    default: return `${u.reputation.overall}`;
  }
}
