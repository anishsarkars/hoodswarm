"use client";

import { useStore } from "@/lib/store";
import { timeAgo, cn } from "@/lib/utils";
import type { Notification } from "@/lib/types";
import {
  Award,
  Bot,
  CheckCircle2,
  MessageCircle,
  Swords,
  TrendingUp,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";

const ICONS: Record<Notification["type"], { icon: React.ElementType; color: string }> = {
  challenge: { icon: Swords, color: "text-bearish" },
  "ai-update": { icon: Bot, color: "text-ai" },
  resolved: { icon: CheckCircle2, color: "text-primary" },
  comment: { icon: MessageCircle, color: "text-content-secondary" },
  follower: { icon: UserPlus, color: "text-ai" },
  "market-created": { icon: TrendingUp, color: "text-bullish" },
  achievement: { icon: Award, color: "text-warning" },
};

export function NotificationsMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { notifications, markAllRead } = useStore();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6, scale: 0.98 }}
          transition={{ duration: 0.15 }}
          className="absolute right-0 top-12 z-50 w-[360px] max-w-[calc(100vw-2rem)] rounded-2xl border border-border bg-card shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="text-sm font-semibold">Notifications</span>
            <button
              onClick={markAllRead}
              className="text-xs font-medium text-primary hover:underline"
            >
              Mark all read
            </button>
          </div>
          <div className="max-h-[420px] overflow-y-auto py-1">
            {notifications.map((n) => {
              const { icon: Icon, color } = ICONS[n.type];
              const body = (
                <div
                  className={cn(
                    "flex gap-3 px-4 py-3 transition-colors hover:bg-white/[0.03]",
                    !n.read && "bg-primary/[0.03]"
                  )}
                >
                  <div className={cn("mt-0.5 shrink-0", color)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium leading-snug">{n.title}</p>
                    <p className="mt-0.5 text-xs text-content-secondary line-clamp-2">
                      {n.body}
                    </p>
                    <p className="mt-1 text-[11px] text-content-secondary/60">
                      {timeAgo(n.createdAt)}
                    </p>
                  </div>
                  {!n.read && (
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  )}
                </div>
              );
              return n.href ? (
                <Link key={n.id} href={n.href} onClick={onClose}>
                  {body}
                </Link>
              ) : (
                <div key={n.id}>{body}</div>
              );
            })}
          </div>
          <Link
            href="/profile"
            onClick={onClose}
            className="block border-t border-border py-3 text-center text-xs font-medium text-content-secondary hover:text-white"
          >
            View all activity
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
