import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import AccountSidebar from "@/components/AccountSidebar";

export const metadata = { title: "Bảo mật" };

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/dang-nhap");
  const created = user.created_at ? new Date(user.created_at).toLocaleString("vi-VN") : "-";
  const lastSignIn = user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString("vi-VN") : "-";
  const confirmed = user.email_confirmed_at ? "Đã xác thực" : "Chưa xác thực";
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[300px_1fr]">
        <aside><AccountSidebar /></aside>
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-4 border-b-2 border-brand pb-2"><h2 className="text-2xl font-bold">Bảo mật tài khoản</h2></div>
          <div className="space-y-1">
            <Row label="Email đăng nhập" value={user.email || "-"} />
            <Row label="Trạng thái email" value={confirmed} />
            <Row label="Ngày tạo tài khoản" value={created} />
            <Row label="Đăng nhập gần nhất" value={lastSignIn} />
          </div>
          <div className="mt-5">
            <Link href="/tai-khoan/doi-mat-khau" className="rounded-lg bg-brand px-5 py-3 font-semibold text-white">Đổi mật khẩu</Link>
          </div>
        </section>
      </div>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b py-3 last:border-0">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
