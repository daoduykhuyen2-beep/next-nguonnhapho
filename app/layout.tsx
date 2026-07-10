import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  metadataBase: new URL("https://nguonnhaphohcm.vn"),
  title: {
    default: "Nguồn Nhà Phố HCM – Mua bán, cho thuê nhà phố trung tâm Sài Gòn",
    template: "%s | Nguồn Nhà Phố HCM",
  },
  description:
    "Kênh đăng tin mua bán, cho thuê nhà phố, shophouse, căn hộ, đất nền trung tâm TP. Hồ Chí Minh. Giá thật, pháp lý rõ ràng, uy tín.",
  icons: {
    icon: "/logo-black.png",
    shortcut: "/logo-black.png",
    apple: "/logo-black.png",
  },
  openGraph: {
    title: "Nguồn Nhà Phố HCM",
    description: "Mua bán, cho thuê nhà phố trung tâm Sài Gòn — pháp lý rõ ràng.",
    images: ["/logo.png"],
  },
};

const navLinks = [
  { href: "/", label: "Trang chủ" },
  { href: "/tin-dang", label: "Nhà bán" },
  { href: "/tin-dang?loai=thue", label: "Nhà cho thuê" },
  { href: "/tin-tuc", label: "Tin tức" },
  { href: "/tuyen-dung", label: "Tuyển dụng" },
  { href: "/gioi-thieu", label: "Giới thiệu" },
  { href: "/goi-thanh-vien", label: "Bảng giá" },
];

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
      <body className="flex min-h-screen flex-col bg-white text-black">
        <header className="sticky top-0 z-40 border-b border-gray-200 bg-white text-black shadow-sm">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo-black.png"
                alt="Nguồn Nhà Phố HCM"
                width={44}
                height={44}
                className="h-11 w-11 object-contain"
                priority
              />
              <span className="flex flex-col leading-tight">
                <span className="text-base font-bold">Nguồn Nhà Phố</span>
                <span className="text-[11px] font-medium opacity-90">
                  Trung tâm HCM
                </span>
              </span>
            </Link>
            <nav className="hidden flex-wrap items-center gap-4 text-sm font-medium md:flex">
              {navLinks.map((l) => (
                <Link key={l.label} href={l.href} className="hover:underline">
                  {l.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-3 text-sm font-medium">
              {user ? (
                <>
                  <Link href="/dang-tin" className="hover:underline">
                    Đăng tin
                  </Link>
                  <Link
                    href="/tai-khoan"
                    className="rounded-md bg-brand px-3 py-1.5 text-white hover:opacity-90"
                  >
                    Tài khoản
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/dang-tin" className="hidden hover:underline sm:inline">
                    Đăng tin
                  </Link>
                  <Link
                    href="/dang-nhap"
                    className="rounded-md bg-brand px-3 py-1.5 text-white hover:opacity-90"
                  >
                    Đăng nhập
                  </Link>
                </>
              )}
            </div>
          </div>
          <nav className="flex gap-4 overflow-x-auto border-t border-gray-200 px-4 py-2 text-sm font-medium md:hidden">
            {navLinks.map((l) => (
              <Link key={l.label} href={l.href} className="whitespace-nowrap hover:underline">
                {l.label}
              </Link>
            ))}
          </nav>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="mt-12 border-t border-gray-200 bg-neutral-900 text-white">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <Image
                  src="/logo.png"
                  alt="Nguồn Nhà Phố HCM"
                  width={40}
                  height={40}
                  className="h-10 w-10 object-contain"
                />
                <span className="text-base font-bold">Nguồn Nhà Phố HCM</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed opacity-90">
                Chuyên nhà phố, shophouse trung tâm TP.HCM. Kho 1.700+ căn kiểm
                tra pháp lý trước khi đăng — mua bán và cho thuê minh bạch.
              </p>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide">
                Khám phá
              </h3>
              <ul className="space-y-2 text-sm opacity-90">
                <li><Link href="/tin-dang" className="hover:underline">Nhà bán</Link></li>
                <li><Link href="/tin-dang?loai=thue" className="hover:underline">Nhà cho thuê</Link></li>
                <li><Link href="/tin-tuc" className="hover:underline">Tin tức & cảnh báo rủi ro</Link></li>
                <li><Link href="/goi-thanh-vien" className="hover:underline">Bảng giá đăng tin</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide">
                Khu vực
              </h3>
              <ul className="space-y-2 text-sm opacity-90">
                <li><Link href="/tin-dang?quan=Quận 1" className="hover:underline">Nhà Quận 1</Link></li>
                <li><Link href="/tin-dang?quan=Quận 3" className="hover:underline">Nhà Quận 3</Link></li>
                <li><Link href="/tin-dang?quan=Bình Thạnh" className="hover:underline">Nhà Bình Thạnh</Link></li>
                <li><Link href="/tin-dang?quan=Quận 4" className="hover:underline">Nhà Quận 4</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide">
                Ký gửi & liên hệ
              </h3>
              <ul className="space-y-2 text-sm opacity-90">
                <li><Link href="/gioi-thieu" className="hover:underline">Về Nguồn Nhà Phố & quy trình</Link></li>
                <li><Link href="/tuyen-dung" className="hover:underline">Tuyển dụng</Link></li>
                <li><Link href="/dang-tin" className="hover:underline">Đăng tin ký gửi</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 py-4 text-center text-xs opacity-80">
            © {new Date().getFullYear()} Nguồn Nhà Phố HCM. Nhà phố trung tâm TP.HCM.
          </div>
        </footer>
      </body>
    </html>
  );
}
