"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { relatedMarkets, getBelief } from "@/lib/data";
import { Avatar } from "@/components/ui/Avatar";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";
import { ProbabilityChart } from "@/components/ui/Chart";
import { TradingPanel } from "@/components/market/TradingPanel";
import { AIDebate } from "@/components/thesis/AIDebate";
import { categoryColor, cn, formatPoints, formatNumber, timeAgo, timeUntil } from "@/lib/utils";
import {
  ArrowLeft,
  Bot,
  CheckCircle2,
  Clock,
  Droplets,
  FileCheck,
  Send,
  Users,
} from "lucide-react";

const RANGES = ["1H", "1D", "1W", "1M", "ALL"];

export default function MarketDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { markets, addMarketComment } = useStore();
  const market = markets.find((m) => m.id === id);
  const [range, setRange] = useState("1M");
  const [comment, setComment] = useState("");

  if (!market) {
    return (
      <div className="container-content py-24 text-center">
        <p className="text-content-secondary">Market not found.</p>
        <Link href="/markets" className="btn-secondary mt-4 h-10 px-5">
          Back to markets
        </Link>
      </div>
    );
  }

  const belief = market.beliefId ? getBelief(market.beliefId) : undefined;
  const related = relatedMarkets(market);
  const chartColor = market.yes >= 50 ? "#22C55E" : "#EF4444";

  const submitComment = () => {
    if (!comment.trim()) return;
    addMarketComment(market.id, comment.trim());
    setComment("");
  };

  return (
    <div className="container-content py-8">
      <Link
        href="/markets"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-content-secondary hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Markets
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0">
          {/* Header */}
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <Badge className={cn("border-border bg-white/[0.03]", categoryColor(market.category))}>
              {market.category}
            </Badge>
            <span className="text-xs text-content-secondary">{market.topic}</span>
            <StatusBadge status={market.status} />
            {market.isPulse && (
              <Badge className="border-warning/20 bg-warning/10 text-warning">Pulse</Badge>
            )}
          </div>
          <h1 className="text-balance text-3xl font-bold leading-tight tracking-tight">
            {market.question}
          </h1>

          {/* Price header */}
          <div className="mt-6 flex items-end justify-between">
            <div>
              <p className="text-sm text-content-secondary">Believe probability</p>
              <p className="text-5xl font-bold tabular-nums" style={{ color: chartColor }}>
                {market.yes}
                <span className="text-2xl">%</span>
              </p>
            </div>
            <div className="flex gap-1 rounded-full border border-border bg-white/[0.02] p-1">
              {RANGES.map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                    range === r ? "bg-white/[0.06] text-white" : "text-content-secondary"
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div className="card mt-4 p-5">
            <ProbabilityChart data={market.history} color={chartColor} height={260} />
          </div>

          {/* Stats */}
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard icon={Users} label="Participants" value={formatNumber(market.participants, true)} />
            <StatCard icon={Droplets} label="Pool" value={formatPoints(market.pool, true)} />
            <StatCard icon={Droplets} label="Liquidity" value={formatPoints(market.liquidity, true)} />
            <StatCard icon={Clock} label="Closes in" value={timeUntil(market.closesAt)} />
          </div>

          {/* Tabs */}
          <div className="mt-6">
            <Tabs
              tabs={[
                { id: "about", label: "Overview" },
                ...(belief ? [{ id: "debate", label: "AI Debate" }] : []),
                { id: "discussion", label: "Discussion", count: market.comments.length },
                { id: "resolution", label: "Resolution" },
              ]}
            >
              {(active) => (
                <>
                  {active === "about" && (
                    <div className="space-y-5">
                      {belief && (
                        <div className="card p-5">
                          <div className="mb-2 flex items-center gap-2">
                            <Bot className="h-4 w-4 text-ai" />
                            <h3 className="text-sm font-semibold uppercase tracking-wide text-content-secondary">
                              AI Summary
                            </h3>
                          </div>
                          <p className="leading-relaxed text-content-secondary">
                            {belief.debate.agents[0].summary} The swarm's aggregate
                            consensus is {belief.debate.consensus.believe}% believe with{" "}
                            {belief.debate.consensus.confidence.toLowerCase()} confidence.
                          </p>
                          <Link
                            href={`/beliefs/${belief.id}`}
                            className="mt-3 inline-flex text-sm font-medium text-primary hover:underline"
                          >
                            View full belief & debate →
                          </Link>
                        </div>
                      )}
                      <div className="card p-5">
                        <div className="mb-3 flex items-center gap-3">
                          <Avatar src={market.creator.avatar} alt={market.creator.name} size={36} />
                          <div className="text-sm">
                            <p className="font-medium">Created by {market.creator.name}</p>
                            <p className="text-content-secondary">
                              {timeAgo(market.createdAt)} · @{market.creator.username}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-content-secondary">
                          {market.resolutionCriteria}
                        </p>
                      </div>
                    </div>
                  )}
                  {active === "debate" && belief && <AIDebate debate={belief.debate} />}
                  {active === "discussion" && (
                    <div className="card p-5">
                      <div className="mb-4 flex gap-2">
                        <input
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && submitComment()}
                          placeholder="Share your read on this market…"
                          className="input"
                        />
                        <button onClick={submitComment} className="btn-primary h-auto px-4">
                          <Send className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="space-y-4">
                        {market.comments.map((c) => (
                          <div key={c.id} className="flex gap-3">
                            <Avatar src={c.author.avatar} alt={c.author.name} size={32} />
                            <div>
                              <p className="text-sm">
                                <span className="font-medium">{c.author.name}</span>{" "}
                                <span className="text-content-secondary">
                                  · {timeAgo(c.createdAt)}
                                </span>
                              </p>
                              <p className="mt-0.5 text-sm text-content-secondary">{c.body}</p>
                            </div>
                          </div>
                        ))}
                        {market.comments.length === 0 && (
                          <p className="py-6 text-center text-sm text-content-secondary">
                            No comments yet.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  {active === "resolution" && (
                    <div className="card p-5">
                      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-content-secondary">
                        <FileCheck className="h-4 w-4 text-primary" /> Resolution
                      </h3>
                      <p className="leading-relaxed text-content-secondary">
                        {market.resolutionCriteria}
                      </p>
                      <div className="mt-4 flex items-center gap-2 rounded-xl border border-border bg-white/[0.02] p-4">
                        <CheckCircle2 className="h-4 w-4 text-bullish" />
                        <div className="text-sm">
                          <p className="font-medium">Resolution source</p>
                          <p className="text-content-secondary">{market.resolutionSource}</p>
                        </div>
                      </div>
                      <p className="mt-3 text-xs text-content-secondary/70">
                        This market resolves automatically from the official source above.
                      </p>
                    </div>
                  )}
                </>
              )}
            </Tabs>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <TradingPanel market={market} />

          {related.length > 0 && (
            <div className="card p-5">
              <h3 className="mb-3 text-sm font-semibold">Related Markets</h3>
              <div className="space-y-3">
                {related.map((m) => (
                  <Link key={m.id} href={`/markets/${m.id}`} className="block group">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium leading-snug group-hover:text-primary">
                        {m.question}
                      </p>
                      <span
                        className={cn(
                          "shrink-0 text-sm font-bold",
                          m.yes >= 50 ? "text-bullish" : "text-bearish"
                        )}
                      >
                        {m.yes}%
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="card p-4">
      <Icon className="h-4 w-4 text-content-secondary" />
      <p className="mt-2 text-lg font-bold tabular-nums">{value}</p>
      <p className="text-xs text-content-secondary">{label}</p>
    </div>
  );
}
