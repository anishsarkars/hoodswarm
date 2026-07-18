"use client";

import Link from "next/link";
import type { Market } from "@/lib/types";
import { cn, timeUntil } from "@/lib/utils";
import { Zap } from "lucide-react";

export function PulseCard({ market }: { market: Market }) {
  return (
    <Link
      href={`/markets/${market.id}`}
      className="card card-hover group flex items-center gap-4 p-4"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-warning/10">
        <Zap className="h-4 w-4 text-warning" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium group-hover:text-primary">
          {market.question}
        </p>
        <p className="mt-0.5 text-xs text-content-secondary">
          Auto-resolves · {timeUntil(market.closesAt)} left
        </p>
      </div>
      <div className="text-right">
        <p
          className={cn(
            "text-lg font-bold",
            market.yes >= 50 ? "text-bullish" : "text-bearish"
          )}
        >
          {market.yes}%
        </p>
        <p className="text-[11px] text-content-secondary">Believe</p>
      </div>
    </Link>
  );
}
