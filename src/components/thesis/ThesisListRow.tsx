"use client";

import Link from "next/link";
import type { Belief } from "@/lib/types";
import { timeAgo } from "@/lib/utils";

export function BeliefListRow({ belief }: { belief: Belief }) {
  const total = belief.votes.believe + belief.votes.cope + belief.votes.neutral || 1;
  const believe = Math.round((belief.votes.believe / total) * 100);
  const hood = Math.round((belief.votes.cope / total) * 100);
  const challenges = belief.comments.filter((c) => c.isChallenge).length;

  return (
    <Link
      href={`/beliefs/${belief.id}`}
      className="group block border-b border-border py-4 transition-colors last:border-0 hover:bg-white/[0.015]"
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-balance font-semibold leading-snug transition-colors group-hover:text-primary">
          {belief.title}
        </h3>
        <span className="mt-0.5 shrink-0 text-xs text-content-secondary/70">
          {timeAgo(belief.createdAt)}
        </span>
      </div>

      <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-content-secondary">
        <span>
          {challenges} {challenges === 1 ? "challenge" : "challenges"}
        </span>
        <Dot />
        <span>Believe {believe}%</span>
        <Dot />
        <span>Hood {hood}%</span>
      </div>
    </Link>
  );
}

function Dot() {
  return <span className="text-content-secondary/40">·</span>;
}
