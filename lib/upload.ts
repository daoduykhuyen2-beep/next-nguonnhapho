"use client";

import { createClient } from "@/lib/supabase/client";

// Upload nhiều ảnh lên Supabase Storage bucket "post-images"
// Trả về mảng public URL. Ném lỗi nếu thất bại.
export async function uploadPostImages(files: File[]): Promise<string[]> {
  const supabase = createClient();
  const urls: string[] = [];

  for (const file of files) {
    if (!file || file.size === 0) continue;
    if (!file.type.startsWith("image/")) {
      throw new Error("Chỉ được tải lên tệp ảnh: " + file.name);
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("Ảnh vượt quá 5MB: " + file.name);
    }

    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const rand = Math.random().toString(36).slice(2, 10);
    const path = Date.now() + "-" + rand + "." + ext;

    const { error } = await supabase.storage
      .from("post-images")
      .upload(path, file, { cacheControl: "3600", upsert: false });

    if (error) {
      throw new Error("Tải ảnh thất bại: " + error.message);
    }

    const { data } = supabase.storage.from("post-images").getPublicUrl(path);
    urls.push(data.publicUrl);
  }

  return urls;
}
