"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { profileToUser, type ProfileRow } from "@/lib/supabase/mappers";
import type { User } from "@/lib/types";

interface AuthState {
  user: User | null; // app-shaped profile
  userId: string | null; // auth uid
  email: string | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(
    async (uid: string, mail: string | null) => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", uid)
        .maybeSingle();

      if (data) {
        setUser(profileToUser(data as ProfileRow));
      } else {
        // Profile row may lag right after signup; fall back to a minimal user.
        setUser({
          ...profileToUser({
            id: uid,
            username: mail?.split("@")[0] ?? "you",
            name: mail?.split("@")[0] ?? "You",
            avatar_url: null,
            bio: null,
            points: 10000,
            created_at: new Date().toISOString(),
          }),
        });
      }
    },
    [supabase]
  );

  const bootstrap = useCallback(async () => {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (authUser) {
      setUserId(authUser.id);
      setEmail(authUser.email ?? null);
      await loadProfile(authUser.id, authUser.email ?? null);
    } else {
      setUserId(null);
      setEmail(null);
      setUser(null);
    }
    setLoading(false);
  }, [supabase, loadProfile]);

  useEffect(() => {
    bootstrap();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const authUser = session?.user ?? null;
      if (authUser) {
        setUserId(authUser.id);
        setEmail(authUser.email ?? null);
        loadProfile(authUser.id, authUser.email ?? null);
      } else {
        setUserId(null);
        setEmail(null);
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase, bootstrap, loadProfile]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserId(null);
    setEmail(null);
  }, [supabase]);

  const refreshProfile = useCallback(async () => {
    if (userId) await loadProfile(userId, email);
  }, [userId, email, loadProfile]);

  const value: AuthState = {
    user,
    userId,
    email,
    loading,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
