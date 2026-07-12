import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Goi hoi vien" };
export const dynamic = "force-dynamic";

type Tier = {
  key: string;
  name: string;
  price: string;
  oldPrice?: string;
  period: string;
  desc: string;
  highlight?: boolean;
  badge?: string;
  features: string[];
};

const TIERS: Tier[] = [
  {
    key: "basic",
    name: "Gói Cơ bản",
    price: "299.000đ",
    oldPrice: "425.000đ",
    period: "/tháng",
    desc: "Dành cho môi giới cá nhân bắt đầu đăng tin.",
    features: [
      "15 tin Thường (15 ngày/tin)",
      "5 lượt đẩy tin",
      "Duyệt tin ưu tiên trong 4 giờ làm việc",
    ],
  },
  {
    key: "pro",
    name: "Gói Chuyên nghiệp",
    price: "2.490.000đ",
    oldPrice: "3.685.000đ",
    period: "/tháng",
    desc: "Dành cho môi giới chuyên nghiệp cần hiệu quả cao.",
    highlight: true,
    badge: "Tiết kiệm nhất",
    features: [
      "30 tin Thường (15 ngày/tin)",
      "5 tin VIP Vàng (15 ngày/tin)",
      "15 lượt đẩy tin",
      "Duyệt tin ưu tiên trong 4 giờ làm việc",
      "Huy hiệu tin từ đối tác xác thực",
    ],
  },
  {
    key: "business",
    name: "Gói VIP Toàn diện",
    price: "7.490.000đ",
    oldPrice: "11.705.000đ",
    period: "/tháng",
    desc: "Dành cho doanh nghiệp và sàn giao dịch.",
    features: [
      "50 tin Thường (15 ngày/tin)",
      "10 tin VIP Vàng (10 ngày/tin)",
      "5 tin VIP Kim Cương (10 ngày/tin)",
      "30 lượt đẩy tin",
      "Duyệt tin ưu tiên trong 4 giờ làm việc",
      "Huy hiệu tin từ đối tác xác thực",
      "Hỗ trợ viết nội dung tin chuẩn SEO",
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
                {t.oldPrice ? (
                  <div className="mt-0.5 text-sm text-gray-400 line-through">
                    {t.oldPrice}
                  </div>
                ) : null}
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
