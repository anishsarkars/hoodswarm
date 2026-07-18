"use client";

import { useState } from "react";
import type { Belief, VoteSide } from "@/lib/types";
import { useStore } from "@/lib/store";
import { Avatar } from "@/components/ui/Avatar";
import { cn, timeAgo } from "@/lib/utils";
import {
  BarChart3,
  Link2,
  Minus,
  Paperclip,
  Swords,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";

export function CommunityVoting({ belief }: { belief: Belief }) {
  const { votes, voteBelief } = useStore();
  const myVote = votes[belief.id];
  const total = belief.votes.believe + belief.votes.cope + belief.votes.neutral || 1;

  const options: { side: VoteSide; label: string; icon: React.ElementType; cls: string; active: string }[] = [
    { side: "believe", label: "Believe", icon: ThumbsUp, cls: "hover:border-bullish/40 hover:bg-bullish/5", active: "border-bullish/50 bg-bullish/10 text-bullish" },
    { side: "neutral", label: "Neutral", icon: Minus, cls: "hover:border-white/20 hover:bg-white/5", active: "border-white/30 bg-white/[0.06] text-white" },
    { side: "cope", label: "Cope", icon: ThumbsDown, cls: "hover:border-bearish/40 hover:bg-bearish/5", active: "border-bearish/50 bg-bearish/10 text-bearish" },
  ];

  return (
    <div className="card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold">Community Conviction</h3>
        <span className="text-sm text-content-secondary">{total} votes</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {options.map((o) => {
          const pct = Math.round((belief.votes[o.side] / total) * 100);
          const active = myVote === o.side;
          return (
            <button
              key={o.side}
              onClick={() => voteBelief(belief.id, o.side)}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-2xl border border-border bg-white/[0.02] py-4 transition-all",
                o.cls,
                active && o.active
              )}
            >
              <o.icon className="h-5 w-5" />
              <span className="text-sm font-semibold">{o.label}</span>
              <span className="text-xs opacity-70">{pct}%</span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex h-2 overflow-hidden rounded-full bg-white/[0.05]">
        <div className="bg-bullish/80" style={{ width: `${(belief.votes.believe / total) * 100}%` }} />
        <div className="bg-white/20" style={{ width: `${(belief.votes.neutral / total) * 100}%` }} />
        <div className="bg-bearish/70" style={{ width: `${(belief.votes.cope / total) * 100}%` }} />
      </div>

      {myVote && (
        <p className="mt-3 text-center text-xs text-content-secondary">
          You voted{" "}
          <span className="font-semibold capitalize text-white">{myVote}</span>. Your
          vote updated the conviction score.
        </p>
      )}
    </div>
  );
}

export function WhereDoYouStand({ belief }: { belief: Belief }) {
  const { beliefs, votes, voteBelief } = useStore();
  const live = beliefs.find((b) => b.id === belief.id) ?? belief;
  const myVote = votes[belief.id];

  const takes = live.votes.believe + live.votes.cope + live.votes.neutral;
  const sideTotal = live.votes.believe + live.votes.cope || 1;
  const believePct = Math.round((live.votes.believe / sideTotal) * 100);
  const copePct = 100 - believePct;

  return (
    <div>
      <h3 className="section-label mb-3">Where do you stand?</h3>

      <div className="card p-4">
        <div className="flex items-center justify-between text-sm font-semibold">
          <span className="text-bullish">Believe {believePct}%</span>
          <span className="text-xs font-medium text-content-secondary">
            {takes} {takes === 1 ? "take" : "takes"}
          </span>
          <span className="text-bearish">Cope {copePct}%</span>
        </div>

        <div className="mt-2.5 flex h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
          <div className="bg-bullish transition-all duration-500" style={{ width: `${believePct}%` }} />
          <div className="bg-bearish transition-all duration-500" style={{ width: `${copePct}%` }} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            onClick={() => voteBelief(belief.id, "believe")}
            className={cn(
              "flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition-all",
              myVote === "believe"
                ? "border-bullish/60 bg-bullish/15 text-bullish"
                : "border-border bg-white/[0.02] text-bullish hover:border-bullish/40 hover:bg-bullish/5"
            )}
          >
            <ThumbsUp className="h-4 w-4" /> Believe
          </button>
          <button
            onClick={() => voteBelief(belief.id, "cope")}
            className={cn(
              "flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition-all",
              myVote === "cope"
                ? "border-bearish/60 bg-bearish/15 text-bearish"
                : "border-border bg-white/[0.02] text-bearish hover:border-bearish/40 hover:bg-bearish/5"
            )}
          >
            <ThumbsDown className="h-4 w-4" /> Cope
          </button>
        </div>

        <p className="mt-3 text-center text-xs text-content-secondary/70">
          {myVote
            ? `You picked ${myVote}. Your vote joins the room tally.`
            : "Pick a side — your vote joins the room tally."}
        </p>
      </div>
    </div>
  );
}

export function Discussion({ belief }: { belief: Belief }) {
  const { beliefs, addBeliefComment } = useStore();
  const live = beliefs.find((b) => b.id === belief.id) ?? belief;
  const [body, setBody] = useState("");
  const [side, setSide] = useState<VoteSide | undefined>();
  const [challenge, setChallenge] = useState(false);

  const submit = () => {
    if (!body.trim()) return;
    addBeliefComment(belief.id, body.trim(), side, challenge);
    setBody("");
    setSide(undefined);
    setChallenge(false);
  };

  return (
    <div className="card p-5">
      <h3 className="mb-4 font-semibold">Discussion</h3>

      <div className="rounded-2xl border border-border bg-white/[0.02] p-3">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Add evidence, challenge the belief, or share your take…"
          className="min-h-[70px] w-full resize-none bg-transparent text-sm outline-none placeholder:text-content-secondary/60"
        />
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {(["believe", "neutral", "cope"] as VoteSide[]).map((s) => (
              <button
                key={s}
                onClick={() => setSide(side === s ? undefined : s)}
                className={cn(
                  "rounded-full border border-border px-2.5 py-1 text-xs font-medium capitalize transition-colors",
                  side === s
                    ? s === "believe"
                      ? "border-bullish/40 bg-bullish/10 text-bullish"
                      : s === "cope"
                      ? "border-bearish/40 bg-bearish/10 text-bearish"
                      : "border-white/20 bg-white/[0.06] text-white"
                    : "text-content-secondary hover:text-white"
                )}
              >
                {s}
              </button>
            ))}
            <button
              onClick={() => setChallenge((v) => !v)}
              className={cn(
                "flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-xs font-medium transition-colors",
                challenge ? "border-warning/40 bg-warning/10 text-warning" : "text-content-secondary hover:text-white"
              )}
            >
              <Swords className="h-3 w-3" /> Challenge
            </button>
            <button className="btn-ghost h-7 w-7 rounded-full p-0" title="Attach chart">
              <BarChart3 className="h-3.5 w-3.5" />
            </button>
            <button className="btn-ghost h-7 w-7 rounded-full p-0" title="Attach link">
              <Link2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <button onClick={submit} disabled={!body.trim()} className="btn-primary h-8 px-4">
            Post
          </button>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {live.comments.map((c) => (
          <div key={c.id} className="flex gap-3">
            <Avatar src={c.author.avatar} alt={c.author.name} size={32} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium">{c.author.name}</span>
                <span className="text-xs text-content-secondary">
                  @{c.author.username} · {timeAgo(c.createdAt)}
                </span>
                {c.side && (
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-[10px] font-semibold capitalize",
                      c.side === "believe"
                        ? "bg-bullish/10 text-bullish"
                        : c.side === "cope"
                        ? "bg-bearish/10 text-bearish"
                        : "bg-white/[0.06] text-content-secondary"
                    )}
                  >
                    {c.side}
                  </span>
                )}
                {c.isChallenge && (
                  <span className="flex items-center gap-1 rounded-full bg-warning/10 px-1.5 py-0.5 text-[10px] font-semibold text-warning">
                    <Swords className="h-2.5 w-2.5" /> Challenge
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-content-secondary">{c.body}</p>
              {c.attachment && (
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-border bg-white/[0.02] px-2.5 py-1.5 text-xs text-content-secondary">
                  <Paperclip className="h-3 w-3" />
                  {c.attachment.label}
                </div>
              )}
              <button className="mt-1.5 flex items-center gap-1 text-xs text-content-secondary hover:text-white">
                <ThumbsUp className="h-3 w-3" /> {c.likes}
              </button>
            </div>
          </div>
        ))}
        {live.comments.length === 0 && (
          <p className="py-6 text-center text-sm text-content-secondary">
            No comments yet. Be the first to weigh in.
          </p>
        )}
      </div>
    </div>
  );
}
