"use client";

import Link from "next/link";
import { Bot, MessageSquare, Users } from "lucide-react";
import type { Belief } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { ConvictionPill } from "./ConvictionScore";
import { categoryColor, cn, timeAgo } from "@/lib/utils";

export function BeliefCard({ belief }: { belief: Belief }) {
  const totalVotes = belief.votes.believe + belief.votes.cope + belief.votes.neutral;

  return (
    <article className="card card-hover group animate-fade-up p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Avatar src={belief.author.avatar} alt={belief.author.name} size={28} />
          <div className="flex items-center gap-1.5 text-sm">
            <Link
              href={`/profile/${belief.author.username}`}
              className="font-medium hover:underline"
            >
              {belief.author.name}
            </Link>
            <span className="text-content-secondary/50">·</span>
            <span className="text-content-secondary">{timeAgo(belief.createdAt)}</span>
          </div>
        </div>
        <StatusBadge status={belief.status} />
      </div>

      <Link href={`/beliefs/${belief.id}`}>
        <h3 className="text-balance text-lg font-semibold leading-snug transition-colors group-hover:text-primary">
          {belief.title}
        </h3>
      </Link>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Badge className={cn("border-border bg-white/[0.03]", categoryColor(belief.category))}>
          {belief.category}
        </Badge>
        <span className="text-xs text-content-secondary">{belief.timeHorizon}</span>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <div className="flex items-center gap-4 text-xs text-content-secondary">
          <span className="flex items-center gap-1.5">
            <Bot className="h-3.5 w-3.5 text-ai" />
            {belief.debate.agents.length} agents
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            {totalVotes} votes
          </span>
          <span className="flex items-center gap-1.5">
            <MessageSquare className="h-3.5 w-3.5" />
            {belief.comments.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden text-[11px] uppercase tracking-wide text-content-secondary/70 sm:block">
            Conviction
          </span>
          <ConvictionPill score={belief.conviction} />
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Link href={`/beliefs/${belief.id}`} className="btn-secondary h-9 flex-1">
          View Debate
        </Link>
        {belief.marketId ? (
          <Link href={`/markets/${belief.marketId}`} className="btn-primary h-9 flex-1">
            Trade Market
          </Link>
        ) : (
          <Link
            href={`/beliefs/${belief.id}`}
            className="btn-secondary h-9 flex-1 opacity-60"
          >
            {belief.status === "debating" ? "Debating…" : "Building Conviction"}
          </Link>
        )}
      </div>
    </article>
  );
}
