"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogoMark } from "@/components/nav/Logo";
import { ArrowRight, Bot, Mail, TrendingUp, Users } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  return (
    <div className="container-content flex min-h-[calc(100vh-9rem)] items-center justify-center py-10">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl border border-border bg-card md:grid-cols-2">
        {/* Left brand panel */}
        <div className="relative hidden flex-col justify-between bg-gradient-to-br from-primary/[0.08] to-transparent p-8 md:flex">
          <div className="pointer-events-none absolute inset-0 grid-dots opacity-50" />
          <div className="relative">
            <div className="flex items-center gap-2.5 font-semibold">
              <LogoMark />
              <span className="text-lg">HoodSwarm</span>
            </div>
            <p className="mt-8 text-2xl font-bold leading-tight">
              Where conviction becomes markets.
            </p>
          </div>
          <div className="relative space-y-4">
            {[
              { icon: TrendingUp, text: "Share a belief on any topic" },
              { icon: Bot, text: "7 AI analysts debate it instantly" },
              { icon: Users, text: "The swarm validates and trades it" },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-3 text-sm text-content-secondary">
                <f.icon className="h-4 w-4 text-primary" />
                {f.text}
              </div>
            ))}
          </div>
        </div>

        {/* Right auth form */}
        <div className="p-8 sm:p-10">
          <div className="md:hidden">
            <LogoMark />
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight md:mt-0">
            Sign in to HoodSwarm
          </h1>
          <p className="mt-1.5 text-sm text-content-secondary">
            Join the internet's belief network.
          </p>

          <div className="mt-7 space-y-3">
            <button
              onClick={() => router.push("/")}
              className="btn-secondary h-11 w-full justify-center"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.65 4.1-5.5 4.1-3.31 0-6-2.74-6-6.2s2.69-6.2 6-6.2c1.88 0 3.14.8 3.86 1.49l2.63-2.53C16.9 3.02 14.65 2 12 2 6.98 2 3 6.03 3 11s3.98 9 9 9c5.2 0 8.64-3.65 8.64-8.8 0-.59-.06-1.04-.14-1.5H12z" />
              </svg>
              Continue with Google
            </button>
            <button
              onClick={() => router.push("/")}
              className="btn-secondary h-11 w-full justify-center"
            >
              <svg className="h-4 w-4 fill-white" viewBox="0 0 24 24">
                <path d="M16.365 1.43c0 1.14-.42 2.2-1.13 3.02-.85.98-2.24 1.73-3.4 1.64-.14-1.1.44-2.27 1.1-3 .74-.83 2.02-1.45 3.09-1.5.02.28.02.56.02.84h.32zM20.5 17.02c-.53 1.23-.79 1.78-1.47 2.87-.95 1.52-2.29 3.42-3.95 3.43-1.48.02-1.86-.96-3.86-.95-2 .01-2.42.97-3.9.95-1.66-.02-2.93-1.73-3.88-3.25C.9 15.66.6 10.9 2.4 8.35c1.03-1.44 2.66-2.35 4.2-2.35 1.56 0 2.55 1 3.85 1 1.26 0 2.03-1 3.84-1 1.37 0 2.82.75 3.85 2.04-3.38 1.85-2.83 6.68.36 8.98z" />
              </svg>
              Continue with Apple
            </button>
          </div>

          <div className="my-6 flex items-center gap-3 text-xs text-content-secondary/60">
            <div className="h-px flex-1 bg-border" />
            OR
            <div className="h-px flex-1 bg-border" />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              router.push("/");
            }}
          >
            <label className="label mb-1.5 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-content-secondary" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="input pl-10"
              />
            </div>
            <button type="submit" className="btn-primary mt-4 h-11 w-full">
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-content-secondary">
            Authentication is powered by Clerk in production. This demo signs you in
            instantly.{" "}
            <Link href="/" className="text-primary hover:underline">
              Explore as guest
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
