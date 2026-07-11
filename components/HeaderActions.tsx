"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type UserLite = { email?: string | null } | null;

type Props = {
  user: UserLite;
  avatarUrl: string | null;
  displayName?: string | null;
  soDu?: number | null;
  membershipTier?: string | null;
  notifications?: Noti[];
};

type Noti = {
  id: string;
  cat: "tin" | "taichinh" | "khuyenmai" | "them";
  title: string;
  body: string;
  date: string;
  read: boolean;
};

// Dữ liệu thông báo mẫu — sau này thay bằng dữ liệu thật từ Supabase (bảng notifications)
const DEMO_NOTIS: Noti[] = [
  { id: "n1", cat: "khuyenmai", title: "Gói tin Sài Gòn 1K+", body: "Chỉ 625K có ngay 25 tin thường hiển thị 15 ngày. Áp dụng cho BĐS tại TP.HCM.", date: "08/07/2026", read: false },
  { id: "n2", cat: "khuyenmai", title: "Gói tin Hà Nội 1K+", body: "30 tin chỉ với 1K/ngày, tiết kiệm hơn 2 triệu.", date: "07/07/2026", read: false },
  { id: "n3", cat: "tin", title: "Tin đăng đã được duyệt", body: "Tin “Bán nhà phố Quận 1” của bạn đã hiển thị công khai.", date: "06/07/2026", read: false },
  { id: "n4", cat: "taichinh", title: "Nạp tiền thành công", body: "Bạn đã nạp 500.000đ vào tài khoản. Số dư khả dụng đã được cập nhật.", date: "05/07/2026", read: true },
  { id: "n5", cat: "them", title: "Cập nhật chính sách", body: "Điều khoản sử dụng dịch vụ vừa được cập nhật. Bấm để xem chi tiết.", date: "01/07/2026", read: true },
];

const NOTI_TABS: { key: string; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "tin", label: "Tin đăng" },
  { key: "taichinh", label: "Tài chính" },
  { key: "khuyenmai", label: "Khuyến mãi" },
  { key: "them", label: "Thêm" },
];

// Các mục trong menu Tài khoản (giống bố cục Batdongsan)
const ACCOUNT_MENU: { href: string; label: string; badge?: string }[] = [
  { href: "/dang-tin", label: "Chuyển sang đăng tin" },
  { href: "/tai-khoan", label: "Tổng quan" },
  { href: "/tai-khoan/tin-cua-toi", label: "Quản lý tin đăng" },
  { href: "/tai-khoan/khach-hang", label: "Quản lý khách hàng" },
  { href: "/tai-khoan/moi-gioi", label: "Môi giới chuyên nghiệp" },
  { href: "/goi-thanh-vien", label: "Gói hội viên", badge: "-39%" },
  { href: "/tai-khoan/thong-tin", label: "Cài đặt tài khoản" },
  { href: "/tai-khoan/doi-mat-khau", label: "Đổi mật khẩu" },
];

function useOutside(onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);
  return ref;
}

