import type { Belief, Comment, Debate, User, VoteSide } from "@/lib/types";
import { generateDebate } from "@/lib/ai";

export function avatarFor(seed: string): string {
  return `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(
    seed
  )}&backgroundColor=111111,0d0d0d,1a1a1a`;
}

export interface ProfileRow {
  id: string;
  username: string;
  name: string;
  avatar_url: string | null;
  bio: string | null;
  points: number | null;
  created_at: string;
}

export interface BeliefRow {
  id: string;
  author_id: string;
  title: string;
  prediction: string;
  topic: string;
  category: string;
  time_horizon: string;
  description: string;
  evidence: string;
  sources: string[];
  confidence: number;
  risk_factors: string[];
  conviction: number;
  conviction_label: string;
  status: string;
  debate: unknown;
  believe_count: number;
  cope_count: number;
  neutral_count: number;
  created_at: string;
}

export interface CommentRow {
  id: string;
  belief_id: string;
  user_id: string;
  body: string;
  side: VoteSide | null;
  is_challenge: boolean;
  likes: number;
  created_at: string;
}

export function profileToUser(p: ProfileRow): User {
  return {
    id: p.id,
    username: p.username,
    name: p.name,
    avatar: p.avatar_url || avatarFor(p.username),
    bio: p.bio || "Building conviction, one belief at a time.",
    followers: 0,
    following: 0,
    accuracy: 0,
    winRate: 0,
    marketsCreated: 0,
    totalWinnings: 0,
    points: p.points ?? 10000,
    rank: 0,
    rating: "BB",
    reputation: { research: 50, debate: 50, prediction: 50, community: 50, overall: 50 },
    badges: [],
    joined: p.created_at,
  };
}

export function commentRowToComment(c: CommentRow, author: User): Comment {
  return {
    id: c.id,
    author,
    body: c.body,
    createdAt: c.created_at,
    side: c.side ?? undefined,
    likes: c.likes,
    isChallenge: c.is_challenge,
  };
}

function isValidDebate(d: unknown): d is Debate {
  return (
    !!d &&
    typeof d === "object" &&
    Array.isArray((d as Debate).agents) &&
    (d as Debate).agents.length > 0
  );
}

export function beliefRowToBelief(
  r: BeliefRow,
  author: User,
  comments: Comment[]
): Belief {
  const debate: Debate = isValidDebate(r.debate)
    ? (r.debate as Debate)
    : generateDebate({
        title: r.title,
        topic: r.topic,
        category: r.category as Belief["category"],
        confidence: r.confidence,
        timeHorizon: r.time_horizon,
        description: r.description,
      });

  return {
    id: r.id,
    title: r.title,
    prediction: r.prediction,
    topic: r.topic,
    category: r.category as Belief["category"],
    author,
    createdAt: r.created_at,
    timeHorizon: r.time_horizon,
    description: r.description,
    evidence: r.evidence,
    sources: r.sources ?? [],
    confidence: r.confidence,
    riskFactors: r.risk_factors ?? [],
    conviction: r.conviction,
    convictionLabel: r.conviction_label,
    votes: {
      believe: r.believe_count,
      cope: r.cope_count,
      neutral: r.neutral_count,
    },
    status: r.status as Belief["status"],
    debate,
    comments,
  };
}
