"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProfileView } from "@/components/profile/ProfileView";
import { useAuth } from "@/lib/auth";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/sign-in");
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="container-content py-24 text-center text-content-secondary">
        Loading…
      </div>
    );
  }
  if (!user) return null;

  return <ProfileView user={user} isMe />;
}
