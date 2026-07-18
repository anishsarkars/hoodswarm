"use client";

import Link from "next/link";
import type { Belief } from "@/lib/types";
import { StatusBadge } from "@/components/ui/Badge";
import { categoryColor, cn, timeAgo } from "@/lib/utils";
import { Lightbulb } from "lucide-react";

export function BeliefListRow({ belief }: { belief: Belief }) {
  const total = belief.votes.believe + belief.votes.cope + belief.votes.neutral || 1;
  const believe = Math.round((belief.votes.believe / total) * 100);
  const cope = Math.round((belief.votes.cope / total) * 100);
  const challenges = belief.comments.filter((c) => c.isChallenge).length;

  return (
    <Link href={`/beliefs/${belief.id}`} className="list-row group items-start hover:bg-white/[0.015]">
      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-white/[0.02]">
        <Lightbulb className="h-4 w-4 text-primary" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-balance font-semibold leading-snug transition-colors group-hover:text-primary">
            {belief.title}
          </h3>
          <span className="mt-0.5 shrink-0 text-xs text-content-secondary/70">
            {timeAgo(belief.createdAt)}
          </span>
        </div>

        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-content-secondary">
          <span className={cn("font-medium", categoryColor(belief.category))}>
            {belief.category}
          </span>
          <Dot />
          <span>{challenges} {challenges === 1 ? "challenge" : "challenges"}</span>
          <Dot />
          <span className="text-bullish">Believe {believe}%</span>
          <Dot />
          <span className="text-bearish">Cope {cope}%</span>
          <Dot />
          <span className="text-primary">{belief.conviction} conviction</span>
        </div>

        <div className="mt-2.5 flex items-center gap-3">
          <div className="flex h-1 max-w-[220px] flex-1 overflow-hidden rounded-full bg-white/[0.05]">
            <div className="bg-bullish/80" style={{ width: `${believe}%` }} />
            <div className="bg-bearish/60" style={{ width: `${cope}%` }} />
          </div>
          <StatusBadge status={belief.status} />
        </div>
      </div>
    </Link>
  );
}

function Dot() {
  return <span className="text-content-secondary/40">·</span>;
}
