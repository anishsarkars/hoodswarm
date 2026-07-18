"use client";

import { useState } from "react";
import type { Market } from "@/lib/types";
import { useStore } from "@/lib/store";
import { cn, formatPoints, sideLabel } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";

export function TradingPanel({ market }: { market: Market }) {
  const { markets, trade, positions } = useStore();
  const live = markets.find((m) => m.id === market.id) ?? market;
  const [side, setSide] = useState<"believe" | "cope">("believe");
  const [amount, setAmount] = useState(50);
  const [placed, setPlaced] = useState(false);

  const price = side === "believe" ? live.yes : 100 - live.yes;
  const shares = amount / (price / 100);
  const payout = shares * 1; // 1 point per winning share
  const profit = payout - amount;

  const myPositions = positions.filter((p) => p.marketId === market.id);

  const place = () => {
    trade(market.id, side, Math.round(shares));
    setPlaced(true);
    setTimeout(() => setPlaced(false), 1800);
  };

  return (
    <div className="card overflow-hidden">
      <div className="grid grid-cols-2">
        <button
          onClick={() => setSide("believe")}
          className={cn(
            "py-3.5 text-sm font-semibold transition-colors",
            side === "believe"
              ? "bg-bullish/15 text-bullish"
              : "text-content-secondary hover:bg-white/[0.02]"
          )}
        >
          Believe · {live.yes}¢
        </button>
        <button
          onClick={() => setSide("cope")}
          className={cn(
            "py-3.5 text-sm font-semibold transition-colors",
            side === "cope"
              ? "bg-bearish/15 text-bearish"
              : "text-content-secondary hover:bg-white/[0.02]"
          )}
        >
          Hood · {100 - live.yes}¢
        </button>
      </div>

      <div className="border-t border-border p-5">
        <label className="label mb-1.5 block">Stake (points)</label>
        <div className="relative">
          <input
            type="number"
            min={1}
            value={amount}
            onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
            className="input pr-12 text-lg font-semibold"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-content-secondary">
            pts
          </span>
        </div>
        <div className="mt-2 flex gap-2">
          {[25, 50, 100, 250].map((v) => (
            <button
              key={v}
              onClick={() => setAmount(v)}
              className={cn("chip flex-1 justify-center", amount === v && "chip-active")}
            >
              {v}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-2 rounded-xl border border-border bg-white/[0.02] p-4 text-sm">
          <Row label="Avg price" value={`${price.toFixed(0)}¢`} />
          <Row label="Est. shares" value={shares.toFixed(1)} />
          <Row label="Potential payout" value={formatPoints(payout)} />
          <div className="my-1 h-px bg-border" />
          <Row
            label="Potential profit"
            value={`+${formatPoints(profit)}`}
            valueClass="text-bullish font-semibold"
          />
        </div>

        <button
          onClick={place}
          disabled={amount <= 0}
          className={cn(
            "mt-4 h-12 w-full text-base",
            side === "believe" ? "btn-bullish" : "btn-bearish"
          )}
        >
          <AnimatePresence mode="wait">
            {placed ? (
              <motion.span
                key="done"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <Check className="h-4 w-4" /> Position placed
              </motion.span>
            ) : (
              <motion.span key="buy" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                Back {side === "believe" ? "Believe" : "Hood"} · {formatPoints(amount)}
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        <p className="mt-3 text-center text-[11px] text-content-secondary/70">
          Play-money points. Prices move with swarm activity.
        </p>

        {myPositions.length > 0 && (
          <div className="mt-5 border-t border-border pt-4">
            <p className="label mb-2">Your position</p>
            {myPositions.map((p, i) => (
              <div key={i} className="flex items-center justify-between py-1 text-sm">
                <span
                  className={cn(
                    "font-semibold",
                    p.side === "believe" ? "text-bullish" : "text-bearish"
                  )}
                >
                  {sideLabel(p.side)} · {p.shares} shares
                </span>
                <span className="text-content-secondary">@ {p.avgPrice.toFixed(0)}¢</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-content-secondary">{label}</span>
      <span className={cn("font-mono", valueClass)}>{value}</span>
    </div>
  );
}
