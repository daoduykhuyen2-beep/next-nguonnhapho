import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";
import { createClient } from "@/lib/supabase/server";
import HeaderActions from "@/components/HeaderActions";

export const metadata: Metadata = {
  metadataBase: new URL("https://nguonnhaphohcm.vn"),
  title: {
    default: "Nguá»n NhÃ  Phá» HCM â Mua bÃ¡n, cho thuÃª nhÃ  phá» trung tÃ¢m SÃ i GÃ²n",
    template: "%s | Nguá»n NhÃ  Phá» HCM",
  },
  description:
    "KÃªnh ÄÄng tin mua bÃ¡n, cho thuÃª nhÃ  phá», shophouse, cÄn há», Äáº¥t ná»n trung tÃ¢m TP. Há» ChÃ­ Minh. GiÃ¡ tháº­t, phÃ¡p lÃ½ rÃµ rÃ ng, uy tÃ­n.",
  icons: {
    icon: "/logo-black.png",
    shortcut: "/logo-black.png",
    apple: "/logo-black.png",
  },
  openGraph: {
    title: "Nguá»n NhÃ  Phá» HCM",
    description: "Mua bÃ¡n, cho thuÃª nhÃ  phá» trung tÃ¢m SÃ i GÃ²n â phÃ¡p lÃ½ rÃµ rÃ ng.",
    images: ["/logo.png"],
  },
};

const navLinks = [
  { href: "/tin-dang", label: "NhÃ  bÃ¡n" },
  { href: "/tin-dang?loai=thue", label: "NhÃ  cho thuÃª" },
  { href: "/tin-tuc", label: "Tin tá»©c" },
  { href: "/goi-thanh-vien", label: "Báº£ng giÃ¡" },
  { href: "/gioi-thieu", label: "Giá»i thiá»u" },
  { href: "/tuyen-dung", label: "Tuyá»n dá»¥ng" },
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
  let notifications: { id: string; cat: "tin" | "taichinh" | "khuyenmai" | "them"; title: string; body: string; date: string; read: boolean }[] = [];
  if (user) {
    const { data: prof } = await supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", user.id)
      .maybeSingle();
    avatarUrl = (prof?.avatar_url as string) ?? null;

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
        title: n.tieu_de || "Thông báo",
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
        <header className="sticky top-0 z-40 border-b border-gray-200 bg-white text-black shadow-sm">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo-black.png"
                alt="Nguá»n NhÃ  Phá» HCM"
                width={44}
                height={44}
                className="h-11 w-11 object-contain"
                priority
              />
              <span className="flex flex-col leading-tight">
                <span className="text-lg font-extrabold">Nguá»n NhÃ  Phá»</span>
                <span className="text-xs font-semibold uppercase tracking-wide text-[#667082]">Trung tÃ¢m HCM</span>
              </span>
            </Link>

            <nav className="hidden flex-wrap items-center gap-6 text-sm font-semibold lg:flex">
              {navLinks.map((link) => (
                <Link key={link.label} href={link.href} className="hover:text-brand">
                  {link.label}
                </Link>
              ))}
            </nav>

            <HeaderActions user={user} avatarUrl={avatarUrl} notifications={notifications} />
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
                <Image src="/logo.png" alt="Nguá»n NhÃ  Phá» HCM" width={40} height={40} className="h-10 w-10 object-contain" />
                <span className="text-base font-bold">Nguá»n NhÃ  Phá» HCM</span>
              </div>
              <div className="mt-3 text-sm leading-relaxed text-white/70">
                ChuyÃªn nhÃ  phá», shophouse trung tÃ¢m TP.HCM. Kiá»m tra phÃ¡p lÃ½ trÆ°á»c khi ÄÄng â mua bÃ¡n vÃ  cho thuÃª minh báº¡ch.
              </div>
            </div>

            <div>
              <div className="mb-3 text-sm font-bold uppercase tracking-wide">KhÃ¡m phÃ¡</div>
              <ul className="space-y-2 text-sm text-white/70">
                <li><Link href="/tin-dang" className="hover:text-white">NhÃ  bÃ¡n</Link></li>
                <li><Link href="/tin-dang?loai=thue" className="hover:text-white">NhÃ  cho thuÃª</Link></li>
                <li><Link href="/tin-tuc" className="hover:text-white">Tin tá»©c</Link></li>
                <li><Link href="/goi-thanh-vien" className="hover:text-white">Báº£ng giÃ¡ ÄÄng tin</Link></li>
              </ul>
            </div>

            <div>
              <div className="mb-3 text-sm font-bold uppercase tracking-wide">Khu vá»±c</div>
              <ul className="space-y-2 text-sm text-white/70">
                <li><Link href="/tin-dang?quan=Quáº­n 1" className="hover:text-white">NhÃ  Quáº­n 1</Link></li>
                <li><Link href="/tin-dang?quan=Quáº­n 3" className="hover:text-white">NhÃ  Quáº­n 3</Link></li>
                <li><Link href="/tin-dang?quan=BÃ¬nh Tháº¡nh" className="hover:text-white">NhÃ  BÃ¬nh Tháº¡nh</Link></li>
                <li><Link href="/tin-dang?quan=Quáº­n 4" className="hover:text-white">NhÃ  Quáº­n 4</Link></li>
              </ul>
            </div>

            <div>
              <div className="mb-3 text-sm font-bold uppercase tracking-wide">KÃ½ gá»­i & liÃªn há»</div>
              <ul className="space-y-2 text-sm text-white/70">
                <li><Link href="/gioi-thieu" className="hover:text-white">Vá» Nguá»n NhÃ  Phá» & quy trÃ¬nh</Link></li>
                <li><Link href="/tuyen-dung" className="hover:text-white">Tuyá»n dá»¥ng</Link></li>
                <li><Link href="/dang-tin" className="hover:text-white">ÄÄng tin kÃ½ gá»­i</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 py-4 text-center text-xs text-white/60">
            Â© {new Date().getFullYear()} Nguá»n NhÃ  Phá» HCM. NhÃ  phá» trung tÃ¢m TP.HCM.
          </div>
        </footer>
      </body>
    </html>
  );
}
