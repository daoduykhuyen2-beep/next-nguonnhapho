import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const type = searchParams.get("type");
  const nextParam = searchParams.get("next");

  // Xac dinh origin that su khi chay sau proxy (vd Vercel).
  // request.url co the tra ve host noi bo, nen uu tien header x-forwarded-*.
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") || "https";
  const baseUrl = forwardedHost ? `${forwardedProto}://${forwardedHost}` : origin;

  // Loi tra ve truc tiep tu nha cung cap OAuth (vd nguoi dung tu choi).
  const oauthErr = searchParams.get("error_description") || searchParams.get("error");
  if (oauthErr) {
    return NextResponse.redirect(`${baseUrl}/dang-nhap?error=${encodeURIComponent(oauthErr)}`);
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const isEmailVerify =
        type === "signup" || type === "email" || type === "email_change";
      const dest = nextParam || (isEmailVerify ? "/xac-minh-thanh-cong" : "/tai-khoan");
      return NextResponse.redirect(`${baseUrl}${dest}`);
    }
    return NextResponse.redirect(`${baseUrl}/dang-nhap?error=${encodeURIComponent(error.message)}`);
  }

  return NextResponse.redirect(`${baseUrl}/dang-nhap?error=oauth_no_code`);
}
