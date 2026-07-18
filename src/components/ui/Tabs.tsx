"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function Tabs({
  tabs,
  defaultTab,
  className,
  children,
}: {
  tabs: { id: string; label: string; count?: number }[];
  defaultTab?: string;
  className?: string;
  children: (active: string) => React.ReactNode;
}) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id);
  return (
    <div className={className}>
      <div className="flex items-center gap-1 overflow-x-auto border-b border-border no-scrollbar">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={cn(
              "relative whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors",
              active === t.id
                ? "text-white"
                : "text-content-secondary hover:text-white"
            )}
          >
            {t.label}
            {typeof t.count === "number" && (
              <span className="ml-1.5 text-xs text-content-secondary/70">
                {t.count}
              </span>
            )}
            {active === t.id && (
              <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-primary" />
            )}
          </button>
        ))}
      </div>
      <div className="pt-5">{children(active)}</div>
    </div>
  );
}
