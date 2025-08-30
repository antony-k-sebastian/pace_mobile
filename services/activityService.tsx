// services/activityService.ts
import { supabase } from "@/lib/supabase";
import type { ActionItem } from "@/components/ActionCard";

type Activity = {
  activity_id: number;
  code: string;
  name: string;
  reward_points: number;
  category_name: string;
  sdgs_affected: number[];
  steps: string[];
  qr_code_value: string;
  q_value: number;
  status: string;
  description: string;
};

const baseSelect =
  "activity_id, code, name, reward_points, category_name, sdgs_affected, steps, qr_code_value, q_value, status, description";

export async function fetchActions(): Promise<ActionItem[]> {
  const { data, error } = await supabase.from("activites").select(baseSelect).eq("status", "active");
  if (error) throw error;
  return (data as Activity[]).map((a) => ({
    id: a.code,
    title: a.name,
    sdgs: a.sdgs_affected,
    points: a.reward_points,
    category: a.category_name,
  }));
}

export async function fetchActionByCode(code: string) {
  const { data, error } = await supabase.from("activites").select(baseSelect).eq("code", code).maybeSingle();
  if (error) throw error;
  if (!data) return undefined;
  const a = data as Activity;
  return {
    id: a.code,
    title: a.name,
    sdgs: a.sdgs_affected,
    points: a.reward_points,
    category: a.category_name,
    description: a.description,
    steps: a.steps,
    qrCode: a.qr_code_value,
    qValue: a.q_value,
    status: a.status,
  };
}
