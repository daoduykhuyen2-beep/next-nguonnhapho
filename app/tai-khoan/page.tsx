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
  if (!user) redirect("/dang-nhap");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  const p = profile as Profile | null;
  const displayName =
    p?.full_name ||
    (user.user_metadata?.full_name as string) ||
    "Thành viên";

  const roleLabel = p?.is_admin
    ? "Quản trị viên"
    : p?.membership_tier && p.membership_tier !== "Miễn phí"
    ? "Tài khoản hội viên"
    : "Tài khoản thành viên";
  const tierLabel = p?.membership_tier || "Miễn phí";
  const expires = p?.membership_expires_at
    ? new Date(p.membership_expires_at).toLocaleDateString("vi-VN")
    : null;

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      {/* Header: ảnh đại diện + tên + vai trò */}
      <div className="flex items-center gap-4 rounded-xl border bg-white p-5">
        {p?.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={p.avatar_url}
            alt={displayName}
            className="h-20 w-20 shrink-0 rounded-full border object-cover"
          />
        ) : (
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-brand/10 text-2xl font-bold text-brand">
            {displayName.trim().charAt(0).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <h1 className="truncate text-xl font-bold">{displayName}</h1>
          <p className="text-sm text-gray-500">{roleLabel}</p>
          <span className="mt-1 inline-block rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-semibold text-brand">
            Gói: {tierLabel}
          </span>
        </div>
        <div className="ml-auto">
          <LogoutButton />
        </div>
      </div>

      {/* Thông tin cá nhân */}
      <div className="mt-5 space-y-1 rounded-xl border bg-white p-5">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-400">
          Thông tin cá nhân
        </h2>
        <Row label="Họ và tên" value={displayName} />
        <Row label="Email" value={user.email || "-"} />
        <Row label="Số điện thoại" value={p?.phone || "-"} />
        <Row label="Địa chỉ" value={p?.address || "-"} />
        <Row label="Giới thiệu" value={p?.bio || "-"} />
        <Row label="Gói thành viên" value={tierLabel} />
        {expires ? <Row label="Hạn gói" value={expires} /> : null}
        {p?.is_admin ? <Row label="Vai trò" value="Quản trị viên" /> : null}
      </div>

      {/* Menu quản lý */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <MenuItem href="/tai-khoan" title="Tổng quan" desc="Xem thông tin tài khoản" />
        <MenuItem href="/tai-khoan/tin-cua-toi" title="Quản lý tin đăng" desc="Tin bất động sản của bạn" />
        <MenuItem href="/dang-tin" title="Đăng tin mới" desc="Đăng bán / cho thuê nhà phố" />
        <MenuItem href="/goi-thanh-vien" title="Gói hội viên" desc="Bảng giá & nâng cấp gói" badge="Tiết kiệm" />
        <MenuItem href="/tai-khoan/thong-tin" title="Cài đặt tài khoản" desc="Sửa hồ sơ, ảnh đại diện" />
        {p?.is_admin ? (
          <MenuItem href="/admin" title="Trang quản trị" desc="Duyệt tin, quản lý hệ thống" />
        ) : null}
      </div>
    </main>
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

function MenuItem({
  href,
  title,
  desc,
  badge,
}: {
  href: string;
  title: string;
  desc: string;
  badge?: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-xl border bg-white p-4 transition hover:border-brand hover:shadow-sm"
    >
      <span>
        <span className="block font-semibold">{title}</span>
        <span className="block text-sm text-gray-500">{desc}</span>
      </span>
      {badge ? (
        <span className="ml-3 shrink-0 rounded-full bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand">
          {badge}
        </span>
      ) : (
        <span className="ml-3 shrink-0 text-gray-300">›</span>
      )}
    </Link>
  );
}
