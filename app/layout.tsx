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
  icons: { icon: "/logo.png", shortcut: "/logo.png", apple: "/logo.png" },
  openGraph: {
    title: "Nguồn Nhà Phố HCM",
    description: "Mua bán, cho thuê nhà phố trung tâm Sài Gòn — pháp lý rõ ràng.",
    images: ["/logo.png"],
  },
};

const navLinks = [
  { href: "/tin-dang", label: "Nhà bán" },
  { href: "/tin-dang?loai=thue", label: "Nhà cho thuê" },
  { href: "/tin-tuc", label: "Tin tức" },
  { href: "/goi-thanh-vien", label: "Bảng giá" },
  { href: "/gioi-thieu", label: "Giới thiệu" },
  { href: "/tuyen-dung", label: "Tuyển dụng" },
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
      <body className="flex min-h-screen flex-col bg-[#F5F6F8] text-[#2C2C2C]">
        <div className="np-topbar">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2">
            <span className="font-medium">Nhà phố trung tâm Sài Gòn — 100% kiểm tra pháp lý trước khi đăng</span>
            <Link href="/gioi-thieu" className="hidden hover:underline sm:inline">Quy trình làm việc →</Link>
          </div>
        </div>

        <header className="sticky top-0 z-40 border-b border-[#E7E9EE] bg-white text-[#2C2C2C] shadow-sm">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="Nguồn Nhà Phố HCM" width={44} height={44} className="h-11 w-11 object-contain" priority />
              <span className="flex flex-col leading-tight">
                <span className="text-lg font-extrabold">Nguồn Nhà Phố</span>
                <span className="text-xs font-semibold uppercase tracking-wide text-[#667082]">Trung tâm HCM</span>
              </span>
            </Link>

            <nav className="hidden flex-wrap items-center gap-6 text-sm font-semibold lg:flex">
              {navLinks.map((link) => (
                <Link key={link.label} href={link.href} className="hover:text-brand">
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3 text-sm font-semibold">
              {user ? (
                <>
                  <Link href="/dang-tin" className="hidden hover:text-brand sm:inline">Đăng tin</Link>
                  <Link href="/tai-khoan" className="np-btn px-4 py-2">Quản trị</Link>
                </>
              ) : (
                <>
                  <Link href="/dang-tin" className="hidden hover:text-brand sm:inline">Đăng tin</Link>
                  <Link href="/dang-nhap" className="np-btn px-4 py-2">Đăng nhập</Link>
                </>
              )}
            </div>
          </div>

          <nav className="flex gap-4 overflow-x-auto border-t border-[#E7E9EE] px-4 py-2 text-sm font-semibold lg:hidden">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} className="whitespace-nowrap hover:text-brand">
                {link.label}
              </Link>
            ))}
          </nav>
        </header>

        <main className="flex-1">{children}</main>

        <section className="mx-auto mt-12 max-w-6xl px-4">
          <div className="flex flex-col items-start justify-between gap-4 rounded-xl bg-brand px-6 py-7 text-white sm:flex-row sm:items-center">
            <div>
              <div className="text-xl font-extrabold">Anh chị có nhà cần bán hoặc cho thuê?</div>
              <div className="mt-1 text-sm text-white/90">Ký gửi miễn phí — chụp ảnh chuyên nghiệp, đăng tin đa kênh, báo cáo khách quan tâm mỗi tuần.</div>
            </div>
            <Link href="/dang-tin" className="whitespace-nowrap rounded-lg bg-white px-5 py-3 font-bold text-brand hover:bg-white/90">Ký gửi ngay</Link>
          </div>
        </section>

        <footer className="mt-12 bg-[#171A22] text-white">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <Image src="/logo.png" alt="Nguồn Nhà Phố HCM" width={40} height={40} className="h-10 w-10 object-contain" />
                <span className="text-base font-bold">Nguồn Nhà Phố HCM</span>
              </div>
              <div className="mt-3 text-sm leading-relaxed text-white/70">
                Chuyên nhà phố, shophouse trung tâm TP.HCM. Kiểm tra pháp lý trước khi đăng — mua bán và cho thuê minh bạch.
              </div>
            </div>

            <div>
              <div className="mb-3 text-sm font-bold uppercase tracking-wide">Khám phá</div>
              <ul className="space-y-2 text-sm text-white/70">
                <li><Link href="/tin-dang" className="hover:text-white">Nhà bán</Link></li>
                <li><Link href="/tin-dang?loai=thue" className="hover:text-white">Nhà cho thuê</Link></li>
                <li><Link href="/tin-tuc" className="hover:text-white">Tin tức</Link></li>
                <li><Link href="/goi-thanh-vien" className="hover:text-white">Bảng giá đăng tin</Link></li>
              </ul>
            </div>

            <div>
              <div className="mb-3 text-sm font-bold uppercase tracking-wide">Khu vực</div>
              <ul className="space-y-2 text-sm text-white/70">
                <li><Link href="/tin-dang?quan=Quận 1" className="hover:text-white">Nhà Quận 1</Link></li>
                <li><Link href="/tin-dang?quan=Quận 3" className="hover:text-white">Nhà Quận 3</Link></li>
                <li><Link href="/tin-dang?quan=Bình Thạnh" className="hover:text-white">Nhà Bình Thạnh</Link></li>
                <li><Link href="/tin-dang?quan=Quận 4" className="hover:text-white">Nhà Quận 4</Link></li>
              </ul>
            </div>

            <div>
              <div className="mb-3 text-sm font-bold uppercase tracking-wide">Ký gửi & liên hệ</div>
              <ul className="space-y-2 text-sm text-white/70">
                <li><Link href="/gioi-thieu" className="hover:text-white">Về Nguồn Nhà Phố & quy trình</Link></li>
                <li><Link href="/tuyen-dung" className="hover:text-white">Tuyển dụng</Link></li>
                <li><Link href="/dang-tin" className="hover:text-white">Đăng tin ký gửi</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 py-4 text-center text-xs text-white/60">
            © {new Date().getFullYear()} Nguồn Nhà Phố HCM. Nhà phố trung tâm TP.HCM.
          </div>
        </footer>
      </body>
    </html>
  );
}
