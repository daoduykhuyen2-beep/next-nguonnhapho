import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";
import LogoutButton from "@/components/LogoutButton";

export const metadata = { title: "Tài khoản của tôi" };
export const dynamic = "force-dynamic";

export default async function TaiKhoanPage({
  searchParams,
}: {
  searchParams: Promise<{ paid?: string }>;
}) {
  const { paid } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/dang-nhap");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  const p = profile as Profile | null;

  // Thong ke tong quan cho dashboard
  const [{ count: soTin }, { count: soHienThi }, { count: soKhach }] = await Promise.all([
    supabase.from("web_posts").select("*", { count: "exact", head: true }).eq("owner", user.id),
    supabase
      .from("web_posts")
      .select("*", { count: "exact", head: true })
      .eq("owner", user.id)
      .eq("trang_thai", "duyet"),
    supabase.from("web_post_leads").select("*", { count: "exact", head: true }).eq("owner", user.id),
  ]);
  const soDu = p?.so_du ?? 0;

  const roleLabel = p?.is_admin
    ? "Quản trị viên"
    : p?.membership_tier && p.membership_tier !== "Miễn phí"
    ? "Tài khoản chuyên nghiệp"
    : "Tài khoản thành viên";

  const tierLabel = p?.membership_tier || "Miễn phí";
  const expires = p?.membership_expires_at
    ? new Date(p.membership_expires_at).toLocaleDateString("vi-VN")
    : null;

  const avatarUrl = p?.avatar_url || (user.user_metadata?.avatar_url as string) || null;
  const displayName =
    p?.full_name ||
    (user.user_metadata?.full_name as string) ||
    user.email?.split("@")[0] ||
    "Thành viên";
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(-2)
    .join("")
    .toUpperCase();

  const infoRows: { label: string; value: string | null }[] = [
    { label: "Họ và tên", value: p?.full_name || null },
    { label: "Email", value: user.email || null },
    { label: "Số điện thoại", value: p?.phone || null },
    { label: "Địa chỉ", value: p?.address || null },
    { label: "Giới thiệu", value: p?.bio || null },
    { label: "Gói thành viên", value: tierLabel },
    { label: "Hạn gói", value: expires },
    { label: "Vai trò", value: roleLabel },
  ];

  const menu: {
    href: string;
    label: string;
    icon: string;
    badge?: string;
    danger?: boolean;
  }[] = [
    { href: "/dang-tin", label: "Chuyển sang đăng tin", icon: "↻" },
    { href: "/tai-khoan", label: "Tổng quan", icon: "◔" },
    { href: "/tai-khoan/tin-cua-toi", label: "Quản lý tin đăng", icon: "☰" },
    { href: "/tai-khoan/khach-hang", label: "Quản lý khách hàng", icon: "☺" },
    { href: "/tai-khoan/moi-gioi", label: "Môi giới chuyên nghiệp", icon: "▣" },
    { href: "/goi-thanh-vien", label: "Gói hội viên", icon: "♛", badge: "Tiết kiệm đến -39%" },
    { href: "/tai-khoan/nap-tien", label: "Nạp tiền vào ví", icon: "₫" },
    { href: "/tai-khoan/thong-tin", label: "Cài đặt tài khoản", icon: "⚙" },
    { href: "/tai-khoan/doi-mat-khau", label: "Đổi mật khẩu", icon: "🔒" },
  ];

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto max-w-3xl px-4 py-8">
        {paid === "1" && (
          <div className="mb-6 rounded-2xl bg-green-50 p-4 text-center font-semibold text-green-700 ring-1 ring-green-200">
            ✓ Giao dịch thành công! Số dư và gói dịch vụ của bạn đã được cập nhật.
          </div>
        )}
        {/* Banner voucher VIP */}
        <div className="mb-6 flex items-center gap-4 rounded-2xl bg-red-50 p-5 ring-1 ring-red-100">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-red-100 text-2xl">
            👑
          </div>
          <div className="flex-1">
            <p className="text-lg font-extrabold text-red-800">Gói voucher tin VIP</p>
            <p className="text-sm text-red-700/80">Tiết kiệm chi phí, nâng tầm tin đăng</p>
          </div>
          <Link
            href="/goi-thanh-vien"
            className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-700"
          >
            Mua ngay
          </Link>
        </div>

        {/* Thẻ hồ sơ cá nhân */}
        <div className="mb-6 flex items-center gap-4 rounded-2xl bg-white p-5 ring-1 ring-gray-200">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt={displayName}
              className="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-emerald-500/30"
            />
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xl font-bold text-white">
              {initials || "NP"}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-xl font-extrabold text-gray-900">{displayName}</p>
            <p className="text-sm text-gray-500">{roleLabel}</p>
          </div>
          <Link
            href="/tai-khoan/thong-tin"
            className="rounded-xl border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
          >
            Chỉnh sửa
          </Link>
        </div>

        {/* Thông tin chi tiết (lấy từ dữ liệu hồ sơ) */}
        <div className="mb-6 overflow-hidden rounded-2xl bg-white ring-1 ring-gray-200">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="text-base font-bold text-gray-900">Thông tin cá nhân</h2>
          </div>
          <dl className="divide-y divide-gray-100">
            {infoRows.map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-4 px-5 py-3">
                <dt className="text-sm text-gray-500">{row.label}</dt>
                <dd className="text-right text-sm font-semibold text-gray-900">
                  {row.value ? (
                    row.value
                  ) : (
                    <span className="font-normal italic text-gray-400">Đang cập nhật</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Bảng thống kê tổng quan */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl bg-white p-4 text-center ring-1 ring-gray-200">
            <div className="text-2xl font-extrabold text-emerald-600">{soTin ?? 0}</div>
            <div className="mt-1 text-xs text-gray-500">Tin đã đăng</div>
          </div>
          <div className="rounded-2xl bg-white p-4 text-center ring-1 ring-gray-200">
            <div className="text-2xl font-extrabold text-blue-600">{soHienThi ?? 0}</div>
            <div className="mt-1 text-xs text-gray-500">Đang hiển thị</div>
          </div>
          <div className="rounded-2xl bg-white p-4 text-center ring-1 ring-gray-200">
            <div className="text-2xl font-extrabold text-orange-500">{soKhach ?? 0}</div>
            <div className="mt-1 text-xs text-gray-500">Khách quan tâm</div>
          </div>
          <div className="rounded-2xl bg-white p-4 text-center ring-1 ring-gray-200">
            <div className="text-2xl font-extrabold text-brand">
              {soDu.toLocaleString("vi-VN")}đ
            </div>
            <div className="mt-1 text-xs text-gray-500">Số dư ví</div>
          </div>
        </div>

        {/* Menu điều hướng */}
        <nav className="overflow-hidden rounded-2xl bg-white ring-1 ring-gray-200">
          {menu.map((item) => (
            <Link
              key={item.href + item.label}
              href={item.href}
              className="flex items-center gap-3 border-b border-gray-100 px-5 py-3.5 transition last:border-b-0 hover:bg-gray-50"
            >
              <span className="w-6 text-center text-lg text-gray-500">{item.icon}</span>
              <span className="flex-1 text-sm font-medium text-gray-900">{item.label}</span>
              {item.badge && (
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                  {item.badge}
                </span>
              )}
              <span className="text-gray-300">›</span>
            </Link>
          ))}
          {p?.is_admin && (
            <Link
              href="/admin"
              className="flex items-center gap-3 border-b border-gray-100 px-5 py-3.5 transition last:border-b-0 hover:bg-gray-50"
            >
              <span className="w-6 text-center text-lg text-gray-500">⚑</span>
              <span className="flex-1 text-sm font-medium text-gray-900">Trang quản trị</span>
              <span className="text-gray-300">›</span>
            </Link>
          )}
          <div className="px-5 py-3.5">
            <LogoutButton />
          </div>
        </nav>

        <p className="mt-6 text-center text-xs text-gray-400">
          Nguồn Nhà Phố HCM · Mọi thông tin hiển thị được đồng bộ tự động từ hồ sơ của bạn.
        </p>
      </div>
    </main>
  );
}
