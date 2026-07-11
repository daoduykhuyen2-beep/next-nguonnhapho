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

  let avatarUrl: string | null = null;
  if (user) {
    const { data: prof } = await supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", user.id)
      .maybeSingle();
    avatarUrl = (prof?.avatar_url as string) ?? null;
  }

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
                  <Link href="/dang-tin" className="hover:underline">
                    Đăng tin
                  </Link>
                  <Link
                    href="/tai-khoan"
                    className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 hover:bg-gray-100"
                  >
                    {avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={avatarUrl}
                        alt="Tài khoản"
                        className="h-8 w-8 rounded-full border object-cover"
                      />
                    ) : (
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                        {(user.email ?? "U").charAt(0).toUpperCase()}
                      </span>
                    )}
                    <span className="hidden sm:inline">Tài khoản</span>
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
