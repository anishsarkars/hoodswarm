"use client";

import Link from "next/link";
import type { Market } from "@/lib/types";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { ProbabilitySplit } from "@/components/ui/Bars";
import { Sparkline } from "@/components/ui/Chart";
import { categoryColor, cn, formatPoints, formatNumber, timeUntil } from "@/lib/utils";
import { Clock, Droplets, Users } from "lucide-react";

export function MarketCard({ market }: { market: Market }) {
  return (
    <article className="card card-hover group flex animate-fade-up flex-col p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <Badge className={cn("border-border bg-white/[0.03]", categoryColor(market.category))}>
          {market.category}
        </Badge>
        <StatusBadge status={market.status} />
      </div>

      <Link href={`/markets/${market.id}`} className="flex-1">
        <h3 className="text-balance font-semibold leading-snug transition-colors group-hover:text-primary">
          {market.question}
        </h3>
      </Link>

      <div className="mt-4 flex items-center gap-4">
        <div className="flex-1">
          <ProbabilitySplit yes={market.yes} size="sm" />
        </div>
        <Sparkline
          data={market.history}
          color={market.yes >= 50 ? "#22C55E" : "#EF4444"}
        />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-4 text-xs text-content-secondary">
        <span className="flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5" />
          {formatNumber(market.participants, true)}
        </span>
        <span className="flex items-center gap-1.5">
          <Droplets className="h-3.5 w-3.5" />
          {formatPoints(market.pool, true)}
        </span>
        <span className="flex items-center justify-end gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          {timeUntil(market.closesAt)}
        </span>
      </div>

      <div className="mt-4 flex gap-2">
        <Link href={`/markets/${market.id}`} className="btn-bullish h-9 flex-1">
          Believe · {market.yes}¢
        </Link>
        <Link href={`/markets/${market.id}`} className="btn-bearish h-9 flex-1">
          Hood · {100 - market.yes}¢
        </Link>
      </div>
    </article>
  );
}
