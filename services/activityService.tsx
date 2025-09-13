// services/activityService.ts
import { supabase } from "@/lib/supabase";
import type { ActionItem } from "@/components/ActionCard";

export type Activity = {
  activity_id: number;
  code: string;
  name: string;
  reward_points: number;
  estimated_mins: number | null;
  category_name: string;
  sdgs_affected: number[];
  steps: string[];
  qr_code_value: string;
  q_value: number;
  status: "active" | "completed" | string;
  description: string;
};

const baseSelect =
  "activity_id, code, name, reward_points, estimated_mins, category_name, sdgs_affected, steps, qr_code_value, q_value, status, description";

export const CATEGORIES = [
  "Donate & Buy",
  "Volunteering",
  "Mind Body Spirit",
  "Protect Land/Sea/Wildlife",
  "Reuse/Reduce/Recycle",
  "Advocate and Empower",
] as const;

/** Up to 2 per category:
 *  - prefer 'active' ordered by q_value desc
 *  - pad with 'completed' if needed (also by q_value)
 *  - completed items come with progress=1 so the bar is filled
 */
export async function fetchTop2ByCategory(): Promise<Record<string, ActionItem[]>> {
  const results = await Promise.all(
    CATEGORIES.map(async (cat) => {
      const { data, error } = await supabase
        .from("activites")
        .select(baseSelect)
        .eq("category_name", cat)
        .in("status", ["active", "completed"])
        .order("status", { ascending: true }) // 'active' < 'completed'
        .order("q_value", { ascending: false })
        .order("activity_id", { ascending: false })
        .limit(2);
      if (error) throw error;
      return (data as Activity[]).map(toActionItemWithProgress);
    })
  );
  return Object.fromEntries(CATEGORIES.map((c, i) => [c, results[i]]));
}

export async function fetchActions(): Promise<ActionItem[]> {
  const { data, error } = await supabase
    .from("activites")
    .select(baseSelect)
    .in("status", ["active", "completed"]);
  if (error) throw error;
  return (data as Activity[]).map(toActionItemWithProgress);
}

export async function fetchActionByCode(code: string) {
  const { data, error } = await supabase
    .from("activites")
    .select(baseSelect)
    .eq("code", code)
    .maybeSingle();
  if (error) throw error;
  if (!data) return undefined;
  const a = data as Activity;
  return {
    id: a.code,
    title: a.name,
    sdgs: a.sdgs_affected,
    points: a.reward_points,
    estimatedMins: a.estimated_mins ?? undefined,
    category: a.category_name,
    description: a.description,
    steps: a.steps,
    qrCode: a.qr_code_value,
    qValue: a.q_value,
    status: a.status,
  };
}

export type CompleteResult =
  | { ok: true; points: number; code: string }
  | { ok: false; reason: "not_found" | "already_completed" | "mismatch" | "update_failed" };

/** Validate QR and mark completed (race-safe). */
export async function validateScanAndComplete(
  activityCode: string,
  scannedValue: string
): Promise<CompleteResult> {
  // 1) Load current row
  const { data: row, error } = await supabase
    .from("activites")
    .select("activity_id, code, qr_code_value, status, reward_points")
    .eq("code", activityCode)
    .maybeSingle();

  if (error) throw error;
  if (!row) return { ok: false, reason: "not_found" };

  // 2) Validate QR (trim/collapse spaces, case-insensitive)
  if (!valuesMatch(scannedValue, row.qr_code_value)) {
    return { ok: false, reason: "mismatch" };
  }

  // 3) If already completed, report as already completed
  if (normalize(row.status) !== "active") {
    return { ok: false, reason: "already_completed" };
  }

  // 4) Mark completed and return updated row (no head/count)
  const { data: updRows, error: updErr } = await supabase
    .from("activites")
    .update({ status: "completed" })
    .eq("activity_id", row.activity_id)
    .eq("status", "active") // idempotent/race-safe
    .select("activity_id, status");

  if (updErr) throw updErr;

  // 5) Success if we got a row back with completed status
  if (Array.isArray(updRows) && updRows.length > 0 && normalize(updRows[0].status) === "completed") {
    return { ok: true, points: row.reward_points ?? 0, code: row.code as string };
  }

  // 6) Race fallback: re-check status
  const { data: check } = await supabase
    .from("activites")
    .select("status")
    .eq("activity_id", row.activity_id)
    .maybeSingle();

  if (normalize(check?.status) === "completed") {
    return { ok: true, points: row.reward_points ?? 0, code: row.code as string };
  }

  return { ok: false, reason: "update_failed" };
}

// ---------- helpers

function toActionItemWithProgress(a: Activity): ActionItem {
  return {
    id: a.code,
    title: a.name,
    sdgs: a.sdgs_affected,
    points: a.reward_points,
    estimatedMins: a.estimated_mins ?? undefined,
    category: a.category_name,
    progress: a.status === "completed" ? 1 : 0, // filled bar for completed
  };
}

function normalize(v: unknown) {
  return String(v ?? "").trim().toLowerCase();
}

function normalizeQR(v: unknown) {
  return String(v ?? "").replace(/\s+/g, " ").trim().toLowerCase();
}

function valuesMatch(a: string, b: string) {
  return normalizeQR(a) === normalizeQR(b);
}
