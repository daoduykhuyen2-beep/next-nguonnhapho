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


// Upload MOT video len Supabase Storage bucket "home-videos".
// Tra ve public URL. Nem loi neu that bai.
export async function uploadHomeVideo(file: File): Promise<string> {
  const supabase = createClient();
  if (!file || file.size === 0) {
    throw new Error("Chua chon tep video.");
  }
  if (!file.type.startsWith("video/")) {
    throw new Error("Chi duoc tai len tep video (mp4, webm, mov...).");
  }
  if (file.size > 50 * 1024 * 1024) {
    throw new Error("Video vuot qua 50MB. Vui long chon tep nho hon.");
  }
  const ext = (file.name.split(".").pop() || "mp4").toLowerCase();
  const rand = Math.random().toString(36).slice(2, 10);
  const path = Date.now() + "-" + rand + "." + ext;
  const { error } = await supabase.storage
    .from("home-videos")
    .upload(path, file, { cacheControl: "3600", upsert: false });
  if (error) {
    throw new Error("Tai video that bai: " + error.message);
  }
  const { data } = supabase.storage.from("home-videos").getPublicUrl(path);
  return data.publicUrl;
}
