"use client";

import Link from "next/link";
import type { Market } from "@/lib/types";
import { StatusBadge } from "@/components/ui/Badge";
import { Sparkline } from "@/components/ui/Chart";
import { categoryColor, cn, formatPoints, formatNumber, timeUntil } from "@/lib/utils";

export function MarketListRow({ market }: { market: Market }) {
  const color = market.yes >= 50 ? "#22C55E" : "#EF4444";
  return (
    <Link href={`/markets/${market.id}`} className="list-row group items-center hover:bg-white/[0.015]">
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-balance font-semibold leading-snug transition-colors group-hover:text-primary">
            {market.question}
          </h3>
          <StatusBadge status={market.status} />
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-content-secondary">
          <span className={cn("font-medium", categoryColor(market.category))}>{market.category}</span>
          <span className="text-content-secondary/40">·</span>
          <span>{formatNumber(market.participants, true)} traders</span>
          <span className="text-content-secondary/40">·</span>
          <span>{formatPoints(market.pool, true)} pool</span>
          <span className="text-content-secondary/40">·</span>
          <span>{timeUntil(market.closesAt)} left</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Sparkline data={market.history} color={color} width={64} height={28} />
        <div className="w-16 text-right">
          <p className="text-lg font-bold tabular-nums" style={{ color }}>
            {market.yes}%
          </p>
          <p className="text-[11px] text-content-secondary">Believe</p>
        </div>
      </div>
    </Link>
  );
}
