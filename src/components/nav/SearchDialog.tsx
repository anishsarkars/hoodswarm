"use client";

import { Modal } from "@/components/ui/Modal";
import { useStore } from "@/lib/store";
import { users } from "@/lib/data";
import { Avatar } from "@/components/ui/Avatar";
import { categoryColor } from "@/lib/utils";
import { Hash, LineChart, Lightbulb, Search, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

export function SearchDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { beliefs, markets } = useStore();
  const [q, setQ] = useState("");

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query)
      return { beliefs: beliefs.slice(0, 3), markets: markets.slice(0, 3), users: users.slice(0, 3), topics: [] as string[] };
    const match = (s: string) => s.toLowerCase().includes(query);
    const topics = Array.from(
      new Set([...beliefs, ...markets].map((x) => x.topic))
    ).filter((t) => match(t));
    return {
      topics,
      beliefs: beliefs.filter((b) => match(b.title) || match(b.topic)).slice(0, 5),
      markets: markets.filter((m) => match(m.question) || match(m.topic)).slice(0, 5),
      users: users.filter((u) => match(u.name) || match(u.username)).slice(0, 5),
    };
  }, [q, beliefs, markets]);

  const go = () => onClose();

  return (
    <Modal open={open} onClose={onClose} className="max-w-xl">
      <div className="flex items-center gap-3 border-b border-border px-5 py-4">
        <Search className="h-4 w-4 text-content-secondary" />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search topics, users, markets, beliefs"
          className="w-full bg-transparent text-sm outline-none placeholder:text-content-secondary/60"
        />
        <kbd className="hidden rounded-md border border-border px-1.5 py-0.5 text-[10px] text-content-secondary sm:block">
          ESC
        </kbd>
      </div>
      <div className="max-h-[60vh] overflow-y-auto p-2">
        {results.topics.length > 0 && (
          <Section title="Topics">
            {results.topics.map((t) => (
              <Link key={t} href={`/markets?q=${t}`} onClick={go} className="row">
                <Hash className="h-4 w-4 text-content-secondary" />
                <span className="font-medium">{t}</span>
              </Link>
            ))}
          </Section>
        )}
        {results.beliefs.length > 0 && (
          <Section title="Beliefs">
            {results.beliefs.map((b) => (
              <Link key={b.id} href={`/beliefs/${b.id}`} onClick={go} className="row">
                <Lightbulb className="h-4 w-4 text-primary" />
                <span className="flex-1 truncate">{b.title}</span>
                <span className={`text-xs ${categoryColor(b.category)}`}>{b.category}</span>
              </Link>
            ))}
          </Section>
        )}
        {results.markets.length > 0 && (
          <Section title="Markets">
            {results.markets.map((m) => (
              <Link key={m.id} href={`/markets/${m.id}`} onClick={go} className="row">
                <LineChart className="h-4 w-4 text-bullish" />
                <span className="flex-1 truncate">{m.question}</span>
                <span className="font-mono text-xs text-bullish">{m.yes}%</span>
              </Link>
            ))}
          </Section>
        )}
        {results.users.length > 0 && (
          <Section title="Users">
            {results.users.map((u) => (
              <Link key={u.id} href={`/profile/${u.username}`} onClick={go} className="row">
                <Avatar src={u.avatar} alt={u.name} size={24} />
                <span className="flex-1 truncate">{u.name}</span>
                <span className="text-xs text-content-secondary">@{u.username}</span>
              </Link>
            ))}
          </Section>
        )}
        {!results.beliefs.length && !results.markets.length && !results.users.length && (
          <div className="flex flex-col items-center gap-2 py-12 text-center text-sm text-content-secondary">
            <UserIcon className="h-5 w-5 opacity-40" />
            No results for "{q}"
          </div>
        )}
      </div>
      <style jsx>{`
        .row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          border-radius: 0.75rem;
          padding: 0.625rem 0.75rem;
          font-size: 0.875rem;
          transition: background 0.12s ease;
        }
        .row:hover {
          background: rgba(255, 255, 255, 0.04);
        }
      `}</style>
    </Modal>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-1">
      <div className="px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wider text-content-secondary/60">
        {title}
      </div>
      {children}
    </div>
  );
}
