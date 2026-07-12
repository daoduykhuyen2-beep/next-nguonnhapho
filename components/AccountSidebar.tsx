"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const items = [
  { href: "/tai-khoan", label: "Thông tin tài khoản", icon: "👤" },
  { href: "/tai-khoan/tin-cua-toi", label: "Tin của tôi", icon: "🏠" },
  { href: "/tai-khoan/tin-yeu-thich", label: "Tin yêu thích", icon: "❤️" },
  { href: "/tai-khoan/khach-hang", label: "Quản lý khách hàng", icon: "👥" },
  { href: "/tai-khoan/moi-gioi", label: "Môi giới chuyên nghiệp", icon: "🏆" },
  { href: "/tai-khoan/goi-hoi-vien", label: "Gói hội viên", icon: "⭐" },
  { href: "/tai-khoan/hoa-don-vat", label: "Hóa đơn VAT", icon: "🧾" },
  { href: "/tai-khoan/bien-dong", label: "Nạp tiền & biến động số dư", icon: "💳" },
  { href: "/tai-khoan/nhat-ky", label: "Nhật ký hoạt động", icon: "🕒" },
  { href: "/tai-khoan/bao-mat", label: "Bảo mật", icon: "🛡️" },
  { href: "/tai-khoan/doi-mat-khau", label: "Thay đổi mật khẩu", icon: "🔑" },
];

export default function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }
  return (
    <nav className="flex flex-col gap-3">
      {items.map((it) => {
        const active = pathname === it.href;
        return (
          <Link
            key={it.href}
            href={it.href}
            className={
              "flex items-center gap-3 rounded-xl border bg-white px-5 py-4 text-base font-semibold transition hover:border-brand hover:text-brand " +
              (active ? "border-brand text-brand shadow-sm" : "border-gray-200 text-gray-700")
            }
          >
            <span className="text-lg">{it.icon}</span>
            <span>{it.label}</span>
          </Link>
        );
      })}
      <button
        onClick={logout}
        className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-5 py-4 text-base font-semibold text-gray-700 transition hover:border-brand hover:text-brand"
      >
        <span className="text-lg">↪️</span>
        <span>Đăng xuất</span>
      </button>
    </nav>
  );
}
