import Link from "next/link";

export const metadata = { title: "Quản lý khách hàng" };

export default function KhachHangPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-3xl">
          ☺
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900">Quản lý khách hàng</h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-gray-500">
          Khu vực lưu trữ và chăm sóc khách hàng của bạn — theo dõi nhu cầu, lịch
          hẹn và tin đã gửi. Tính năng đang được hoàn thiện.
        </p>
        <span className="mt-5 inline-block rounded-full bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-700">
          Sắp ra mắt
        </span>
        <div className="mt-8">
          <Link
            href="/tai-khoan"
            className="rounded-xl border border-emerald-600 px-5 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
          >
            ← Về trang tài khoản
          </Link>
        </div>
      </div>
    </main>
  );
}
