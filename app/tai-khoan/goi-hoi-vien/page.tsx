import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Goi hoi vien" };
export const dynamic = "force-dynamic";

type Tier = {
  key: string;
  name: string;
  price: string;
  period: string;
  desc: string;
  highlight?: boolean;
  badge?: string;
  features: string[];
};

const TIERS: Tier[] = [
  {
    key: "basic",
    name: "Hoi vien Co ban",
    price: "Mien phi",
    period: "",
    desc: "Danh cho ca nhan moi bat dau dang tin.",
    features: [
      "Dang tin thuong khong gioi han",
      "Quan ly tin dang co ban",
      "Nhan lien he tu khach hang",
      "Ho tro qua email",
    ],
  },
  {
    key: "pro",
    name: "Hoi vien Pro",
    price: "299.000d",
    period: "/thang",
    desc: "Danh cho moi gioi ca nhan can nhieu hon.",
    highlight: true,
    badge: "Duoc chon nhieu",
    features: [
      "Tat ca quyen loi goi Co ban",
      "Huy hieu Moi gioi da xac thuc",
      "Uu tien hien thi tin dang",
      "Bao cao hieu qua tin dang",
      "Quan ly khach hang tiem nang",
      "Ho tro uu tien qua hotline",
    ],
  },
  {
    key: "business",
    name: "Hoi vien Business",
    price: "899.000d",
    period: "/thang",
    desc: "Danh cho doanh nghiep va san giao dich.",
    features: [
      "Tat ca quyen loi goi Pro",
      "Trang thuong hieu doanh nghiep",
      "Nhieu tai khoan quan ly",
      "Uu dai combo day tin so luong lon",
      "Quan ly nhan vien va phan quyen",
      "Ho tro rieng 24/7",
    ],
  },
];

function formatDate(d: string | null) {
  if (!d) return "--";
  try {
    return new Date(d).toLocaleDateString("vi-VN");
  } catch {
    return "--";
  }
}

export default async function GoiHoiVienPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/dang-nhap");

  const { data: profile } = await supabase
    .from("profiles")
    .select("membership_tier, membership_expires_at")
    .eq("id", user.id)
    .maybeSingle();

  const current = profile?.membership_tier ?? "free";
  const expires = profile?.membership_expires_at ?? null;
  const isPaid = current && current !== "free";

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="mb-1 text-2xl font-extrabold">Goi hoi vien</h1>
        <p className="mb-6 text-sm text-gray-500">
          Nang cap hoi vien de mo khoa quyen loi, tang do phu tin dang va tiep
          can nhieu khach hang hon.
        </p>

        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-sm text-gray-500">Goi hien tai</div>
              <div className="mt-0.5 text-lg font-bold">
                {isPaid ? current : "Hoi vien Co ban (Mien phi)"}
              </div>
              {isPaid ? (
                <div className="mt-0.5 text-sm text-gray-500">
                  Hieu luc den: {formatDate(expires)}
                </div>
              ) : null}
            </div>
            <span
              className={
                "rounded-full px-3 py-1 text-sm font-semibold " +
                (isPaid
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-gray-100 text-gray-600")
              }
            >
              {isPaid ? "Dang kich hoat" : "Chua nang cap"}
            </span>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {TIERS.map((t) => {
            const active = current === t.key;
            return (
              <div
                key={t.key}
                className={
                  "relative flex flex-col rounded-2xl border bg-white p-6 shadow-sm " +
                  (t.highlight
                    ? "border-emerald-500 ring-1 ring-emerald-500"
                    : "border-gray-200")
                }
              >
                {t.badge ? (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
                    {t.badge}
                  </span>
                ) : null}
                <h3 className="text-lg font-bold">{t.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{t.desc}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold text-emerald-600">
                    {t.price}
                  </span>
                  {t.period ? (
                    <span className="text-sm text-gray-400">{t.period}</span>
                  ) : null}
                </div>
                <ul className="mt-4 flex-1 space-y-2 text-sm text-gray-700">
                  {t.features.map((f, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-emerald-600">+</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                {active ? (
                  <span className="mt-6 block rounded-xl bg-gray-100 py-2.5 text-center text-sm font-semibold text-gray-500">
                    Goi hien tai
                  </span>
                ) : t.key === "basic" ? (
                  <span className="mt-6 block rounded-xl border border-gray-300 py-2.5 text-center text-sm font-semibold text-gray-600">
                    Mac dinh
                  </span>
                ) : (
                  <Link
                    href="/goi-thanh-vien"
                    className={
                      "mt-6 block rounded-xl py-2.5 text-center text-sm font-semibold transition " +
                      (t.highlight
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                        : "border border-emerald-600 text-emerald-700 hover:bg-emerald-50")
                    }
                  >
                    Nang cap ngay
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          Xem chi tiet bang gia dang tin va day tin tai{" "}
          <Link href="/goi-thanh-vien" className="font-semibold text-emerald-700 underline">
            trang Bang gia
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
