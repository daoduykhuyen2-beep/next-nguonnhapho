"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Role } from "@/lib/roles";

type Item = { href: string; label: string; adminOnly?: boolean };

const items: Item[] = [
  { href: "/admin", label: "Tổng quan" },
  { href: "/admin/bai-dang", label: "Bài đăng" },
  { href: "/admin/banner", label: "Banner" },
  { href: "/admin/quan-ly-video", label: "Video" },
  { href: "/admin/tin-tuc", label: "Tin tức" },
  { href: "/admin/thong-bao", label: "Thông báo / Khuyến mãi" },
  { href: "/admin/thanh-vien", label: "Thành viên", adminOnly: true },
  { href: "/admin/nap-tien", label: "Nạp tiền & Gói", adminOnly: true },
  { href: "/admin/phan-quyen", label: "Phân quyền", adminOnly: true },
];

// Nhận role để ẩn/hiện các mục chỉ dành cho admin.
// Nếu không truyền role, mặc định "admin" (tương thích các trang cũ).
export default function AdminNav({ role = "admin" as Role }: { role?: Role }) {
  const pathname = usePathname();
  const visible = items.filter((it) => !it.adminOnly || role === "admin");

  return (
    <nav className="mb-6 flex flex-wrap gap-2 border-b pb-3">
      {visible.map((it) => {
        const active =
          it.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(it.href);
        return (
          <Link
            key={it.href}
            href={it.href}
            className={
              "rounded-lg px-4 py-2 text-sm font-semibold transition " +
              (active
                ? "bg-brand text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200")
            }
          >
            {it.label}
          </Link>
        );
      })}
    </nav>
  );
}
