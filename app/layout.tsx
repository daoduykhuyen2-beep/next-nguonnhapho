import type { Metadata, Viewport } from "next";
import Script from "next/script";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";
import { createClient } from "@/lib/supabase/server";
import HeaderActions from "@/components/HeaderActions";
import PWARegister from "@/components/PWARegister";
import PageViewTracker from "@/components/PageViewTracker";
import FloatingContact from "@/components/FloatingContact";
import Toast from "@/components/Toast";

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
  manifest: "/manifest.json",
  applicationName: "Nhà Phố HCM",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Nhà Phố HCM",
  },
};

export const viewport: Viewport = {
  themeColor: "#c8102e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const navLinks = [
  { href: "/tin-dang?loai=ban", label: "Nhà bán" },
  { href: "/tin-dang?loai=thue", label: "Nhà cho thuê" },
  { href: "/du-an", label: "Dự án & Chung cư" },
  { href: "/tin-tuc", label: "Tin tức" },
  { href: "/goi-thanh-vien", label: "Bảng giá" },
  { href: "/gioi-thieu", label: "Giới thiệu" },
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
  let displayName: string | null = null;
  let notifications: { id: string; cat: "tin" | "taichinh" | "khuyenmai" | "them"; title: string; body: string; date: string; read: boolean }[] = [];
  if (user) {
    const { data: prof } = await supabase
      .from("profiles")
      .select("avatar_url, full_name")
      .eq("id", user.id)
      .maybeSingle();
    avatarUrl = (prof?.avatar_url as string) ?? null;
    displayName = (prof?.full_name as string) ?? null;

    const { data: notiRows } = await supabase
      .from("notifications")
      .select("id, tieu_de, noi_dung, loai, da_doc, created_at, target_user")
      .or(`target_user.is.null,target_user.eq.${user.id}`)
      .order("created_at", { ascending: false })
      .limit(20);
    if (notiRows) {
      const catMap: Record<string, "tin" | "taichinh" | "khuyenmai" | "them"> = {
        tin: "tin",
        tin_dang: "tin",
        taichinh: "taichinh",
        tai_chinh: "taichinh",
        khuyenmai: "khuyenmai",
        khuyen_mai: "khuyenmai",
        he_thong: "them",
        system: "them",
      };
      notifications = notiRows.map((n) => ({
        id: String(n.id),
        cat: catMap[(n.loai || "").toString()] || "them",
        title: n.tieu_de || "Th�ng b�o",
        body: n.noi_dung || "",
        date: n.created_at
          ? new Date(n.created_at).toLocaleDateString("vi-VN")
          : "",
        read: !!n.da_doc,
      }));
    }
  }

  return (
    <html lang="vi">
      <body className="flex min-h-screen flex-col bg-white text-black">
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1337313717244533"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
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

            <HeaderActions user={user} avatarUrl={avatarUrl} displayName={displayName} notifications={notifications} />
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

      <footer className="mt-12 border-t border-gray-200 bg-gray-50 text-gray-700">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <Image src="/logo-black.png" alt="Nguồn Nhà Phố HCM" width={40} height={40} className="h-10 w-10 object-contain" />
                <span className="text-base font-bold text-gray-900">Nguồn Nhà Phố HCM</span>
              </div>
              <div className="mt-3 text-sm leading-relaxed text-gray-500">
                Chuyên nhà phố, shophouse trung tâm TP.HCM. Kiểm tra pháp lý trước khi đăng — mua bán và cho thuê minh bạch, uy tín.
              </div>
            </div>

            <div>
              <div className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-900">Khám phá</div>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="/tin-dang" className="transition-colors hover:text-brand">Nhà bán</Link></li>
                <li><Link href="/tin-dang?loai=thue" className="transition-colors hover:text-brand">Nhà cho thuê</Link></li>
                <li><Link href="/du-an" className="transition-colors hover:text-brand">Dự án & Chung cư</Link></li>
                <li><Link href="/tin-tuc" className="transition-colors hover:text-brand">Tin tức</Link></li>
                <li><Link href="/goi-thanh-vien" className="transition-colors hover:text-brand">Bảng giá đăng tin</Link></li>
              </ul>
            </div>

            <div>
              <div className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-900">Khu vực</div>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="/tin-dang?quan=Quận 1" className="transition-colors hover:text-brand">Nhà Quận 1</Link></li>
                <li><Link href="/tin-dang?quan=Quận 3" className="transition-colors hover:text-brand">Nhà Quận 3</Link></li>
                <li><Link href="/tin-dang?quan=Bình Thạnh" className="transition-colors hover:text-brand">Nhà Bình Thạnh</Link></li>
                <li><Link href="/tin-dang?quan=Quận 4" className="transition-colors hover:text-brand">Nhà Quận 4</Link></li>
              </ul>
            </div>

            <div>
              <div className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-900">Ký gửi & liên hệ</div>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="/gioi-thieu" className="transition-colors hover:text-brand">Về Nguồn Nhà Phố & quy trình</Link></li>
                <li><Link href="/tuyen-dung" className="transition-colors hover:text-brand">Tuyển dụng</Link></li>
                <li><Link href="/dang-tin" className="transition-colors hover:text-brand">Đăng tin ký gửi</Link></li>
                      <li><Link href="/quy-che" className="transition-colors hover:text-brand">Quy chế đăng tin</Link></li>
              <li><Link href="/chinh-sach-bao-mat" className="transition-colors hover:text-brand">Chính sách bảo mật</Link></li>
              </ul>
            </div>
          </div>
        <div className="border-t border-gray-200">
            <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-6">
              <a
                href="https://online.gov.vn/Home/WebDetails/5480"
                target="_blank"
                rel="noopener noreferrer nofollow"
                aria-label="Đã đăng ký Bộ Công Thương"
                className="opacity-90 transition-opacity hover:opacity-100"
              >
                <Image
                  src="/bo-cong-thuong.png"
                  alt="Đã đăng ký Bộ Công Thương"
                  width={160}
                  height={60}
                  className="h-auto w-40 object-contain"
                />
              </a>
              <div className="text-center text-xs text-gray-500">
                © {new Date().getFullYear()} Nguồn Nhà Phố HCM. Bảo lưu mọi quyền.
              </div>
            </div>
          </div>
        </footer>
        <PWARegister />
        <PageViewTracker />
              <FloatingContact />
        <Toast />
      </body>
    </html>
  );
}
