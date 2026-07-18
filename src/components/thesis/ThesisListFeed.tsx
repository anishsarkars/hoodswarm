"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { CATEGORIES } from "@/lib/data";
import { BeliefListRow } from "./ThesisListRow";
import { cn } from "@/lib/utils";
import type { Category } from "@/lib/types";
import { Loader2, Search } from "lucide-react";

type Sort = "recent" | "conviction" | "active";

export function BeliefListFeed({
  showSearch = false,
  showFilters = true,
  pageSize = 8,
}: {
  showSearch?: boolean;
  showFilters?: boolean;
  pageSize?: number;
}) {
  const { beliefs } = useStore();
  const [category, setCategory] = useState<Category | "All">("All");
  const [sort, setSort] = useState<Sort>("recent");
  const [query, setQuery] = useState("");
  const [count, setCount] = useState(pageSize);
  const sentinel = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    let list = beliefs.filter((b) => category === "All" || b.category === category);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (b) => b.title.toLowerCase().includes(q) || b.topic.toLowerCase().includes(q)
      );
    }
    if (sort === "conviction") list = [...list].sort((a, b) => b.conviction - a.conviction);
    else if (sort === "active")
      list = [...list].sort(
        (a, b) =>
          b.votes.believe + b.votes.cope + b.comments.length -
          (a.votes.believe + a.votes.cope + a.comments.length)
      );
    else
      list = [...list].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    return list;
  }, [beliefs, category, sort, query]);

  const visible = filtered.slice(0, count);
  const hasMore = count < filtered.length;

  useEffect(() => setCount(pageSize), [category, sort, query, pageSize]);

  useEffect(() => {
    if (!hasMore) return;
    const el = sentinel.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries[0].isIntersecting && setTimeout(() => setCount((c) => c + pageSize), 350),
      { rootMargin: "200px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasMore, pageSize]);

  return (
    <div>
      {showSearch && (
        <div className="relative mb-5">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-content-secondary" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search beliefs..."
            className="input h-12 rounded-2xl pl-11"
          />
        </div>
      )}

      {showFilters && (
        <div className="mb-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
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
          <div className="flex shrink-0 items-center gap-1 self-start rounded-full border border-border bg-white/[0.02] p-1 sm:self-auto">
            {(["recent", "conviction", "active"] as Sort[]).map((s) => (
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
      )}

      <div className="flex flex-col">
        {visible.map((b) => (
          <BeliefListRow key={b.id} belief={b} />
        ))}
      </div>

      {visible.length === 0 && (
        <div className="py-16 text-center text-sm text-content-secondary">
          No beliefs match your filters.
        </div>
      )}

      {hasMore && (
        <div
          ref={sentinel}
          className="flex items-center justify-center gap-2 py-8 text-sm text-content-secondary"
        >
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading more…
        </div>
      )}
    </div>
  );
}
