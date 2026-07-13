import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";
import { PLANS, formatVND, getEffectivePrice } from "@/lib/plans";

export const metadata = { title: "Môi giới chuyên nghiệp" };
export const dynamic = "force-dynamic";

const QUYEN_LOI = [
  {
    icon: "🏆",
    title: "Huy hiệu môi giới xác thực",
    desc: "Tin đăng gắn nhãn tin cậy, tăng tỷ lệ khách liên hệ và chốt giao dịch.",
  },
  {
    icon: "🚀",
    title: "Ưu tiên hiển thị & đẩy tin",
    desc: "Tin của bạn luôn nằm nhóm đầu danh sách, tiếp cận nhiều khách hơn.",
  },
  {
    icon: "📊",
    title: "Thống kê hiệu quả tin đăng",
    desc: "Theo dõi lượt xem, lượng khách quan tâm để tối ưu nội dung tin.",
  },
  {
    icon: "☎️",
    title: "Gom khách quan tâm về một nơi",
    desc: "Số điện thoại khách để lại trên tin được tổng hợp ở mục Quản lý khách hàng.",
  },
  {
    icon: "⚡",
    title: "Duyệt tin ưu tiên",
    desc: "Tin được xét duyệt nhanh trong giờ làm việc, lên sóng sớm hơn.",
  },
  {
    icon: "🎓",
    title: "Hỗ trợ & đào tạo nghiệp vụ",
    desc: "Cẩm nang pháp lý, kỹ năng chốt sale và tư vấn từ đội ngũ chuyên môn.",
  },
];

