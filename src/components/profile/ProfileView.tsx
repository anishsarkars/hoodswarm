"use client";

import { useState } from "react";
import type { User } from "@/lib/types";
import { useStore } from "@/lib/store";
import { Avatar } from "@/components/ui/Avatar";
import { Tabs } from "@/components/ui/Tabs";
import { MeterBar } from "@/components/ui/Bars";
import { BeliefCard } from "@/components/thesis/ThesisCard";
import { MarketCard } from "@/components/market/MarketCard";
import { cn, formatPoints, formatNumber, ratingColor, timeAgo } from "@/lib/utils";
import { Award, CalendarDays, MapPin, TrendingUp } from "lucide-react";

const TIER_COLOR: Record<string, string> = {
  swarm: "border-primary/30 bg-primary/10 text-primary",
  gold: "border-warning/30 bg-warning/10 text-warning",
  silver: "border-white/20 bg-white/[0.06] text-content-secondary",
  bronze: "border-amber-700/30 bg-amber-700/10 text-amber-600",
};

export function ProfileView({ user, isMe }: { user: User; isMe?: boolean }) {
  const { beliefs, markets } = useStore();
  const [following, setFollowing] = useState(false);

  const userBeliefs = beliefs.filter((b) => b.author.id === user.id);
  const userMarkets = markets.filter((m) => m.creator.id === user.id);
  const userComments = [...beliefs, ...markets]
    .flatMap((x) => x.comments.map((c) => ({ c, ctx: "title" in x ? x.title : x.question })))
    .filter((x) => x.c.author.id === user.id)
    .slice(0, 8);

  return (
    <div className="container-content py-8">
      {/* Header */}
      <div className="card p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Avatar src={user.avatar} alt={user.name} size={88} ring />
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight">{user.name}</h1>
                <span className={cn("rounded-full border px-2.5 py-0.5 text-xs font-bold", ratingColor(user.rating), "border-current/20")}>
                  {user.rating}
                </span>
              </div>
              <p className="text-sm text-content-secondary">@{user.username}</p>
              <p className="mt-2 max-w-md text-sm text-content-secondary">{user.bio}</p>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-content-secondary">
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5" /> Joined {timeAgo(user.joined)}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" /> Rank #{user.rank}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {isMe ? (
              <a href="/settings" className="btn-secondary h-10 px-5">
                Edit Profile
              </a>
            ) : (
              <button
                onClick={() => setFollowing((v) => !v)}
                className={following ? "btn-secondary h-10 px-6" : "btn-primary h-10 px-6"}
              >
                {following ? "Following" : "Follow"}
              </button>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-6 sm:grid-cols-3 lg:grid-cols-6">
          <HeaderStat label="Followers" value={formatNumber(user.followers, true)} />
          <HeaderStat label="Following" value={formatNumber(user.following)} />
          <HeaderStat label="Accuracy" value={`${user.accuracy}%`} color="text-bullish" />
          <HeaderStat label="Win Rate" value={`${user.winRate}%`} />
          <HeaderStat label="Points" value={formatPoints(user.points, true)} />
          <HeaderStat
            label="Total Winnings"
            value={`+${formatPoints(user.totalWinnings, true)}`}
            color="text-primary"
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
        {/* Main */}
        <div className="min-w-0 lg:order-1">
          <Tabs
            tabs={[
              { id: "beliefs", label: "Beliefs", count: userBeliefs.length },
              { id: "markets", label: "Markets", count: userMarkets.length },
              { id: "comments", label: "Comments", count: userComments.length },
              { id: "badges", label: "Badges", count: user.badges.length },
            ]}
          >
            {(active) => (
              <>
                {active === "beliefs" && (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {userBeliefs.map((b) => (
                      <BeliefCard key={b.id} belief={b} />
                    ))}
                    {userBeliefs.length === 0 && <Empty label="No beliefs yet." />}
                  </div>
                )}
                {active === "markets" && (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {userMarkets.map((m) => (
                      <MarketCard key={m.id} market={m} />
                    ))}
                    {userMarkets.length === 0 && <Empty label="No markets created yet." />}
                  </div>
                )}
                {active === "comments" && (
                  <div className="space-y-3">
                    {userComments.map(({ c, ctx }) => (
                      <div key={c.id} className="card p-4">
                        <p className="text-sm text-content-secondary">{c.body}</p>
                        <p className="mt-2 text-xs text-content-secondary/60">
                          on "{ctx}" · {timeAgo(c.createdAt)}
                        </p>
                      </div>
                    ))}
                    {userComments.length === 0 && <Empty label="No comments yet." />}
                  </div>
                )}
                {active === "badges" && (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {user.badges.map((b) => (
                      <div key={b.id} className="card flex items-center gap-3 p-4">
                        <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl border", TIER_COLOR[b.tier])}>
                          <Award className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{b.label}</p>
                          <p className="text-xs text-content-secondary">{b.description}</p>
                        </div>
                      </div>
                    ))}
                    {user.badges.length === 0 && <Empty label="No badges yet." />}
                  </div>
                )}
              </>
            )}
          </Tabs>
        </div>

        {/* Reputation sidebar */}
        <aside className="space-y-5 lg:order-2">
          <div className="card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold">Swarm Rating</h3>
              <span className={cn("text-2xl font-bold", ratingColor(user.rating))}>
                {user.rating}
              </span>
            </div>
            <div className="space-y-3">
              <MeterBar value={user.reputation.research} label="Research Score" color="#3B82F6" />
              <MeterBar value={user.reputation.debate} label="Debate Score" color="#ADD800" />
              <MeterBar value={user.reputation.prediction} label="Prediction Score" color="#22C55E" />
              <MeterBar value={user.reputation.community} label="Community Score" color="#F59E0B" />
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm font-medium">Overall</span>
              <span className="text-lg font-bold text-primary">{user.reputation.overall}</span>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <TrendingUp className="h-4 w-4 text-primary" /> Performance
            </h3>
            <div className="space-y-2.5 text-sm">
              <RowStat label="Markets created" value={`${user.marketsCreated}`} />
              <RowStat label="Prediction accuracy" value={`${user.accuracy}%`} />
              <RowStat label="Current rank" value={`#${user.rank}`} />
              <RowStat label="Points balance" value={formatPoints(user.points, true)} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function HeaderStat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div>
      <p className={cn("text-xl font-bold tabular-nums", color)}>{value}</p>
      <p className="text-xs text-content-secondary">{label}</p>
    </div>
  );
}

function RowStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-content-secondary">{label}</span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  );
}

function Empty({ label }: { label: string }) {
  return (
    <div className="card col-span-full flex items-center justify-center py-14 text-sm text-content-secondary">
      {label}
    </div>
  );
}
