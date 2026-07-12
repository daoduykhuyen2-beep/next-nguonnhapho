import { createClient } from "@/lib/supabase/server";
import {
  formatVND,
  getEffectivePrice,
  getDiscountPercent,
  isPromoActive,
  type Plan,
} from "@/lib/plans";
import { getPlansMerged } from "@/lib/plans-server";
import { createOrder } from "@/app/actions/payment";

export const metadata = { title: "Bảng giá đăng tin & đẩy tin" };
export const dynamic = "force-dynamic";

const GROUPS: { key: Plan["group"]; title: string; icon: string; note?: string }[] = [
  {
    key: "LE",
    title: "Mua lẻ theo tin",
    icon: "🛒",
    note: "Dành cho khách hàng có nhu cầu bán nhà",
  },
  { key: "DAY", title: "Đẩy tin — làm mới tin lên đầu danh sách", icon: "🚀" },
  {
    key: "COMBO",
    title: "Gói combo tháng — tiết kiệm cho người đăng nhiều",
    icon: "📦",
    note: "Dành cho nhà môi giới",
  },
];

const STEPS = [
  {
    n: "1",
    title: "Chọn gói & chuyển khoản QR",
    desc: "Nội dung chuyển khoản ghi đúng mã đơn hiển thị trên màn hình.",
  },
  {
    n: "2",
    title: "Quản trị duyệt đơn",
    desc: "Đơn được xác nhận thủ công trong giờ làm việc — quyền lợi cộng vào tài khoản của anh/chị.",
  },
  {
    n: "3",
    title: "Đăng tin trong Tài khoản",
    desc: "Điền thông tin căn nhà, chọn hạng tin muốn dùng từ quyền lợi đã mua.",
  },
  {
    n: "4",
    title: "Tin được kiểm duyệt & lên trang",
    desc: "Mọi tin đều qua kiểm tra để giữ chất lượng kho — tin ảo, sai pháp lý bị từ chối.",
  },
];

function discountPct(price: number, market?: number) {
  if (!market || market <= price) return null;
  return Math.round((1 - price / market) * 100);
}

