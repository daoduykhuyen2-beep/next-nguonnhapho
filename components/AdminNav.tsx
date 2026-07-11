"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/admin", label: "Tổng quan" },
  { href: "/admin/bai-dang", label: "Bài đăng" },
  { href: "/admin/thanh-vien", label: "Thành viên" },
  { href: "/admin/tin-tuc", label: "Tin tức" },
  { href: "/admin/thong-bao", label: "Thông báo / Khuyến mãi" },
  { href: "/admin/nap-tien", label: "Nạp tiền & Gói" },
];

export default function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="mb-6 flex flex-wrap gap-2 border-b pb-3">
      {items.map((it) => {
        const active = pathname === it.href;
        return (
          <Link key={it.href} href={it.href} className={"rounded-lg px-4 py-2 text-sm font-semibold transition " + (active ? "bg-brand text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200")}>{it.label}</Link>
        );
      })}
    </nav>
  );
}
