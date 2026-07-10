import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <h1 className="text-5xl font-bold text-brand">404</h1>
      <p className="mt-4 text-lg font-semibold">Không tìm thấy trang</p>
      <p className="mt-2 text-gray-500">
        Trang hoặc tin đăng bạn tìm không tồn tại hoặc đã bị gỡ.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-lg bg-brand px-6 py-2 font-semibold text-white"
      >
        Về trang chủ
      </Link>
    </div>
  );
}
