import { supabase } from "@/lib/supabase";

export const createUser = async ({
  id,
  email,
  name,
}: {
  id: string;
  email: string;
  name: string;
}) => {
  const { error } = await supabase.from("users").insert({
    id,
    name,
    email
  });

  if (error) {
    console.error("Error creating user:", error.message);
    return { success: false, msg: error.message };
  }

  return { success: true };
};