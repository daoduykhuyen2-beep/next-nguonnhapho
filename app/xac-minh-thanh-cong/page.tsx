import Link from "next/link";

export const metadata = { title: "Xác minh email thành công" };

export default function XacMinhThanhCongPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 py-12 text-center">
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
        <svg
          width="44"
          height="44"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#16a34a"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>
      <h1 className="mb-2 text-2xl font-bold text-gray-900">
        Xác minh email thành công!
      </h1>
      <p className="mb-6 text-gray-500">
        Tài khoản của bạn đã được kích hoạt. Giờ đây bạn có thể đăng tin, sử dụng các gói dịch vụ và toàn bộ tính năng của Nguồn Nhà Phố HCM.
      </p>
      <div className="flex w-full flex-col gap-3">
        <Link
          href="/tai-khoan"
          className="w-full rounded-lg bg-brand px-4 py-3 text-sm font-bold text-white transition hover:opacity-90"
        >
          Vào trang tài khoản
        </Link>
        <Link
          href="/"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          Về trang chủ
        </Link>
      </div>
    </main>
  );
}
