"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { generateDebate } from "./ai";
import {
  currentUser,
  markets as seedMarkets,
  notifications as seedNotifications,
  beliefs as seedBeliefs,
} from "./data";
import type {
  Belief,
  Category,
  Comment,
  Market,
  Notification,
  VoteSide,
} from "./types";
import { convictionLabel, uid } from "./utils";

interface Position {
  marketId: string;
  side: "believe" | "cope";
  shares: number;
  avgPrice: number;
}

interface SubmitBeliefInput {
  title: string;
  prediction: string;
  topic: string;
  category: Category;
  timeHorizon: string;
  description: string;
  evidence: string;
  sources: string[];
  confidence: number;
  riskFactors: string[];
}

interface StoreState {
  beliefs: Belief[];
  markets: Market[];
  notifications: Notification[];
  positions: Position[];
  votes: Record<string, VoteSide>; // beliefId -> side
  submitBelief: (input: SubmitBeliefInput) => Belief;
  voteBelief: (beliefId: string, side: VoteSide) => void;
  addBeliefComment: (beliefId: string, body: string, side?: VoteSide, isChallenge?: boolean) => void;
  addMarketComment: (marketId: string, body: string) => void;
  trade: (marketId: string, side: "believe" | "cope", shares: number) => void;
  markAllRead: () => void;
  unread: number;
}

const StoreContext = createContext<StoreState | null>(null);

const KEY = "hoodswarm-store-v2";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [beliefs, setBeliefs] = useState<Belief[]>(seedBeliefs);
  const [markets, setMarkets] = useState<Market[]>(seedMarkets);
  const [notifications, setNotifications] = useState<Notification[]>(seedNotifications);
  const [positions, setPositions] = useState<Position[]>([]);
  const [votes, setVotes] = useState<Record<string, VoteSide>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.userBeliefs) setBeliefs([...parsed.userBeliefs, ...seedBeliefs]);
        if (parsed.votes) setVotes(parsed.votes);
        if (parsed.positions) setPositions(parsed.positions);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  const persist = useCallback(
    (next: { userBeliefs?: Belief[]; votes?: Record<string, VoteSide>; positions?: Position[] }) => {
      try {
        const raw = localStorage.getItem(KEY);
        const prev = raw ? JSON.parse(raw) : {};
        localStorage.setItem(KEY, JSON.stringify({ ...prev, ...next }));
      } catch {
        /* ignore */
      }
    },
    []
  );

  const pushNotification = useCallback((n: Omit<Notification, "id" | "createdAt" | "read">) => {
    setNotifications((prev) => [
      { ...n, id: uid("n"), createdAt: new Date().toISOString(), read: false },
      ...prev,
    ]);
  }, []);

  const submitBelief = useCallback(
    (input: SubmitBeliefInput): Belief => {
      const debate = generateDebate({
        title: input.title,
        topic: input.topic,
        category: input.category,
        confidence: input.confidence,
        timeHorizon: input.timeHorizon,
        description: input.description,
      });
      const conviction = Math.round(
        debate.consensus.believe * 0.4 + input.confidence * 0.35 + 55 * 0.25
      );
      const belief: Belief = {
        id: uid("b"),
        ...input,
        author: currentUser,
        createdAt: new Date().toISOString(),
        conviction,
        convictionLabel: convictionLabel(conviction),
        votes: { believe: 1, cope: 0, neutral: 0 },
        status: "debating",
        debate,
        comments: [],
      };
      setBeliefs((prev) => {
        const next = [belief, ...prev];
        const userBeliefs = next.filter(
          (b) => b.author.id === currentUser.id && !seedBeliefs.some((s) => s.id === b.id)
        );
        persist({ userBeliefs });
        return next;
      });
      pushNotification({
        type: "ai-update",
        title: "AI debate generated",
        body: `7 analysts weighed in on "${input.title}". Consensus: ${debate.consensus.believe}% believe.`,
        href: `/beliefs/${belief.id}`,
      });
      return belief;
    },
    [persist, pushNotification]
  );

  const voteBelief = useCallback(
    (beliefId: string, side: VoteSide) => {
      setVotes((prev) => {
        const nextVotes = { ...prev, [beliefId]: side };
        persist({ votes: nextVotes });
        return nextVotes;
      });
      setBeliefs((prev) =>
        prev.map((b) => {
          if (b.id !== beliefId) return b;
          const prevSide = votes[beliefId];
          const v = { ...b.votes };
          if (prevSide) v[prevSide] = Math.max(0, v[prevSide] - 1);
          v[side] += 1;
          const total = v.believe + v.cope + v.neutral || 1;
          const communityBelieve = (v.believe / total) * 100;
          const conviction = Math.round(
            communityBelieve * 0.4 + b.debate.consensus.believe * 0.35 + b.confidence * 0.25
          );
          return { ...b, votes: v, conviction, convictionLabel: convictionLabel(conviction) };
        })
      );
    },
    [persist, votes]
  );

  const addBeliefComment = useCallback(
    (beliefId: string, body: string, side?: VoteSide, isChallenge?: boolean) => {
      const comment: Comment = {
        id: uid("c"),
        author: currentUser,
        body,
        createdAt: new Date().toISOString(),
        side,
        likes: 0,
        isChallenge,
      };
      setBeliefs((prev) =>
        prev.map((b) =>
          b.id === beliefId ? { ...b, comments: [comment, ...b.comments] } : b
        )
      );
    },
    []
  );

  const addMarketComment = useCallback((marketId: string, body: string) => {
    const comment: Comment = {
      id: uid("c"),
      author: currentUser,
      body,
      createdAt: new Date().toISOString(),
      likes: 0,
    };
    setMarkets((prev) =>
      prev.map((m) =>
        m.id === marketId ? { ...m, comments: [comment, ...m.comments] } : m
      )
    );
  }, []);

  const trade = useCallback(
    (marketId: string, side: "believe" | "cope", shares: number) => {
      const market = markets.find((m) => m.id === marketId);
      if (!market || shares <= 0) return;
      const price = side === "believe" ? market.yes : 100 - market.yes;
      setPositions((prev) => {
        const existing = prev.find((p) => p.marketId === marketId && p.side === side);
        let next: Position[];
        if (existing) {
          const totalShares = existing.shares + shares;
          const avg = (existing.avgPrice * existing.shares + price * shares) / totalShares;
          next = prev.map((p) =>
            p === existing ? { ...p, shares: totalShares, avgPrice: avg } : p
          );
        } else {
          next = [...prev, { marketId, side, shares, avgPrice: price }];
        }
        persist({ positions: next });
        return next;
      });
      setMarkets((prev) =>
        prev.map((m) => {
          if (m.id !== marketId) return m;
          const delta = Math.min(3, shares / 40) * (side === "believe" ? 1 : -1);
          const yes = Math.max(2, Math.min(98, Math.round((m.yes + delta) * 10) / 10));
          return {
            ...m,
            yes,
            pool: m.pool + shares * price,
            participants: m.participants + 1,
            history: [...m.history.slice(1), { t: Date.now(), yes }],
          };
        })
      );
    },
    [markets, persist]
  );

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const unread = useMemo(
    () => (hydrated ? notifications.filter((n) => !n.read).length : 0),
    [notifications, hydrated]
  );

  const value: StoreState = {
    beliefs,
    markets,
    notifications,
    positions,
    votes,
    submitBelief,
    voteBelief,
    addBeliefComment,
    addMarketComment,
    trade,
    markAllRead,
    unread,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
