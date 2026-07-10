import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";
import LogoutButton from "@/components/LogoutButton";

export const metadata = { title: "Tài khoản của tôi" };

export default async function TaiKhoanPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/dang-nhap?next=/tai-khoan");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  const p = (profile as Profile) ?? null;
  const displayName =
    p?.full_name || (user.user_metadata?.full_name as string) || "Thành viên";

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tài khoản của tôi</h1>
        <LogoutButton />
      </div>

      <div className="space-y-3 rounded-xl border bg-white p-6">
        <Row label="Họ và tên" value={displayName} />
        <Row label="Email" value={user.email ?? "-"} />
        <Row label="Số điện thoại" value={p?.phone ?? "-"} />
        <Row
          label="Gói thành viên"
          value={p?.membership_tier ?? "Miễn phí"}
        />
        {p?.is_admin ? (
          <Row label="Vai trò" value="Quản trị viên" />
        ) : null}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/dang-tin"
          className="rounded-lg bg-brand px-5 py-2 font-semibold text-white"
        >
          Đăng tin mới
        </Link>
        {p?.is_admin ? (
          <Link
            href="/admin"
            className="rounded-lg border border-brand px-5 py-2 font-semibold text-brand"
          >
            Trang quản trị
          </Link>
        ) : null}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b py-2 last:border-0">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
