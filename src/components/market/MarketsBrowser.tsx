"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { CATEGORIES } from "@/lib/data";
import { PulseLiveCard } from "./PulseLiveCard";
import { PulseCard } from "./PulseCard";
import { MarketListRow } from "./MarketListRow";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Search, Zap } from "lucide-react";

type Sort = "pool" | "closing" | "new";

export function MarketsBrowser() {
  const { markets } = useStore();
  const [category, setCategory] = useState<Category | "All">("All");
  const [sort, setSort] = useState<Sort>("pool");
  const [query, setQuery] = useState("");

  const pulse = markets.filter((m) => m.isPulse);
  const featured = [...pulse].sort(
    (a, b) => new Date(a.closesAt).getTime() - new Date(b.closesAt).getTime()
  )[0];
  const otherPulse = pulse.filter((m) => m.id !== featured?.id);

  const filtered = useMemo(() => {
    let list = markets.filter((m) => !m.isPulse);
    if (category !== "All") list = list.filter((m) => m.category === category);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (m) => m.question.toLowerCase().includes(q) || m.topic.toLowerCase().includes(q)
      );
    }
    if (sort === "pool") list = [...list].sort((a, b) => b.pool - a.pool);
    else if (sort === "closing")
      list = [...list].sort((a, b) => new Date(a.closesAt).getTime() - new Date(b.closesAt).getTime());
    else
      list = [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return list;
  }, [markets, category, sort, query]);

  return (
    <div>
      {/* Pulse Markets */}
      <div className="mb-10">
        <div className="mb-4 flex items-center gap-2">
          <Zap className="h-4 w-4 text-warning" />
          <h2 className="text-lg font-semibold">Pulse Markets</h2>
          <span className="rounded-full border border-warning/20 bg-warning/10 px-2 py-0.5 text-[11px] font-semibold text-warning">
            Auto-resolving
          </span>
        </div>
        {featured && <PulseLiveCard market={featured} />}
        <div className="mt-3 grid grid-cols-1 gap-3">
          {otherPulse.map((m) => (
            <PulseCard key={m.id} market={m} />
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="mb-2">
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-content-secondary" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search markets and topics…"
            className="input h-12 rounded-2xl pl-11"
          />
        </div>
        <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1 no-scrollbar">
          <div className="flex gap-2">
            <button
              onClick={() => setCategory("All")}
              className={cn("chip", category === "All" && "chip-active")}
            >
              All
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={cn("chip", category === c && "chip-active")}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="flex shrink-0 items-center gap-1 rounded-full border border-border bg-white/[0.02] p-1">
            {(["pool", "closing", "new"] as Sort[]).map((s) => (
              <button
                key={s}
                onClick={() => setSort(s)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                  sort === s ? "bg-white/[0.06] text-white" : "text-content-secondary"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        {filtered.map((m) => (
          <MarketListRow key={m.id} market={m} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="py-16 text-center text-sm text-content-secondary">
          No markets match your filters.
        </div>
      )}
    </div>
  );
}
