import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/types";
import { formatGia } from "@/components/PostCard";
import DeletePostButton from "@/components/DeletePostButton";
import { usePerk } from "@/app/actions/perks";

export const metadata = { title: "Tin của tôi" };

function fmtVND(n: number) {
  return Number(n || 0).toLocaleString("vi-VN") + "đ";
}

export default async function TinCuaToiPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/dang-nhap?next=/tai-khoan/tin-cua-toi");

  const { data: prof } = await supabase
    .from("profiles")
    .select("so_du, push_credits")
    .eq("id", user.id)
    .single();
  const soDu = Number(prof?.so_du ?? 0);
  const pushCredits = Number(prof?.push_credits ?? 0);

  // Kho tin con lai theo loai (chi tinh cac luot chua het han).
  const nowIso = new Date().toISOString();
  const { data: creditRows } = await supabase
    .from("post_credits")
    .select("loai, so_luot, het_han")
    .eq("user_id", user.id);
  const khoTin = { thuong: 0, vang: 0, kim_cuong: 0 } as Record<string, number>;
  for (const c of (creditRows ?? []) as { loai: string; so_luot: number; het_han: string | null }[]) {
    if (c.het_han && c.het_han < nowIso) continue;
    khoTin[c.loai] = (khoTin[c.loai] ?? 0) + Number(c.so_luot || 0);
  }

  const { data } = await supabase
    .from("web_posts")
    .select("*")
    .eq("owner", user.id)
    .order("created_at", { ascending: false });

  const posts = (data as Post[]) ?? [];

  const perk = sp.perk;
  const need = Number(sp.need ?? 0);

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

      {/* Số dư ví: dùng để nâng cấp / đẩy tin */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-white p-4">
        <div>
          <p className="text-xs text-gray-500">Số dư của bạn</p>
          <p className="text-lg font-bold text-brand">{fmtVND(soDu)}</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/tai-khoan/nap-tien"
            className="rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-white"
          >
            + Nạp tiền
          </Link>
          <Link
            href="/goi-thanh-vien"
            className="rounded-lg border border-brand px-3 py-1.5 text-xs font-semibold text-brand hover:bg-brand hover:text-white"
          >
            Mua gói
          </Link>
        </div>
      </div>

      {/* Kho tin còn lại: ưu tiên dùng trước khi trừ số dư */}
      <div className="mb-4 rounded-lg border bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-700">Kho tin còn lại</p>
          <Link
            href="/goi-thanh-vien"
            className="text-xs font-semibold text-brand hover:underline"
          >
            Mua thêm
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-gray-50 p-2">
            <p className="text-lg font-bold text-gray-800">{khoTin.thuong}</p>
            <p className="text-xs text-gray-500">Tin Thường</p>
          </div>
          <div className="rounded-lg bg-amber-50 p-2">
            <p className="text-lg font-bold text-amber-600">{khoTin.vang}</p>
            <p className="text-xs text-gray-500">VIP Vàng</p>
          </div>
          <div className="rounded-lg bg-sky-50 p-2">
            <p className="text-lg font-bold text-sky-600">{khoTin.kim_cuong}</p>
            <p className="text-xs text-gray-500">VIP Kim Cương</p>
          </div>
        </div>
        <p className="mt-3 text-xs text-gray-500">
          Còn <span className="font-semibold text-gray-700">{pushCredits}</span>{" "}
          lượt đẩy tin. Khi đăng/nâng cấp tin, hệ thống ưu tiên trừ kho tin trước,
          hết kho mới trừ vào số dư.
        </p>
      </div>

      {/* Thông báo kết quả sau khi bấm nâng cấp / đẩy tin */}
      {perk === "ok" ? (
        <p className="mb-4 rounded-lg border border-green-300 bg-green-50 p-3 text-sm text-green-700">
          ✅ Thành công! Đã trừ vào số dư và áp dụng cho tin của bạn.
        </p>
      ) : perk === "nofunds" ? (
        <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
          ⚠️ Số dư không đủ{need > 0 ? ` (cần ${fmtVND(need)})` : ""}. Vui lòng nạp
          thêm tiền hoặc mua gói để tiếp tục.
          <div className="mt-2 flex gap-2">
            <Link
              href="/tai-khoan/nap-tien"
              className="rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-white"
            >
              Nạp tiền ngay
            </Link>
            <Link
              href="/goi-thanh-vien"
              className="rounded-lg border border-brand px-3 py-1.5 text-xs font-semibold text-brand hover:bg-brand hover:text-white"
            >
              Xem các gói
            </Link>
          </div>
        </div>
      ) : perk === "loi" ? (
        <p className="mb-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          Có lỗi xảy ra, vui lòng thử lại.
        </p>
      ) : null}

      {posts.length === 0 ? (
        <p className="rounded-lg border bg-white p-6 text-gray-500">
          Bạn chưa đăng tin nào.
        </p>
      ) : (
        <div className="space-y-3">
          {posts.map((p) => (
            <div key={p.id} className="rounded-lg border bg-white p-4">
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

              {/* Nâng cấp & Đẩy tin cho ĐÚNG tin này (trừ vào số dư) */}
              <details className="mt-3 rounded-lg bg-gray-50 p-3">
                <summary className="cursor-pointer select-none text-sm font-semibold text-brand">
                  ⚡ Nâng cấp / Đẩy tin này
                </summary>

                <p className="mt-2 text-xs text-gray-500">
                  Tin: {" "}
                  <span className="font-semibold text-gray-700">
                    {p.title ?? "(Không có tiêu đề)"}
                  </span>
                  . Hệ thống sẽ trừ vào số dư nếu còn đủ.
                </p>

                {/* 1) Nâng cấp hạng tin */}
                <div className="mt-3">
                  <p className="mb-1.5 text-xs font-semibold text-gray-600">
                    1) Nâng cấp hạng tin
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <form action={usePerk}>
                      <input type="hidden" name="plan" value="VIP_VANG_7" />
                      <input type="hidden" name="post_id" value={p.id} />
                      <button
                        type="submit"
                        className="rounded-lg border border-amber-500 px-3 py-1.5 text-xs font-semibold text-amber-600 hover:bg-amber-500 hover:text-white"
                      >
                        🏅 Lên VIP Vàng
                      </button>
                    </form>
                    <form action={usePerk}>
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
                    <form action={usePerk}>
                      <input type="hidden" name="plan" value="DAY_1" />
                      <input type="hidden" name="post_id" value={p.id} />
                      <button
                        type="submit"
                        className="rounded-lg border border-brand px-3 py-1.5 text-xs font-semibold text-brand hover:bg-brand hover:text-white"
                      >
                        🚀 Đẩy 1 lượt
                      </button>
                    </form>
                    <form action={usePerk}>
                      <input type="hidden" name="plan" value="DAY_3" />
                      <input type="hidden" name="post_id" value={p.id} />
                      <button
                        type="submit"
                        className="rounded-lg border border-brand px-3 py-1.5 text-xs font-semibold text-brand hover:bg-brand hover:text-white"
                      >
                        🚀 Đẩy 3 lượt
                      </button>
                    </form>
                    <form action={usePerk}>
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
