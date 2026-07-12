import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const type = searchParams.get("type");
  const nextParam = searchParams.get("next");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Nếu là xác minh email đăng ký -> đưa tới trang thông báo thành công.
      // (Supabase gắn type=signup/email khi xác minh email.)
      const isEmailVerify =
        type === "signup" || type === "email" || type === "email_change";
      const dest = nextParam || (isEmailVerify ? "/xac-minh-thanh-cong" : "/tai-khoan");
      return NextResponse.redirect(`${origin}${dest}`);
    }
  }

  return NextResponse.redirect(`${origin}/dang-nhap?error=oauth`);
}
