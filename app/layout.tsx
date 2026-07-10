import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  metadataBase: new URL("https://nguonnhaphohcm.vn"),
  title: {
    default: "Nguồn Nhà Phố HCM - Kênh đăng tin bất động sản",
    template: "%s | Nguồn Nhà Phố HCM",
  },
  description:
    "Kênh đăng tin mua bán, cho thuê nhà phố, căn hộ, đất nền tại TP. Hồ Chí Minh.",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "Nguồn Nhà Phố HCM",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="vi">
      <body>
        <header className="bg-brand text-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="text-lg font-bold">
              Nguồn Nhà Phố HCM
            </Link>
            <nav className="flex gap-5 text-sm font-medium">
              <Link href="/" className="hover:underline">
                Trang chủ
              </Link>
              <Link href="/tin-dang" className="hover:underline">
                Tin đăng
              </Link>
              {user ? (
                <>
                  <Link href="/dang-tin" className="hover:underline">
                    Đăng tin
                  </Link>
                  <Link href="/tai-khoan" className="hover:underline">
                    Tài khoản
                  </Link>
                </>
              ) : (
                <Link href="/dang-nhap" className="hover:underline">
                  Đăng nhập
                </Link>
              )}
            </nav>
          </div>
        </header>
        <main className="mx-auto min-h-[70vh] max-w-6xl px-4 py-6">
          {children}
        </main>
        <footer className="border-t bg-white">
          <div className="mx-auto max-w-6xl px-4 py-6 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Nguồn Nhà Phố HCM. Bảo lưu mọi quyền.
          </div>
        </footer>
      </body>
    </html>
  );
}
