// services/redemptionsService.ts
import { supabase } from "@/lib/supabase";

export type Redemption = {
  id: string;
  user_id: string;
  points_spent: number;
  coupon_code: string;
  created_at: string; // ISO
};

// get the authenticated user's id
export async function getCurrentUserId() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw error ?? new Error("No user");
  return data.user.id;
}

export async function getRecentRedemptions(limit = 3): Promise<Redemption[]> {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from("rewards")
    .select("id,user_id,points_spent,coupon_code,created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}

export async function getAllRedemptions(): Promise<Redemption[]> {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from("rewards")
    .select("id,user_id,points_spent,coupon_code,created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}
