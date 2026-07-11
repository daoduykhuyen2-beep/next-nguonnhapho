import Link from "next/link";

export const metadata = { title: "Đổi mật khẩu" };

export default function DoiMatKhauPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto max-w-md px-4 py-12 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-3xl">
          🔒
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900">Đổi mật khẩu</h1>
        <p className="mt-3 text-sm text-gray-500">
          Để bảo mật tài khoản, vui lòng đặt lại mật khẩu qua email xác thực. Nhấn
          nút bên dưới để nhận liên kết đổi mật khẩu.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <Link
            href="/dang-nhap"
            className="w-full rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Tới trang đăng nhập / đặt lại
          </Link>
          <Link
            href="/tai-khoan"
            className="text-sm font-semibold text-emerald-700 hover:underline"
          >
            ← Về trang tài khoản
          </Link>
        </div>
      </div>
    </main>
  );
}
