import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/types";
import { formatGia } from "@/components/PostCard";
import DeletePostButton from "@/components/DeletePostButton";
import { createOrder } from "@/app/actions/payment";

export const metadata = { title: "Tin của tôi" };

export default async function TinCuaToiPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/dang-nhap?next=/tai-khoan/tin-cua-toi");

  const { data } = await supabase
    .from("web_posts")
    .select("*")
    .eq("owner", user.id)
    .order("created_at", { ascending: false });

  const posts = (data as Post[]) ?? [];

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tin của tôi</h1>
        <Link
          href="/dang-tin"
          className="rounded-lg bg-brand px-4 py-2 font-semibold text-white"
        >
          + Đăng tin
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="rounded-lg border bg-white p-6 text-gray-500">
          Bạn chưa đăng tin nào.
        </p>
      ) : (
        <div className="space-y-3">
          {posts.map((p) => (
            <div
              key={p.id}
              className="rounded-lg border bg-white p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <Link
                    href={`/tin-dang/${p.id}`}
                    className="line-clamp-1 font-semibold hover:text-brand"
                  >
                    {p.title ?? "(Không có tiêu đề)"}
                  </Link>
                  <p className="text-sm text-brand">{formatGia(p.gia)}</p>
                  <p className="mt-0.5 text-xs">
                    {p.status === "kim_cuong" ? (
                      <span className="font-semibold text-indigo-600">💎 VIP Kim Cương</span>
                    ) : p.status === "vang" ? (
                      <span className="font-semibold text-amber-600">🏅 VIP Vàng</span>
                    ) : (
                      <span className="text-gray-400">Tin thường</span>
                    )}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Link
                    href={`/dang-tin?post=${p.id}`}
                    className="rounded-lg border border-brand px-3 py-1.5 text-xs font-semibold text-brand hover:bg-brand hover:text-white"
                  >
                    Sửa
                  </Link>
                  <DeletePostButton id={p.id} />
                </div>
              </div>

              {/* Nâng cấp & Đẩy tin cho ĐÚNG tin này */}
              <details className="mt-3 rounded-lg bg-gray-50 p-3">
                <summary className="cursor-pointer select-none text-sm font-semibold text-brand">
                  ⚡ Nâng cấp / Đẩy tin này
                </summary>

                <p className="mt-2 text-xs text-gray-500">
                  Bạn đang thao tác với tin:{" "}
                  <span className="font-semibold text-gray-700">
                    {p.title ?? "(Không có tiêu đề)"}
                  </span>
                </p>

                {/* 1) Nâng cấp hạng tin */}
                <div className="mt-3">
                  <p className="mb-1.5 text-xs font-semibold text-gray-600">
                    1) Nâng cấp hạng tin
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <form action={createOrder}>
                      <input type="hidden" name="plan" value="VIP_VANG_7" />
                      <input type="hidden" name="post_id" value={p.id} />
                      <button
                        type="submit"
                        className="rounded-lg border border-amber-500 px-3 py-1.5 text-xs font-semibold text-amber-600 hover:bg-amber-500 hover:text-white"
                      >
                        🏅 Lên VIP Vàng
                      </button>
                    </form>
                    <form action={createOrder}>
                      <input type="hidden" name="plan" value="VIP_KC_7" />
                      <input type="hidden" name="post_id" value={p.id} />
                      <button
                        type="submit"
                        className="rounded-lg border border-indigo-500 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-500 hover:text-white"
                      >
                        💎 Lên VIP Kim Cương
                      </button>
                    </form>
                  </div>
                </div>

                {/* 2) Đẩy tin lên đầu */}
                <div className="mt-3">
                  <p className="mb-1.5 text-xs font-semibold text-gray-600">
                    2) Đẩy tin lên đầu (lượt đẩy)
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <form action={createOrder}>
                      <input type="hidden" name="plan" value="DAY_1" />
                      <input type="hidden" name="post_id" value={p.id} />
                      <button
                        type="submit"
                        className="rounded-lg border border-brand px-3 py-1.5 text-xs font-semibold text-brand hover:bg-brand hover:text-white"
                      >
                        🚀 Đẩy 1 lượt
                      </button>
                    </form>
                    <form action={createOrder}>
                      <input type="hidden" name="plan" value="DAY_3" />
                      <input type="hidden" name="post_id" value={p.id} />
                      <button
                        type="submit"
                        className="rounded-lg border border-brand px-3 py-1.5 text-xs font-semibold text-brand hover:bg-brand hover:text-white"
                      >
                        🚀 Đẩy 3 lượt
                      </button>
                    </form>
                    <form action={createOrder}>
                      <input type="hidden" name="plan" value="DAY_6" />
                      <input type="hidden" name="post_id" value={p.id} />
                      <button
                        type="submit"
                        className="rounded-lg border border-brand px-3 py-1.5 text-xs font-semibold text-brand hover:bg-brand hover:text-white"
                      >
                        🚀 Đẩy 6 lượt
                      </button>
                    </form>
                  </div>
                </div>
              </details>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
