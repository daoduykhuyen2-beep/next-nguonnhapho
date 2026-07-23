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

  const isRecovery = type === "recovery";

  // Loi tra ve truc tiep tu nha cung cap OAuth / email link (vd link het han).
  const oauthErr =
    searchParams.get("error_description") || searchParams.get("error");
  if (oauthErr) {
    // Neu la luong dat lai mat khau, dua nguoi dung ve trang quen mat khau
    // voi thong bao ro rang thay vi hien loi kho hieu.
    const dest = isRecovery ? "/quen-mat-khau" : "/dang-nhap";
    return NextResponse.redirect(
      `${baseUrl}${dest}?error=${encodeURIComponent(oauthErr)}`
    );
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Luong dat lai mat khau: dua thang toi trang nhap mat khau moi.
      if (isRecovery) {
        return NextResponse.redirect(`${baseUrl}/dat-lai-mat-khau`);
      }
      const isEmailVerify =
        type === "signup" || type === "email" || type === "email_change";
      const dest =
        nextParam || (isEmailVerify ? "/xac-minh-thanh-cong" : "/tai-khoan");
      return NextResponse.redirect(`${baseUrl}${dest}`);
    }
    const dest = isRecovery ? "/quen-mat-khau" : "/dang-nhap";
    return NextResponse.redirect(
      `${baseUrl}${dest}?error=${encodeURIComponent(error.message)}`
    );
  }

  return NextResponse.redirect(`${baseUrl}/dang-nhap?error=oauth_no_code`);
}
