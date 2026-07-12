"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type FavoriteState = { error?: string; saved?: boolean };

// Luu / bo luu mot tin dang (tin yeu thich)
export async function toggleFavorite(postId: number): Promise<FavoriteState> {
  if (!postId || Number.isNaN(postId)) return { error: "Tin khong hop le." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Ban can dang nhap." };

  const { data: existing } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("post_id", postId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("id", existing.id);
    if (error) return { error: error.message };
    revalidatePath("/tai-khoan/tin-yeu-thich");
    return { saved: false };
  }

  const { error } = await supabase
    .from("favorites")
    .insert({ user_id: user.id, post_id: postId });
  if (error) return { error: error.message };
  revalidatePath("/tai-khoan/tin-yeu-thich");
  return { saved: true };
}
