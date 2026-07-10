import { createClient } from "@/lib/supabase/server";
import { PLANS, formatVND } from "@/lib/plans";
import { createOrder } from "@/app/actions/payment";

export const metadata = { title: "Gói thành viên" };

export default async function GoiThanhVienPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Gói thành viên</h1>
        <p className="mt-2 text-gray-500">
          Nâng cấp để đăng nhiều tin hơn và hiển thị ưu tiên.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PLANS.map((plan) => {
          const isCurrent = currentTier === plan.code;
          return (
            <div
              key={plan.code}
              className={
                "flex flex-col rounded-2xl border bg-white p-6 " +
                (plan.highlight ? "border-brand ring-2 ring-brand" : "")
              }
            >
              {plan.highlight && (
                <span className="mb-2 inline-block w-fit rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">
                  Phổ biến nhất
                </span>
              )}
              <h2 className="text-xl font-bold">{plan.name}</h2>
              <div className="mt-2 text-3xl font-extrabold text-brand">
                {formatVND(plan.price)}
                {plan.price > 0 && (
                  <span className="text-sm font-normal text-gray-400">
                    {" "}/ {plan.days} ngày
                  </span>
                )}
              </div>

              <ul className="mt-4 flex-1 space-y-2 text-sm text-gray-600">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-brand">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                {plan.price === 0 ? (
                  <div className="rounded-lg border py-2 text-center text-sm text-gray-500">
                    Gói mặc định
                  </div>
                ) : isCurrent ? (
                  <div className="rounded-lg bg-green-50 py-2 text-center text-sm font-semibold text-green-700">
                    Gói hiện tại
                  </div>
                ) : (
                  <form action={createOrder}>
                    <input type="hidden" name="plan" value={plan.code} />
                    <button
                      type="submit"
                      className="w-full rounded-lg bg-brand py-3 font-semibold text-white transition hover:opacity-90"
                    >
                      Chọn gói này
                    </button>
                  </form>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {!user && (
        <p className="mt-6 text-center text-sm text-gray-500">
          Bạn cần đăng nhập để nâng cấp gói.
        </p>
      )}
    </main>
  );
}