export default async function MoiGioiPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/dang-nhap?next=/tai-khoan/moi-gioi");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();
  const p = profile as Profile | null;

  const tier = p?.membership_tier || null;
  const isPro = !!tier && tier !== "Miễn phí";
  const expires = p?.membership_expires_at
    ? new Date(p.membership_expires_at).toLocaleDateString("vi-VN")
    : null;

  const combos = PLANS.filter((pl) => pl.group === "COMBO");

  // Quyen loi con lai cua nguoi dung (tru dan khi su dung, het thi nap them)
  const quotaThuong = p?.quota_thuong ?? 0;
  const quotaVip = p?.quota_vip ?? 0;
  const quotaKimCuong = p?.quota_kim_cuong ?? 0;
  const quotaDay = p?.quota_day ?? 0;
  const quotaItems = [
    { label: "Tin Thường", value: quotaThuong, color: "text-gray-800", ring: "ring-gray-200" },
    { label: "Tin VIP Vàng", value: quotaVip, color: "text-amber-600", ring: "ring-amber-200" },
    { label: "Tin Kim Cương", value: quotaKimCuong, color: "text-sky-600", ring: "ring-sky-200" },
    { label: "Lượt đẩy tin", value: quotaDay, color: "text-emerald-600", ring: "ring-emerald-200" },
  ];
  const tongQuota = quotaThuong + quotaVip + quotaKimCuong + quotaDay;

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Môi giới chuyên nghiệp</h1>
            <p className="mt-1 text-sm text-gray-500">
              Bộ công cụ giúp bạn bán nhà nhanh hơn và xây dựng thương hiệu cá nhân.
            </p>
          </div>
          <Link href="/tai-khoan" className="text-sm text-brand hover:underline">
            ← Về tài khoản
          </Link>
        </div>

        <div
          className={
            "mb-8 flex flex-col gap-3 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between " +
            (isPro
              ? "bg-emerald-50 ring-1 ring-emerald-100"
              : "bg-white ring-1 ring-gray-200")
          }
        >
          <div>
            <p className="text-sm text-gray-500">Trạng thái tài khoản</p>
            <p className="text-lg font-extrabold text-gray-900">
              {isPro ? "Môi giới chuyên nghiệp — " + tier : "Tài khoản thường"}
            </p>
            {isPro && expires ? (
              <p className="text-sm text-emerald-700">Hiệu lực đến {expires}</p>
            ) : (
              <p className="text-sm text-gray-500">
                Nâng cấp để mở khóa toàn bộ quyền lợi môi giới.
              </p>
            )}
          </div>
          <Link
            href="/goi-thanh-vien"
            className="rounded-xl bg-brand px-5 py-2.5 text-center text-sm font-bold text-white transition hover:opacity-90"
          >
            {isPro ? "Gia hạn / nâng cấp" : "Nâng cấp ngay"}
          </Link>
        </div>

        {/* Quyền lợi còn lại của combo tháng — tự trừ khi sử dụng */}
        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">Quyền lợi còn lại</h2>
            <Link
              href="/tai-khoan/nap-tien"
              className="text-sm font-semibold text-brand hover:underline"
            >
              + Nạp thêm
            </Link>
          </div>
          {tongQuota > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {quotaItems.map((it) => (
                <div
                  key={it.label}
                  className={
                    "flex flex-col items-center justify-center rounded-2xl bg-white px-3 py-5 text-center ring-1 " +
                    it.ring
                  }
                >
                  <span className={"text-3xl font-extrabold " + it.color}>
                    {it.value}
                  </span>
                  <span className="mt-1 text-xs font-medium text-gray-500">
                    {it.label}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-white px-5 py-6 text-center ring-1 ring-gray-200">
              <p className="text-sm text-gray-500">
                Bạn chưa có quyền lợi nào. Mua combo tháng để nhận tin Thường,
                tin VIP, tin Kim Cương và lượt đẩy tin.
              </p>
              <Link
                href="/goi-thanh-vien"
                className="mt-3 inline-block rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
              >
                Xem các gói combo
              </Link>
            </div>
          )}
          <p className="mt-3 text-xs text-gray-400">
            Mỗi lần đăng tin / đẩy tin sẽ tự trừ vào quyền lợi tương ứng. Khi hết,
            hệ thống sẽ trừ tiền trong ví; hết tiền thì cần nạp thêm.
          </p>
        </div>

        <h2 className="mb-4 text-lg font-bold text-gray-800">
          Quyền lợi môi giới chuyên nghiệp
        </h2>
        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {QUYEN_LOI.map((q) => (
            <div
              key={q.title}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="mb-2 text-2xl">{q.icon}</div>
              <p className="font-semibold text-gray-900">{q.title}</p>
              <p className="mt-1 text-sm text-gray-500">{q.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="mb-4 text-lg font-bold text-gray-800">
          Gói combo dành cho môi giới
        </h2>
        <div className="grid gap-5 lg:grid-cols-3">
          {combos.map((pl) => {
            const price = getEffectivePrice(pl);
            return (
              <div
                key={pl.code}
                className={
                  "flex flex-col rounded-2xl border bg-white p-6 shadow-sm " +
                  (pl.highlight
                    ? "border-brand ring-2 ring-brand/20"
                    : "border-gray-100")
                }
              >
                {pl.badge ? (
                  <span className="mb-2 inline-block w-fit rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand">
                    {pl.badge}
                  </span>
                ) : null}
                <p className="text-lg font-extrabold text-gray-900">{pl.name}</p>
                <div className="mt-2 flex items-end gap-2">
                  <span className="text-2xl font-extrabold text-brand">
                    {formatVND(price)}
                  </span>
                  <span className="pb-1 text-sm text-gray-400">
                    {pl.unit || ""}
                  </span>
                </div>
                {pl.marketPrice ? (
                  <span className="text-sm text-gray-400 line-through">
                    {formatVND(pl.marketPrice)}
                  </span>
                ) : null}
                <ul className="mt-4 flex-1 space-y-2 text-sm text-gray-600">
                  {pl.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className="text-emerald-500">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/goi-thanh-vien"
                  className={
                    "mt-5 rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition " +
                    (pl.highlight
                      ? "bg-brand text-white hover:opacity-90"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-50")
                  }
                >
                  Chọn gói này
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
