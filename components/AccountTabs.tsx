"use client";

import { useState } from "react";
import Link from "next/link";
import type { Profile } from "@/lib/types";
import ProfileForm from "@/components/ProfileForm";
import PasswordForm from "@/components/PasswordForm";

type TabKey = "thong-tin" | "cai-dat" | "moi-gioi";

const TABS: { key: TabKey; label: string; badge?: string }[] = [
  { key: "thong-tin", label: "Chỉnh sửa thông tin" },
  { key: "cai-dat", label: "Cài đặt tài khoản" },
  { key: "moi-gioi", label: "Tham gia Môi giới chuyên nghiệp", badge: "Mới" },
];

export default function AccountTabs({
  profile,
  email,
}: {
  profile: Profile | null;
  email: string;
}) {
  const [tab, setTab] = useState<TabKey>("thong-tin");
  const [openLock, setOpenLock] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold text-gray-900">Quản lý tài khoản</h1>

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-6 border-b border-gray-200">
        {TABS.map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={
                "relative -mb-px flex items-center gap-2 pb-3 text-base font-semibold transition " +
                (active
                  ? "border-b-2 border-brand text-gray-900"
                  : "border-b-2 border-transparent text-gray-500 hover:text-gray-800")
              }
            >
              {t.label}
              {t.badge && (
                <span className="rounded bg-red-500 px-1.5 py-0.5 text-xs font-bold text-white">
                  {t.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab: Chỉnh sửa thông tin */}
      {tab === "thong-tin" && (
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-lg font-bold text-gray-900">Thông tin cá nhân</h2>
          <p className="mb-6 text-sm text-gray-500">Email: {email}</p>
          <ProfileForm profile={profile} />
        </section>
      )}

      {/* Tab: Cài đặt tài khoản */}
      {tab === "cai-dat" && (
        <section className="space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-gray-900">Đổi mật khẩu</h2>
            <PasswordForm />
            <ul className="mt-4 space-y-1 text-sm text-gray-500">
              <li>• Mật khẩu tối thiểu 6 ký tự</li>
              <li>• Nên chứa cả chữ và số để tăng bảo mật</li>
            </ul>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <button
              type="button"
              onClick={() => setOpenLock((v) => !v)}
              className="flex w-full items-center justify-between px-6 py-4 text-left text-lg font-bold text-gray-900"
            >
              Yêu cầu khóa tài khoản
              <span className="text-gray-400">{openLock ? "▲" : "▼"}</span>
            </button>
            {openLock && (
              <div className="border-t border-gray-100 px-6 py-4 text-sm text-gray-600">
                <p className="mb-3">
                  Khi khóa tài khoản, các tin đăng của bạn sẽ tạm ẩn khỏi website.
                  Để yêu cầu khóa tài khoản, vui lòng liên hệ bộ phận hỗ trợ:
                </p>
                <p>
                  Hotline:{" "}
                  <a href="tel:0396806888" className="font-semibold text-brand">
                    0396 806 888
                  </a>{" "}
                  hoặc email{" "}
                  <a
                    href="mailto:hotro@nguonnhaphohcm.vn"
                    className="font-semibold text-brand"
                  >
                    hotro@nguonnhaphohcm.vn
                  </a>
                </p>
              </div>
            )}
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <button
              type="button"
              onClick={() => setOpenDelete((v) => !v)}
              className="flex w-full items-center justify-between px-6 py-4 text-left text-lg font-bold text-gray-900"
            >
              Yêu cầu xóa tài khoản
              <span className="text-gray-400">{openDelete ? "▲" : "▼"}</span>
            </button>
            {openDelete && (
              <div className="border-t border-gray-100 px-6 py-4 text-sm text-gray-600">
                <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-red-700">
                  Lưu ý: Xóa tài khoản là thao tác không thể hoàn tác. Toàn bộ tin đăng
                  và dữ liệu của bạn sẽ bị gỡ bỏ.
                </p>
                <p>
                  Để đảm bảo an toàn, yêu cầu xóa tài khoản cần được xác minh trực tiếp.
                  Vui lòng liên hệ hotline{" "}
                  <a href="tel:0396806888" className="font-semibold text-brand">
                    0396 806 888
                  </a>{" "}
                  hoặc email{" "}
                  <a
                    href="mailto:hotro@nguonnhaphohcm.vn"
                    className="font-semibold text-brand"
                  >
                    hotro@nguonnhaphohcm.vn
                  </a>{" "}
                  để được hỗ trợ.
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Tab: Tham gia Môi giới chuyên nghiệp */}
      {tab === "moi-gioi" && (
        <section className="space-y-6">
          <div className="rounded-2xl bg-emerald-50 p-6">
            <h2 className="text-xl font-extrabold text-gray-900">
              Nâng tầm thương hiệu cá nhân với danh hiệu Môi giới chuyên nghiệp
            </h2>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { icon: "🏅", text: "Nổi bật trên trang kết quả tìm kiếm" },
                { icon: "📈", text: "Tăng thêm 30% khách hàng" },
                { icon: "🆓", text: "Tham gia hoàn toàn miễn phí" },
              ].map((f) => (
                <div
                  key={f.text}
                  className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm"
                >
                  <span className="text-2xl">{f.icon}</span>
                  <span className="text-sm font-semibold text-gray-800">{f.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-base font-bold text-gray-900">
              Điều kiện tham gia Môi giới chuyên nghiệp
            </h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex gap-2">
                <span className="text-emerald-600">✓</span> Có ít nhất 5 tin đăng hiển thị
                trong 30 ngày vừa qua.
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-600">✓</span> Tuân thủ đầy đủ Quy định đăng tin
                trên website.
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-600">✓</span> Cung cấp đầy đủ thông tin cá nhân
                và ảnh đại diện.
              </li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/tai-khoan/moi-gioi"
                className="rounded-lg bg-brand px-6 py-3 font-semibold text-white transition hover:opacity-90"
              >
                Tìm hiểu & tham gia
              </Link>
              <Link
                href="/tai-khoan/tin-cua-toi"
                className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-800 transition hover:bg-gray-50"
              >
                Quản lý tin đăng
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
