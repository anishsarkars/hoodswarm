import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("h-7 w-7", className)}
      fill="none"
      aria-hidden
    >
      <rect width="32" height="32" rx="9" fill="#ADD800" />
      <path
        d="M8 20.5L13 12.5L17 17L20 11L24 20.5"
        stroke="#0A0A00"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="13" cy="12.5" r="1.7" fill="#0A0A00" />
      <circle cx="20" cy="11" r="1.7" fill="#0A0A00" />
    </svg>
  );
}

export function Logo({
  variant = "full",
  className,
}: {
  variant?: "full" | "text" | "mark";
  className?: string;
}) {
  return (
    <Link
      href="/"
      aria-label="HoodSwarm home"
      className={cn("flex items-center gap-2.5 font-semibold tracking-tight", className)}
    >
      {variant !== "text" && <LogoMark />}
      {variant !== "mark" && <span className="text-[17px]">HoodSwarm</span>}
    </Link>
  );
}
