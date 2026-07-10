import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminNav from "@/components/AdminNav";

export const metadata = { title: "Nạp tiền & Gói" };
export const dynamic = "force-dynamic";
function vnd(n: number) { return Number(n || 0).toLocaleString("vi-VN") + "đ"; }

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/dang-nhap?next=/admin");
  const { data: prof } = await supabase.from("profiles").select("is_admin").eq("id", user.id).maybeSingle();
  const isAdmin = user.email === "daoduykhuyen2@gmail.com" || prof?.is_admin === true;
  if (!isAdmin) return <div className="p-8 text-center text-gray-500">Không có quyền.</div>;
  const { data } = await supabase.from("payments").select("id, user_id, plan_code, amount, status, created_at, paid_at").order("created_at", { ascending: false }).limit(300);
  const rows = data || [];
  const doanhThu = rows.filter((r) => r.status === "paid").reduce((s, r) => s + Number(r.amount || 0), 0);
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Nạp tiền & đăng ký gói</h1>
      <AdminNav />
      <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-4"><p className="text-sm text-gray-500">Tổng giao dịch</p><p className="text-xl font-bold">{rows.length}</p></div>
        <div className="rounded-xl border bg-white p-4"><p className="text-sm text-gray-500">Đã thanh toán</p><p className="text-xl font-bold">{rows.filter((r) => r.status === "paid").length}</p></div>
        <div className="rounded-xl border bg-white p-4"><p className="text-sm text-gray-500">Doanh thu</p><p className="text-xl font-bold text-brand">{vnd(doanhThu)}</p></div>
      </div>
      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-gray-500"><tr><th className="p-3">Thời gian</th><th className="p-3">Gói</th><th className="p-3">Số tiền</th><th className="p-3">Trạng thái</th><th className="p-3">User</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b last:border-0">
                <td className="p-3">{r.created_at ? new Date(r.created_at as string).toLocaleString("vi-VN") : "-"}</td>
                <td className="p-3 font-semibold">{r.plan_code}</td>
                <td className="p-3">{vnd(Number(r.amount))}</td>
                <td className="p-3">{r.status === "paid" ? <span className="rounded bg-green-100 px-2 py-0.5 text-green-700">Thành công</span> : <span className="rounded bg-gray-100 px-2 py-0.5 text-gray-500">{r.status}</span>}</td>
                <td className="p-3 text-xs text-gray-400">{String(r.user_id).slice(0, 8)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