function PlanCard({ plan, disabled, postId }: { plan: Plan; disabled: boolean; postId?: number | null }) {
  const effPrice = getEffectivePrice(plan);
  const promoOn = isPromoActive(plan);
  const pct = promoOn
    ? getDiscountPercent(plan)
    : discountPct(plan.price, plan.marketPrice);
  return (
    <div
      className={
        "relative flex flex-col rounded-2xl border bg-white p-6 " +
        (plan.highlight
          ? "border-brand shadow-sm ring-1 ring-brand"
          : "border-gray-200")
      }
    >
      {plan.badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand px-4 py-1 text-xs font-bold uppercase tracking-wide text-white">
          {plan.badge}
        </span>
      )}
      <h3 className="text-sm font-bold uppercase tracking-wide text-gray-700">
        {plan.name}
      </h3>
      <div className="mt-3 text-3xl font-extrabold text-gray-900">
        {formatVND(effPrice)}
        {plan.unit && (
          <span className="text-base font-medium text-gray-400"> {plan.unit}</span>
        )}
      </div>
      {promoOn && plan.promoLabel && (
        <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600">
          🔥 {plan.promoLabel}
          {plan.promoUntil && (
            <span className="font-normal text-red-400">– đến {plan.promoUntil}</span>
          )}
        </div>
      )}
      {plan.marketPrice && (
        <div className="mt-1 text-sm text-gray-400">
          <span className="line-through">
            Thị trường ~{formatVND(plan.marketPrice)}
          </span>
          {pct && <span className="ml-1 font-semibold text-brand">−{pct}%</span>}
        </div>
      )}
      <ul className="mt-5 flex-1 space-y-3 text-sm text-gray-700">
        {plan.features.map((f) => (
          <li
            key={f}
            className="flex gap-2 border-b border-dashed border-gray-100 pb-3 last:border-0"
          >
            <span className="mt-0.5 text-brand">✓</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <div className="mt-6">
        {disabled ? (
          <div className="rounded-lg border py-3 text-center text-sm text-gray-500">
            Gói hiện tại
          </div>
        ) : (
          <form action={createOrder}>
            <input type="hidden" name="plan" value={plan.code} />
            {postId ? <input type="hidden" name="post_id" value={postId} /> : null}
            <button
              type="submit"
              className={
                "w-full rounded-lg py-3 font-semibold transition hover:opacity-90 " +
                (plan.highlight
                  ? "bg-brand text-white"
                  : "border border-brand text-brand hover:bg-green-50")
              }
            >
              {plan.group === "COMBO" ? "Đăng ký gói" : "Mua ngay"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default async function GoiThanhVienPage({
  searchParams,
}: {
  searchParams: Promise<{ post?: string }>;
}) {
  const sp = await searchParams;
  const postId = sp.post ? Number(sp.post) : null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const plans = await getPlansMerged();

  let currentTier = "FREE";
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("membership_tier")
      .eq("id", user.id)
      .maybeSingle();
    if (profile?.membership_tier) currentTier = profile.membership_tier;
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 text-gray-900">
      <nav className="mb-4 text-sm text-gray-500">
        Trang chủ / <span className="text-gray-700">Bảng giá đăng tin</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-extrabold sm:text-4xl">
          Bảng giá <span className="text-brand">đăng tin &amp; đẩy tin</span>
        </h1>
        <p className="mt-3 max-w-3xl text-gray-600">
          Dành cho chủ nhà ký gửi muốn nâng tin nổi bật và môi giới muốn đăng tin
          trên Nguồn Nhà Phố HCM. Thanh toán chuyển khoản QR — tin được duyệt thủ
          công để giữ chất lượng kho hàng.
        </p>
      </header>

      {postId ? (
        <div className="mb-6 rounded-xl border border-brand/30 bg-brand/5 px-4 py-3 text-sm text-gray-700">
          Bạn đang chọn gói cho tin <b>#{postId}</b>. Sau khi thanh toán được xác nhận, tin của bạn sẽ tự động được nâng cấp hoặc đẩy lên đầu danh sách.
        </div>
      ) : null}

      <div className="mb-10 rounded-2xl border border-green-200 bg-green-50 p-6">
        <p className="text-lg font-bold text-brand">
          Cam kết rẻ hơn 30% so với mặt bằng thị trường
        </p>
        <p className="mt-1 text-sm text-gray-600">
          Cùng hạng tin VIP, cùng cơ chế đẩy tin — chi phí chỉ bằng 70% nền tảng
          lớn. Giá thị trường tham chiếu hiển thị gạch ngang tại từng gói.
        </p>
      </div>

      {GROUPS.map((g) => {
        const list = plans.filter((p) => p.group === g.key);
        if (!list.length) return null;
        return (
          <section key={g.key} className="mb-12">
            <h2 className="mb-2 flex items-center gap-2 text-xl font-bold">
              <span>{g.icon}</span> {g.title}
            </h2>
            {g.note ? (
              <p className="mb-6 text-sm font-medium text-brand">{g.note}</p>
            ) : (
              <div className="mb-6" />
            )}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {list.map((plan) => (
                <PlanCard
                  key={plan.code}
                  plan={plan}
                  disabled={currentTier === plan.code}
                  postId={postId}
                />
              ))}
            </div>
          </section>
        );
      })}

      <section className="rounded-2xl border border-gray-200 bg-white p-8">
        <h2 className="text-xl font-bold">Quy trình 4 bước</h2>
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {STEPS.map((s) => (
            <div key={s.n} className="rounded-xl bg-green-50 p-5">
              <h3 className="font-bold text-brand">
                {s.n}. {s.title}
              </h3>
              <p className="mt-2 text-sm text-gray-700">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {!user && (
        <p className="mt-8 text-center text-sm text-gray-500">
          Bạn cần đăng nhập để mua gói và đăng tin.
        </p>
      )}
    </main>
  );
}
