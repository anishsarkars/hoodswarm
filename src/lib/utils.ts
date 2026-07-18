import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMoney(n: number, opts?: { compact?: boolean }): string {
  if (opts?.compact) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(n);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatNumber(n: number, compact = false): string {
  return new Intl.NumberFormat("en-US", {
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(n);
}

export function formatPercent(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}

export function formatPoints(n: number, compact = false): string {
  const num = new Intl.NumberFormat("en-US", {
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: compact ? 1 : 0,
  }).format(n);
  return `${num} pts`;
}

export function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const s = Math.max(1, Math.floor((now - then) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo}mo ago`;
  return `${Math.floor(mo / 12)}y ago`;
}

export function timeUntil(iso: string): string {
  const target = new Date(iso).getTime();
  const now = Date.now();
  let s = Math.floor((target - now) / 1000);
  if (s <= 0) return "Closed";
  const d = Math.floor(s / 86400);
  s -= d * 86400;
  const h = Math.floor(s / 3600);
  if (d > 0) return `${d}d ${h}h`;
  const m = Math.floor((s % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export function convictionLabel(score: number): string {
  if (score >= 90) return "Very High Conviction";
  if (score >= 75) return "High Conviction";
  if (score >= 55) return "Moderate Conviction";
  if (score >= 35) return "Low Conviction";
  return "Speculative";
}

export function ratingColor(rating: string): string {
  switch (rating) {
    case "AAA":
    case "AA":
      return "text-primary";
    case "A":
    case "BBB":
      return "text-bullish";
    case "BB":
      return "text-warning";
    default:
      return "text-content-secondary";
  }
}

export function categoryColor(category: string): string {
  const map: Record<string, string> = {
    Society: "text-sky-400",
    Technology: "text-indigo-400",
    Politics: "text-rose-400",
    Science: "text-emerald-400",
    Culture: "text-violet-400",
    Sports: "text-orange-400",
    Economy: "text-teal-400",
    Health: "text-pink-400",
    Business: "text-amber-400",
    Relationships: "text-fuchsia-400",
    Entertainment: "text-cyan-400",
  };
  return map[category] ?? "text-content-secondary";
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function uid(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}
