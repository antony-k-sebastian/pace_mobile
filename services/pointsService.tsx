import { supabase } from "@/lib/supabase";

const pad = (n: number) => String(n).padStart(2, "0");
const fmtLocalTs = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;

const startOfDay = (d = new Date()) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const endOfDay   = (d = new Date()) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
const startOfWeekMon = (d = new Date()) => {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7; // Mon=0
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - day);
  return x;
};
const endOfWeekMon = (d = new Date()) => {
  const s = startOfWeekMon(d);
  return new Date(s.getFullYear(), s.getMonth(), s.getDate() + 7);
};

export async function getPointsSum(userId: string, from: Date, to: Date): Promise<number> {
  const { data, error } = await supabase
    .from("activity_log")
    .select("reward")
    .eq("user_id", userId)
    .gte("created_at", fmtLocalTs(from))
    .lt("created_at", fmtLocalTs(to));

  if (error) {
    console.error("getPointsSum error:", error);
    return 0;
  }
  return (data ?? []).reduce((acc, r: any) => acc + Number(r.reward ?? 0), 0);
}

export function getDailyPoints(userId: string, day = new Date()) {
  return getPointsSum(userId, startOfDay(day), endOfDay(day));
}

export function getWeeklyPoints(userId: string, ref = new Date()) {
  return getPointsSum(userId, startOfWeekMon(ref), endOfWeekMon(ref));
}

export async function getDailyBreakdown(userId: string, days = 7) {
  const from = startOfDay(new Date(Date.now() - (days - 1) * 86400000));
  const to = endOfDay(new Date());

  const { data, error } = await supabase
    .from("activity_log")
    .select("reward, created_at")
    .eq("user_id", userId)
    .gte("created_at", fmtLocalTs(from))
    .lt("created_at", fmtLocalTs(to))
    .order("created_at", { ascending: true });

  if (error) {
    console.error("getDailyBreakdown error:", error);
    return [];
  }

  const key = (d: Date) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  const keys: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(from.getTime() + i * 86400000);
    keys.push(key(d));
  }
  const totals: Record<string, number> = Object.fromEntries(keys.map(k => [k, 0]));

  (data ?? []).forEach((row: any) => {
    const k = key(new Date(row.created_at));
    if (k in totals) totals[k] += Number(row.reward ?? 0);
  });

  return keys.map(k => ({ d: k, total: totals[k] }));
}
