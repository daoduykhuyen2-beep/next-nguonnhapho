import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const type = searchParams.get("type");
  const nextParam = searchParams.get("next");

  // Loi tra ve truc tiep tu nha cung cap OAuth (vd nguoi dung tu choi).
  const oauthErr = searchParams.get("error_description") || searchParams.get("error");
  if (oauthErr) {
    return NextResponse.redirect(`${origin}/dang-nhap?error=${encodeURIComponent(oauthErr)}`);
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const isEmailVerify =
        type === "signup" || type === "email" || type === "email_change";
      const dest = nextParam || (isEmailVerify ? "/xac-minh-thanh-cong" : "/tai-khoan");
      return NextResponse.redirect(`${origin}${dest}`);
    }
    return NextResponse.redirect(`${origin}/dang-nhap?error=${encodeURIComponent(error.message)}`);
  }

  return NextResponse.redirect(`${origin}/dang-nhap?error=oauth_no_code`);
}
