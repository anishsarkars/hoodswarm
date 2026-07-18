"use client";

import { useState } from "react";
import { currentUser } from "@/lib/data";
import { Avatar } from "@/components/ui/Avatar";
import { Tabs } from "@/components/ui/Tabs";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="container-content max-w-3xl py-8">
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      <p className="mt-1.5 text-sm text-content-secondary">
        Manage your profile, notifications, and preferences.
      </p>

      <div className="mt-7">
        <Tabs
          tabs={[
            { id: "profile", label: "Profile" },
            { id: "notifications", label: "Notifications" },
            { id: "appearance", label: "Appearance" },
            { id: "account", label: "Account" },
          ]}
        >
          {(active) => (
            <>
              {active === "profile" && <ProfileSettings />}
              {active === "notifications" && <NotificationSettings />}
              {active === "appearance" && <AppearanceSettings />}
              {active === "account" && <AccountSettings />}
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
}

function Saved({ show }: { show: boolean }) {
  return show ? (
    <span className="flex items-center gap-1 text-xs text-primary">
      <Check className="h-3.5 w-3.5" /> Saved
    </span>
  ) : null;
}

function ProfileSettings() {
  const [name, setName] = useState(currentUser.name);
  const [username, setUsername] = useState(currentUser.username);
  const [bio, setBio] = useState(currentUser.bio);
  const [saved, setSaved] = useState(false);

  return (
    <div className="card p-6">
      <div className="mb-6 flex items-center gap-4">
        <Avatar src={currentUser.avatar} alt={currentUser.name} size={64} ring />
        <button className="btn-secondary h-9 px-4">Change avatar</button>
      </div>
      <div className="space-y-4">
        <div>
          <label className="label mb-1.5 block">Display name</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="label mb-1.5 block">Username</label>
          <input className="input" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label className="label mb-1.5 block">Bio</label>
          <textarea
            className="input min-h-[90px] resize-none"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>
      </div>
      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={() => {
            setSaved(true);
            setTimeout(() => setSaved(false), 1600);
          }}
          className="btn-primary h-10 px-6"
        >
          Save changes
        </button>
        <Saved show={saved} />
      </div>
    </div>
  );
}

function Toggle({
  label,
  desc,
  defaultOn,
}: {
  label: string;
  desc: string;
  defaultOn?: boolean;
}) {
  const [on, setOn] = useState(!!defaultOn);
  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-content-secondary">{desc}</p>
      </div>
      <button
        onClick={() => setOn((v) => !v)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          on ? "bg-primary" : "bg-white/[0.1]"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
            on ? "translate-x-[22px]" : "translate-x-0.5"
          )}
        />
      </button>
    </div>
  );
}

function NotificationSettings() {
  return (
    <div className="card divide-y divide-border p-6">
      <Toggle label="Belief challenges" desc="When someone challenges your belief" defaultOn />
      <Toggle label="AI probability updates" desc="When the swarm updates a probability" defaultOn />
      <Toggle label="Market resolutions" desc="When a market you traded resolves" defaultOn />
      <Toggle label="New comments" desc="Replies and comments on your content" />
      <Toggle label="New followers" desc="When someone follows you" defaultOn />
      <Toggle label="Achievements" desc="When you unlock a badge or milestone" defaultOn />
    </div>
  );
}

function AppearanceSettings() {
  return (
    <div className="card p-6">
      <label className="label mb-2 block">Theme</label>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border-2 border-primary bg-background p-4">
          <div className="mb-2 h-16 rounded-lg bg-card" />
          <p className="text-sm font-medium">Dark <span className="text-primary">· Active</span></p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-4 opacity-50">
          <div className="mb-2 h-16 rounded-lg bg-white/10" />
          <p className="text-sm font-medium">Light <span className="text-content-secondary">· Soon</span></p>
        </div>
      </div>
      <div className="mt-6 divide-y divide-border">
        <Toggle label="Reduce motion" desc="Minimize animations across the app" />
        <Toggle label="Compact density" desc="Show more content per screen" />
      </div>
    </div>
  );
}

function AccountSettings() {
  return (
    <div className="space-y-4">
      <div className="card p-6">
        <h3 className="text-sm font-semibold">Connected accounts</h3>
        <p className="mt-1 text-xs text-content-secondary">
          Authentication is managed by Clerk in production.
        </p>
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between rounded-xl border border-border bg-white/[0.02] p-3">
            <span className="text-sm">Google</span>
            <span className="text-xs text-content-secondary">Not connected</span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-border bg-white/[0.02] p-3">
            <span className="text-sm">Apple</span>
            <span className="text-xs text-content-secondary">Not connected</span>
          </div>
        </div>
      </div>
      <div className="card border-bearish/20 p-6">
        <h3 className="text-sm font-semibold text-bearish">Danger zone</h3>
        <p className="mt-1 text-xs text-content-secondary">
          Permanently delete your account and all data.
        </p>
        <button className="btn-bearish mt-4 h-10 px-5">Delete account</button>
      </div>
    </div>
  );
}
