import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";
import AccountSidebar from "@/components/AccountSidebar";

export const metadata = { title: "Biến động số dư" };

function vnd(n: number) { return Number(n || 0).toLocaleString("vi-VN") + "đ"; }

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/dang-nhap");
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  const p = profile as Profile | null;
  const { data: pays } = await supabase.from("payments").select("plan_code, amount, status, created_at, paid_at").eq("user_id", user.id).order("created_at", { ascending: false });
  const rows = pays || [];
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[300px_1fr]">
        <aside><AccountSidebar /></aside>
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-4 border-b-2 border-brand pb-2"><h2 className="text-2xl font-bold">Biến động số dư</h2></div>
          <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-gray-50 p-4"><p className="text-gray-500">Số dư hiện tại</p><p className="text-xl font-bold text-brand">{vnd(Number(p?.so_du))}</p></div>
            <div className="rounded-xl bg-gray-50 p-4"><p className="text-gray-500">Tổng tiền nạp</p><p className="text-xl font-bold">{vnd(Number(p?.tong_nap))}</p></div>
            <div className="rounded-xl bg-gray-50 p-4"><p className="text-gray-500">Đã sử dụng</p><p className="text-xl font-bold">{vnd(Number(p?.da_su_dung))}</p></div>
          </div>
          {rows.length === 0 ? (
            <p className="text-gray-500">Chưa có giao dịch nào.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b text-gray-500">
                  <tr><th className="py-2">Thời gian</th><th className="py-2">Nội dung</th><th className="py-2">Số tiền</th><th className="py-2">Trạng thái</th></tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-3">{r.created_at ? new Date(r.created_at as string).toLocaleString("vi-VN") : "-"}</td>
                      <td className="py-3">Nạp / mua gói {r.plan_code || ""}</td>
                      <td className="py-3 font-semibold text-green-600">+{vnd(Number(r.amount))}</td>
                      <td className="py-3">{r.status === "paid" ? "Thành công" : (r.status || "Chờ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
