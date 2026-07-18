"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ProfileView } from "@/components/profile/ProfileView";
import { getUserByUsername } from "@/lib/data";
import { useAuth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";
import { profileToUser, type ProfileRow } from "@/lib/supabase/mappers";
import type { User } from "@/lib/types";

export default function UserProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const { user: me } = useAuth();

  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    // Seed users first (demo content), then real Supabase profiles.
    const seed = getUserByUsername(username);
    if (seed) {
      setUser(seed);
      return;
    }
    if (me?.username === username) {
      setUser(me);
      return;
    }
    (async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .maybeSingle();
      setUser(data ? profileToUser(data as ProfileRow) : null);
    })();
  }, [username, me]);

  if (user === undefined) {
    return (
      <div className="container-content py-24 text-center text-content-secondary">
        Loading…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container-content py-24 text-center">
        <p className="text-content-secondary">User @{username} not found.</p>
        <Link href="/leaderboard" className="btn-secondary mt-4 h-10 px-5">
          Back to leaderboard
        </Link>
      </div>
    );
  }

  return <ProfileView user={user} isMe={!!me && user.id === me.id} />;
}
