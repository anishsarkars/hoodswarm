"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ProfileView } from "@/components/profile/ProfileView";
import { getUserByUsername, currentUser } from "@/lib/data";

export default function UserProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const user = getUserByUsername(username);

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

  return <ProfileView user={user} isMe={user.id === currentUser.id} />;
}