export default function HeaderActions({ user, avatarUrl, displayName, soDu, membershipTier , notifications }: Props) {
  const [open, setOpen] = useState<"none" | "app" | "fav" | "noti" | "acc">("none");
  const [notiTab, setNotiTab] = useState("all");
  const [onlyUnread, setOnlyUnread] = useState(false);
  const wrapRef = useOutside(() => setOpen("none"));

  const unread = DEMO_NOTIS.filter((n) => !n.read).length;
  const notis = (notifications ?? DEMO_NOTIS).filter(
    (n) => (notiTab === "all" || n.cat === notiTab) && (!onlyUnread || !n.read)
  );

  function toggle(key: typeof open) {
    setOpen((cur) => (cur === key ? "none" : key));
  }

  if (!user) {
    return (
      <div className="flex items-center gap-3 text-sm font-semibold">
        <Link href="/dang-tin" className="hidden hover:underline sm:inline">
          Đăng tin
        </Link>
        <Link href="/dang-nhap" className="rounded-md bg-brand px-3 py-1.5 text-white hover:opacity-90">
          Đăng nhập
        </Link>
      </div>
    );
  }

  return (
    <div ref={wrapRef} className="flex items-center gap-1 text-sm font-semibold sm:gap-2">
      {/* Tải app */}
      <div className="relative">
        <button
          aria-label="Tải ứng dụng"
          onClick={() => toggle("app")}
          className="flex h-10 w-10 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="7" y="2" width="10" height="20" rx="2" />
            <line x1="11" y1="18" x2="13" y2="18" />
          </svg>
        </button>
        {open === "app" && (
          <div className="absolute right-0 z-50 mt-2 w-72 rounded-xl border border-gray-200 bg-white p-4 shadow-xl">
            <p className="text-base font-bold text-black">Tải ứng dụng Nguồn Nhà Phố</p>
            <p className="mt-1 text-xs font-normal text-gray-500">
              Quét mã QR hoặc tải app để tìm nhà nhanh hơn, nhận thông báo tin mới ngay trên điện thoại.
            </p>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-24 w-24 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-[10px] text-gray-400">
                QR CODE
              </div>
              <div className="flex flex-col gap-2">
                <a href="#" className="rounded-md bg-black px-3 py-2 text-center text-xs font-semibold text-white hover:opacity-90">App Store</a>
                <a href="#" className="rounded-md bg-black px-3 py-2 text-center text-xs font-semibold text-white hover:opacity-90">Google Play</a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tin yêu thích */}
      <div className="relative">
        <button
          aria-label="Tin yêu thích"
          onClick={() => toggle("fav")}
          className="flex h-10 w-10 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
          </svg>
        </button>
        {open === "fav" && (
          <div className="absolute right-0 z-50 mt-2 w-80 rounded-xl border border-gray-200 bg-white p-4 shadow-xl">
            <div className="flex items-center justify-between">
              <p className="text-base font-bold text-black">Tin yêu thích</p>
              <Link href="/tai-khoan/tin-yeu-thich" onClick={() => setOpen("none")} className="text-xs font-semibold text-brand hover:underline">
                Xem tất cả
              </Link>
            </div>
            <div className="mt-4 flex flex-col items-center justify-center py-6 text-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5">
                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
              </svg>
              <p className="mt-2 text-sm font-normal text-gray-500">Bạn chưa lưu tin nào.</p>
              <Link href="/tin-dang" onClick={() => setOpen("none")} className="mt-2 text-xs font-semibold text-brand hover:underline">
                Khám phá tin đăng
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Thông báo */}
      <div className="relative">
        <button
          aria-label="Thông báo"
          onClick={() => toggle("noti")}
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.7 21a2 2 0 0 1-3.4 0" />
          </svg>
          {unread > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand px-1 text-[11px] font-bold text-white">
              {unread}
            </span>
          )}
        </button>
        {open === "noti" && (
          <div className="absolute right-0 z-50 mt-2 w-[380px] max-w-[92vw] rounded-xl border border-gray-200 bg-white shadow-xl">
            <div className="flex items-center justify-between px-4 pt-4">
              <p className="text-lg font-bold text-black">Thông báo</p>
              <label className="flex cursor-pointer items-center gap-2 text-xs font-normal text-gray-500">
                <input type="checkbox" checked={onlyUnread} onChange={(e) => setOnlyUnread(e.target.checked)} className="accent-brand" />
                Chưa đọc
              </label>
            </div>
            <div className="mt-2 flex gap-4 overflow-x-auto border-b border-gray-100 px-4 text-sm">
              {NOTI_TABS.map((t) => {
                const cnt = t.key === "all" ? unread : DEMO_NOTIS.filter((n) => n.cat === t.key && !n.read).length;
                const active = notiTab === t.key;
                return (
                  <button
                    key={t.key}
                    onClick={() => setNotiTab(t.key)}
                    className={"flex items-center gap-1 whitespace-nowrap border-b-2 pb-2 pt-1 font-semibold " + (active ? "border-brand text-brand" : "border-transparent text-gray-500 hover:text-black")}
                  >
                    {t.label}
                    {cnt > 0 && <span className="rounded bg-brand px-1 text-[10px] text-white">{cnt}</span>}
                  </button>
                );
              })}
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notis.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm font-normal text-gray-400">Không có thông báo nào.</p>
              ) : (
                notis.map((n) => (
                  <div key={n.id} className={"flex gap-3 border-b border-gray-50 px-4 py-3 hover:bg-gray-50 " + (!n.read ? "bg-red-50/40" : "")}>
                    {!n.read && <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-brand" />}
                    <div className={n.read ? "pl-5" : ""}>
                      <p className="text-sm font-semibold text-black">{n.title}</p>
                      <p className="mt-0.5 text-xs font-normal leading-relaxed text-gray-500">{n.body}</p>
                      <p className="mt-1 text-[11px] font-normal text-gray-400">{n.date}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Tài khoản */}
      <div className="relative">
        <button
          onClick={() => toggle("acc")}
          className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 hover:bg-gray-100"
        >
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt="Tài khoản" className="h-9 w-9 rounded-full border object-cover" />
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
              {(displayName || user.email || "U").charAt(0).toUpperCase()}
            </span>
          )}
        </button>
        {open === "acc" && (
          <div className="absolute right-0 z-50 mt-2 w-72 rounded-xl border border-gray-200 bg-white py-2 shadow-xl">
            <div className="mx-3 mb-2 rounded-lg bg-red-50 p-3">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/10 text-brand">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.3L12 14.3 7.2 16.8l.9-5.3L4.2 7.7l5.4-.8z"/></svg>
                </span>
                <div>
                  <p className="text-sm font-bold text-black">Gói voucher tin VIP</p>
                  <p className="text-[11px] font-normal text-gray-500">Tiết kiệm chi phí, nâng tầm tin đăng</p>
                </div>
              </div>
              <Link href="/goi-thanh-vien" onClick={() => setOpen("none")} className="mt-2 block rounded-md bg-brand py-1.5 text-center text-xs font-bold text-white hover:opacity-90">
                Mua ngay
              </Link>
            </div>

            <div className="border-b border-gray-100 px-4 pb-2">
              <p className="text-sm font-bold text-black">{displayName || user.email}</p>
              <p className="text-xs font-normal text-gray-500">
                {membershipTier ? "Gói: " + membershipTier : "Tài khoản thành viên"}
                {typeof soDu === "number" ? " · Số dư: " + soDu.toLocaleString("vi-VN") + "đ" : ""}
              </p>
            </div>

            <nav className="py-1">
              {ACCOUNT_MENU.map((m) => (
                <Link
                  key={m.href + m.label}
                  href={m.href}
                  onClick={() => setOpen("none")}
                  className="flex items-center justify-between px-4 py-2 text-sm font-normal text-gray-700 hover:bg-gray-50"
                >
                  <span>{m.label}</span>
                  {m.badge && <span className="rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-semibold text-green-700">{m.badge}</span>}
                </Link>
              ))}
            </nav>

            <div className="border-t border-gray-100 pt-1">
              <Link href="/dang-xuat" onClick={() => setOpen("none")} className="block px-4 py-2 text-sm font-normal text-gray-700 hover:bg-gray-50">
                Đăng xuất
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
