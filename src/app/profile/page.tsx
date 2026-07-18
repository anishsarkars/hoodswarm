import { ProfileView } from "@/components/profile/ProfileView";
import { currentUser } from "@/lib/data";

export const metadata = { title: "Your Profile · HoodSwarm" };

export default function ProfilePage() {
  return <ProfileView user={currentUser} isMe />;
}
