"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { getEffectivePrice } from "@/lib/plans";
import { getPlanMerged } from "@/lib/plans-server";

// Dùng quyền lợi trong ví để nâng cấp hạng tin hoặc đẩy tin.
// Còn tiền trong ví thì trừ ví và áp dụng ngay; không đủ thì báo để nạp thêm.
export async function usePerk(formData: FormData): Promise<void> {
  const planCode = String(formData.get("plan") || "").toUpperCase().trim();
  const postId = String(formData.get("post_id") || "").trim();

  const back = "/tai-khoan/tin-cua-toi";

  if (!planCode || !postId) {
    redirect(`${back}?perk=loi`);
  }

  const plan = await getPlanMerged(planCode);
  if (!plan) {
    redirect(`${back}?perk=loi`);
  }

  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/dang-nhap?next=${back}`);
  }

  const gia = getEffectivePrice(plan);

  // Nhóm LE = nâng hạng tin; nhóm DAY = đẩy tin lên đầu.
  let newStatus: string | null = null;
  let isBoost = false;
  if (plan.code === "VIP_KC_7") newStatus = "kim_cuong";
  else if (plan.code === "VIP_VANG_7") newStatus = "vang";
  else if (plan.code === "TIN_THUONG_15") newStatus = "thuong";
  else if (plan.group === "DAY") isBoost = true;
  else {
    // Gói không áp dụng trực tiếp cho 1 tin (vd COMBO) -> hướng dẫn mua ở trang gói.
    redirect(`/goi-thanh-vien?post=${postId}`);
  }

  // Gọi hàm SQL xử lý nguyên tử: kiểm tra số dư, trừ ví, áp dụng cho tin.
  const { data, error } = await supabase.rpc("dung_quyen_loi_tin", {
    p_post_id: Number(postId),
    p_gia: gia,
    p_new_status: newStatus,
    p_is_boost: isBoost,
  });

  if (error) {
    redirect(`${back}?perk=loi`);
  }

  const ket_qua = String(data || "");
  if (ket_qua === "nofunds") {
    redirect(`${back}?perk=nofunds&plan=${planCode}&need=${gia}`);
  }
  if (ket_qua !== "ok") {
    redirect(`${back}?perk=loi`);
  }

  revalidatePath(back);
  redirect(`${back}?perk=ok&plan=${planCode}`);
}
