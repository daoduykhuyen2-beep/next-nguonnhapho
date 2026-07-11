import LogoutButton from "@/components/LogoutButton";
import Link from "next/link";

export const metadata = { title: "Đăng xuất" };

export default function DangXuatPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-20 text-center">
      <h1 className="text-2xl font-bold text-black">Đăng xuất</h1>
      <p className="text-sm text-gray-500">
        Bạn có chắc muốn đăng xuất khỏi tài khoản Nguồn Nhà Phố HCM?
      </p>
      <LogoutButton />
      <Link href="/tai-khoan" className="text-sm font-semibold text-brand hover:underline">
        Quay lại tài khoản
      </Link>
    </div>
  );
}
