import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Ghi 1 luot truy cap moi khi co nguoi mo trang (dem cong don).
// Dung service role de bo qua RLS. Khong luu thong tin ca nhan.
export const dynamic = "force-dynamic";

function adminDb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

export async function POST() {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const db = adminDb();
    await db.from("page_views").insert({ ngay: today });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
