"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Market } from "@/lib/types";
import { cn, formatNumber } from "@/lib/utils";
import { Zap } from "lucide-react";

function useCountdown(iso: string) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = new Date(iso).getTime() - now;
  if (diff <= 0) return { expired: true, label: "Resolving" };
  const s = Math.floor(diff / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  if (h >= 24) return { expired: false, label: `${Math.floor(h / 24)}d ${h % 24}h` };
  if (h >= 1) return { expired: false, label: `${h}:${pad(m)}:${pad(sec)}` };
  return { expired: false, label: `${pad(m)}:${pad(sec)}` };
}

export function PulseLiveCard({ market }: { market: Market }) {
  const { label, expired } = useCountdown(market.closesAt);
  const yesColor = market.yes >= 50 ? "#22C55E" : "#EF4444";
  const num = market.id.replace(/\D/g, "");

  return (
    <Link
      href={`/markets/${market.id}`}
      className="card card-hover group relative block overflow-hidden p-5 sm:p-6"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-warning/[0.06] blur-3xl" />

      <div className="mb-3 flex items-center gap-2.5 text-xs">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-warning/25 bg-warning/10 px-2.5 py-1 font-semibold uppercase tracking-wide text-warning">
          <span className={cn("h-1.5 w-1.5 rounded-full bg-warning", !expired && "animate-pulse-dot")} />
          Pulse Live
        </span>
        <span className="text-content-secondary">{market.topic}</span>
        <span className="text-content-secondary/50">#{num}</span>
      </div>

      <h3 className="text-balance text-xl font-semibold leading-snug transition-colors group-hover:text-primary sm:text-2xl">
        {market.question}
      </h3>

      <div className="mt-5 flex items-end justify-between">
        <div>
          <p className="section-label mb-1">Believe probability</p>
          <p className="text-4xl font-bold tabular-nums" style={{ color: yesColor }}>
            {market.yes}
            <span className="text-2xl">%</span>
          </p>
        </div>
        <div className="text-right">
          <p className="section-label mb-1">Ends in</p>
          <p className={cn("font-mono text-3xl font-bold tabular-nums", expired ? "text-content-secondary" : "text-white")}>
            {label}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-sm">
          <span className="font-semibold text-bullish">Believe {market.yes}%</span>
          <span className="font-semibold text-bearish">Hood {100 - market.yes}%</span>
        </div>
        <div className="flex h-2 overflow-hidden rounded-full bg-white/[0.05]">
          <div className="bg-bullish/80" style={{ width: `${market.yes}%` }} />
          <div className="bg-bearish/60" style={{ width: `${100 - market.yes}%` }} />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 border-t border-border pt-4 text-xs text-content-secondary">
        <Zap className="h-3.5 w-3.5 text-warning" />
        <span>Open · {market.yes >= 50 ? "Believe" : "Hood"} leading</span>
        <span className="text-content-secondary/40">·</span>
        <span>{formatNumber(market.participants, true)} participants</span>
        <span className="ml-auto hidden sm:inline">Auto-resolves from {market.resolutionSource}</span>
      </div>
    </Link>
  );
}
