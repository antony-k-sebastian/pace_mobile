import { supabase } from "@/lib/supabase";

export type LeaderboardRow = {
  user_id: string;
  full_name: string | null;
  email: string | null;
  earned_total: number;
  spent_total: number;
  balance: number;
  rank?: number; // if using leaderboard_ranked
};

export async function getTopLeaderboard(limit = 20): Promise<LeaderboardRow[]> {
  const { data, error } = await supabase
    .from("leaderboard") // or "leaderboard_ranked"
    .select("user_id, name, email, earned_total, spent_total, balance")
    .order("balance", { ascending: false })
    .order("earned_total", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function getSelfWithRank(): Promise<LeaderboardRow | null> {
  const { data: auth } = await supabase.auth.getUser();
  const uid = auth?.user?.id;
  if (!uid) return null;

  // If you created leaderboard_ranked, this returns rank directly:
  const { data, error } = await supabase
    .from("leaderboard_ranked")
    .select("user_id, full_name, email, earned_total, spent_total, balance, rank")
    .eq("user_id", uid)
    .maybeSingle();
  if (error) throw error;
  return data ?? null;
}
