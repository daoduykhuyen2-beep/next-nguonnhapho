import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";
import AccountSidebar from "@/components/AccountSidebar";

export const metadata = { title: "Tài khoản của tôi" };

function vnd(n: number | null | undefined) {
  const v = Number(n || 0);
  return v.toLocaleString("vi-VN") + "đ";
}

export default async function TaiKhoanPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/dang-nhap");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  const p = profile as Profile | null;
  const username =
    (user.user_metadata?.username as string) ||
    (user.email ? user.email.split("@")[0] : "") ||
    "-";
  const displayName = p?.full_name || "Thành viên";

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[300px_1fr]">
        {/* Sidebar */}
        <aside>
          <AccountSidebar />
        </aside>

        {/* Content */}
        <div className="space-y-6">
          {/* Vi cua toi */}
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="mb-4 border-b-2 border-brand pb-2">
              <h2 className="text-2xl font-bold">Ví của tôi</h2>
            </div>
            <p className="text-gray-500">Số dư hiện tại</p>
            <p className="mb-6 text-4xl font-extrabold text-brand">{vnd(p?.so_du)}</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-gray-50 p-5">
                <p className="text-gray-500">Tổng tiền nạp</p>
                <p className="text-2xl font-bold">{vnd(p?.tong_nap)}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-5">
                <p className="text-gray-500">Số dư đã sử dụng</p>
                <p className="text-2xl font-bold">{vnd(p?.da_su_dung)}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-5">
                <p className="text-gray-500">Giảm giá</p>
                <p className="text-2xl font-bold">{Number(p?.giam_gia || 0)}%</p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/goi-thanh-vien" className="rounded-lg bg-brand px-5 py-3 font-semibold text-white">Nạp tiền / Mua gói</Link>
              <Link href="/tai-khoan/bien-dong" className="rounded-lg border px-5 py-3 font-semibold">Biến động số dư</Link>
            </div>
          </section>

          {/* Ho so cua ban */}
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between border-b-2 border-brand pb-2">
              <h2 className="text-2xl font-bold">Hồ sơ của bạn</h2>
              <Link href="/tai-khoan/thong-tin" className="rounded-lg bg-orange-400 px-5 py-2 font-semibold text-white hover:opacity-90">Chỉnh sửa thông tin</Link>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="Tên đăng nhập" value={username} />
              <Field label="Địa chỉ Email" value={user.email || "-"} />
              <Field label="Số điện thoại" value={p?.phone || "-"} />
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="Họ và tên" value={displayName} />
              <Field label="Địa chỉ" value={p?.address || "-"} />
              <Field label="Gói thành viên" value={p?.membership_tier || "Miễn phí"} />
            </div>
            {p?.is_admin ? (
              <div className="mt-5">
                <Link href="/admin" className="rounded-lg border border-brand px-5 py-3 font-semibold text-brand">Trang quản trị</Link>
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </main>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1 text-sm font-medium text-gray-600">{label}</p>
      <div className="rounded-lg bg-gray-100 px-4 py-3 font-medium text-gray-800">{value}</div>
    </div>
  );
}
