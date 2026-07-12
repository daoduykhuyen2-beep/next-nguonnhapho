"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPlan, buildTransferContent } from "@/lib/plans";

// Tạo đơn nâng cấp gói (pending) rồi chuyển tới trang thanh toán.
export async function createOrder(formData: FormData): Promise<void> {
  const planCode = String(formData.get("plan") || "").toUpperCase();
  const postIdRaw = String(formData.get("post_id") || "").trim();
  const postId = postIdRaw ? Number(postIdRaw) : null;
  const plan = getPlan(planCode);
  if (!plan || plan.price <= 0) {
    redirect("/goi-thanh-vien?error=plan");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/dang-nhap?next=/goi-thanh-vien");
  }

  const content = buildTransferContent(plan!.code, user!.id);

  const { data, error } = await supabase
    .from("payments")
    .insert({
      user_id: user!.id,
      plan_code: plan!.code,
      amount: plan!.price,
      transfer_content: content,
      status: "pending",
      post_id: postId,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("createOrder error:", error?.message);
    redirect("/goi-thanh-vien?error=order");
  }

  redirect("/nang-cap/" + data!.id);
}
