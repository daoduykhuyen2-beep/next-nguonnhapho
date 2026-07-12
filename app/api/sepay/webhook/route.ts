import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getPlan } from "@/lib/plans";

// SePay gá»i webhook nÃ y má»i khi cÃ³ giao dá»ch tiá»n vÃ o tÃ i khoáº£n.
// Docs SePay: gá»­i POST JSON, xÃ¡c thá»±c báº±ng header "Authorization: Apikey <key>".
// KhÃ´ng dÃ¹ng anon key á» ÄÃ¢y - pháº£i dÃ¹ng SERVICE ROLE Äá» ghi/bá» qua RLS.

export const dynamic = "force-dynamic";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

export async function POST(req: NextRequest) {
  // 1) XÃ¡c thá»±c API key tá»« SePay
  const auth = (req.headers.get("authorization") || "").trim();
  const key = (process.env.SEPAY_WEBHOOK_API_KEY || "").trim();
  const provided = auth.replace(/^Apikey\s+/i, "").trim();
  if (!key || provided !== key) {
    return NextResponse.json({ success: false, error: "unauthorized" }, { status: 401 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "bad json" }, { status: 400 });
  }

  // 2) Chá» xá»­ lÃ½ tiá»n VÃO (transferType === "in")
  const transferType = body.transferType || body.transfer_type;
  if (transferType && transferType !== "in") {
    return NextResponse.json({ success: true, skipped: "not incoming" });
  }

  const content: string = String(body.content || body.description || "");
  const amount: number = Number(
    body.transferAmount || body.amount || body.transfer_amount || 0
  );
  const sepayRef: string = String(
    body.referenceCode || body.id || body.reference_number || ""
  );

  const supabase = admin();

  // 3) TÃ¬m ÄÆ¡n pending cÃ³ ná»i dung khá»p (so khá»p khÃ´ng phÃ¢n biá»t hoa thÆ°á»ng,
  //    bá» khoáº£ng tráº¯ng Äá» chá»u ÄÆ°á»£c viá»c ngÃ¢n hÃ ng chÃ¨n thÃªm kÃ½ tá»±).
  const norm = (s: string) => s.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  const contentNorm = norm(content);

  const { data: pendings } = await supabase
    .from("payments")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(200);

  const order = (pendings || []).find((p: any) =>
    contentNorm.includes(norm(p.transfer_content))
  );

  if (!order) {
    // Váº«n tráº£ 200 Äá» SePay khÃ´ng gá»­i láº¡i; ghi log Äá» Äá»i soÃ¡t thá»§ cÃ´ng.
    console.warn("SePay webhook: no matching order for content", content);
    return NextResponse.json({ success: true, matched: false });
  }

  // 4) Kiá»m tra sá» tiá»n Äá»§
  if (amount < order.amount) {
    console.warn("SePay webhook: amount too low", amount, "<", order.amount);
    return NextResponse.json({ success: true, matched: true, paid: false });
  }

  // 5) ÄÃ¡nh dáº¥u ÄÃ£ thanh toÃ¡n + nÃ¢ng cáº¥p gÃ³i
  const plan = getPlan(order.plan_code);
  const days = plan?.days || 30;

  // ÄÃ¡nh dáº¥u paid CÃ ÄIá»U KIá»N status='pending' Äá» chá»ng cá»ng trÃ¹ng (idempotency).
  // Náº¿u 2 webhook tá»i cÃ¹ng lÃºc, chá» 1 request cáº­p nháº­t ÄÆ°á»£c -> chá» 1 láº§n cá»ng gÃ³i.
  const { data: paidRows, error: paidErr } = await supabase
    .from("payments")
    .update({ status: "paid", sepay_ref: sepayRef, paid_at: new Date().toISOString() })
    .eq("id", order.id)
    .eq("status", "pending")
    .select("id");
  if (paidErr) {
    console.error("SePay webhook: update paid failed", paidErr.message);
    return NextResponse.json({ success: false, error: "db update failed" }, { status: 500 });
  }
  if (!paidRows || paidRows.length === 0) {
    // ÄÆ¡n ÄÃ£ ÄÆ°á»£c xá»­ lÃ½ trÆ°á»c ÄÃ³ (webhook gá»­i láº¡i) -> bá» qua, khÃ´ng cá»ng láº§n 2.
    return NextResponse.json({ success: true, matched: true, alreadyProcessed: true });
  }

  if (order.plan_code === "NAPTIEN") {
    // Náº¡p tiá»n vÃ o vÃ­: cá»ng sá» dÆ° + gá»­i thÃ´ng bÃ¡o "náº¡p tiá»n thÃ nh cÃ´ng".
    const { error: topupErr } = await supabase.rpc("apply_topup", { p_payment_id: order.id });
    if (topupErr) {
      console.error("SePay webhook: apply_topup failed", topupErr.message);
      return NextResponse.json({ success: false, error: "topup failed" }, { status: 500 });
    }
    await supabase.from("notifications").insert({
      tieu_de: "Náº¡p tiá»n thÃ nh cÃ´ng",
      noi_dung:
        "Báº¡n ÄÃ£ náº¡p thÃ nh cÃ´ng " +
        Number(order.amount).toLocaleString("vi-VN") +
        "Ä vÃ o vÃ­. Sá» dÆ° ÄÃ£ ÄÆ°á»£c cáº­p nháº­t.",
      loai: "tai_chinh",
      target_user: order.user_id,
      da_doc: false,
    });
    return NextResponse.json({ success: true, matched: true, paid: true });
  }

  const { error: memErr } = await supabase.rpc("apply_membership", {
    p_user_id: order.user_id,
    p_plan_code: order.plan_code,
    p_days: days,
  });
  if (memErr) {
    console.error("SePay webhook: apply_membership failed", memErr.message);
    return NextResponse.json({ success: false, error: "membership failed" }, { status: 500 });
  }

  // Ãp dá»¥ng gÃ³i cho tin cá»¥ thá» (VIP Kim CÆ°Æ¡ng/VÃ ng hoáº·c Äáº©y tin) náº¿u ÄÆ¡n gáº¯n vá»i 1 tin.
  if (order.post_id) {
    const { error: postErr } = await supabase.rpc("apply_post_plan", { p_payment_id: order.id });
    if (postErr) {
      console.error("SePay webhook: apply_post_plan failed", postErr.message);
      return NextResponse.json({ success: false, error: "post plan failed" }, { status: 500 });
    }
  }

  // Gá»­i thÃ´ng bÃ¡o ÄÄng kÃ½ gÃ³i thÃ nh cÃ´ng.
  await supabase.from("notifications").insert({
    tieu_de: "ÄÄng kÃ½ gÃ³i thÃ nh cÃ´ng",
    noi_dung:
      "GÃ³i " +
      order.plan_code +
      " cá»§a báº¡n ÄÃ£ ÄÆ°á»£c thanh toÃ¡n vÃ  kÃ­ch hoáº¡t thÃ nh cÃ´ng. Cáº£m Æ¡n báº¡n!",
    loai: "tai_chinh",
    target_user: order.user_id,
    da_doc: false,
  });

  return NextResponse.json({ success: true, matched: true, paid: true });
}
