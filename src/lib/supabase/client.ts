import { createBrowserClient } from "@supabase/ssr";

// Fall back to harmless placeholders so builds/prerenders never crash when
// env vars are absent. With real values set (locally + on Vercel) the app
// works fully; without them it degrades to guest/seed mode instead of failing.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const key =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "placeholder-anon-key";

export function createClient() {
  return createBrowserClient(url, key);
}
