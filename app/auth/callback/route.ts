import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const nextParam = searchParams.get("next");

  // Xác định origin thật sự (khi đứng sau proxy/Vercel)
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const baseUrl = forwardedHost
    ? (forwardedProto || "https") + "://" + forwardedHost
    : origin;

  const isRecovery = type === "recovery";

  const errDest = isRecovery
    ? baseUrl + "/quen-mat-khau?error=expired"
    : baseUrl + "/dang-nhap?error=auth";

  // Lỗi trả về trực tiếp trên URL
  const oauthErr =
    searchParams.get("error") || searchParams.get("error_description");
  if (oauthErr) {
    return NextResponse.redirect(errDest);
  }

  function successDest() {
    if (isRecovery) return baseUrl + "/dat-lai-mat-khau";
    if (nextParam) return baseUrl + nextParam;
    const isEmailVerify = type === "signup" || type === "email";
    if (isEmailVerify) return baseUrl + "/dang-nhap?verified=1";
    return baseUrl + "/";
  }

  // Luồng token_hash + verifyOtp (ổn định cho email khôi phục mật khẩu)
  if (tokenHash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      type: type,
      token_hash: tokenHash,
    });
    if (error) {
      return NextResponse.redirect(errDest);
    }
    return NextResponse.redirect(successDest());
  }

  // Luồng PKCE code (dự phòng)
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(errDest);
    }
    return NextResponse.redirect(successDest());
  }

  return NextResponse.redirect(errDest);
}
