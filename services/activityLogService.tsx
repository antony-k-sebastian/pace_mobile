import { supabase } from "@/lib/supabase";

export type ActivityLog = {
  log_id: string;
  user_id: string;
  created_at: string;
  action: string;
  reward: number | null;
  scanned_code: string;
  status: string;
  activity_id: number;
};

export async function getCurrentUserId() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw error ?? new Error("No user");
  return data.user.id;
}

export async function fetchActivities(limit = 25, offset = 0) {
  const uid = await getCurrentUserId();
  const { data, error } = await supabase
    .from("activity_log")
    .select("log_id,user_id,created_at,action,reward,scanned_code,status,activity_id")
    .eq("user_id", uid)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) throw error;
  return (data ?? []) as ActivityLog[];
}
console.log("fetchActivities called");zzzzz
// realtime: call unsubscribe() when unmounting
export async function subscribeToNewActivities(onInsert: (row: ActivityLog) => void) {
  const uid = await getCurrentUserId();
  const channel = supabase
    .channel("rt-activity-log")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "activity_log", filter: `user_id=eq.${uid}` },
      (payload) => onInsert(payload.new as ActivityLog)
    )
    .subscribe();
  return () => { supabase.removeChannel(channel); };
}
