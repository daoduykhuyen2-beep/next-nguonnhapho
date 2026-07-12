import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { markLeadRead } from "@/app/actions/leads";

export const metadata = { title: "Quản lý khách hàng" };
export const dynamic = "force-dynamic";

type Lead = {
  id: number;
  post_id: number | null;
  name: string | null;
  phone: string | null;
  note: string | null;
  is_read: boolean | null;
  created_at: string | null;
};

type PostLite = { id: number; title: string | null };

export default async function KhachHangPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/dang-nhap?next=/tai-khoan/khach-hang");

  const { data: leadData } = await supabase
    .from("web_post_leads")
    .select("*")
    .eq("owner", user.id)
    .order("created_at", { ascending: false });

  const leads = (leadData as Lead[]) || [];

  const postIds = Array.from(
    new Set(leads.map((l) => l.post_id).filter(Boolean))
  ) as number[];
  const postMap: Record<number, string> = {};
  if (postIds.length) {
    const { data: posts } = await supabase
      .from("web_posts")
      .select("id, title")
      .in("id", postIds);
    for (const p of (posts as PostLite[]) || []) {
      postMap[p.id] = p.title || "Tin #" + p.id;
    }
  }

  const total = leads.length;
  const unread = leads.filter((l) => !l.is_read).length;

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Quản lý khách hàng</h1>
            <p className="mt-1 text-sm text-gray-500">
              Số điện thoại khách để lại trên tin đăng của bạn sẽ đổ về đây.
            </p>
          </div>
          <Link href="/tai-khoan" className="text-sm text-brand hover:underline">
            ← Về tài khoản
          </Link>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="text-3xl font-extrabold text-brand">{total}</div>
            <div className="mt-1 text-sm text-gray-500">Tổng khách quan tâm</div>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="text-3xl font-extrabold text-emerald-600">{unread}</div>
            <div className="mt-1 text-sm text-gray-500">Chưa liên hệ</div>
          </div>
        </div>

        {total === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-2xl">
              ☺
            </div>
            <p className="font-semibold text-gray-800">Chưa có khách hàng nào</p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
              Khi có người để lại số điện thoại trên tin đăng của bạn, thông tin
              sẽ hiển thị tại đây để bạn chủ động liên hệ và chăm sóc.
            </p>
            <Link
              href="/tai-khoan/tin-cua-toi"
              className="mt-5 inline-block rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white"
            >
              Xem tin đăng của tôi
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {leads.map((l) => (
              <li
                key={l.id}
                className={
                  "rounded-2xl border bg-white p-4 shadow-sm " +
                  (l.is_read
                    ? "border-gray-100"
                    : "border-emerald-200 ring-1 ring-emerald-100")
                }
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">
                        {l.name || "Khách quan tâm"}
                      </span>
                      {!l.is_read ? (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                          Mới
                        </span>
                      ) : null}
                    </div>
                    {l.phone ? (
                      <a
                        href={"tel:" + l.phone}
                        className="mt-1 block text-lg font-bold text-brand"
                      >
                        {l.phone}
                      </a>
                    ) : null}
                    {l.note ? (
                      <p className="mt-1 text-sm text-gray-600">“{l.note}”</p>
                    ) : null}
                    <p className="mt-2 text-xs text-gray-400">
                      {l.post_id && postMap[l.post_id] ? (
                        <>
                          Quan tâm tin:{" "}
                          <Link
                            href={"/tin-dang/" + l.post_id}
                            className="text-gray-500 underline"
                          >
                            {postMap[l.post_id]}
                          </Link>
                          {" · "}
                        </>
                      ) : null}
                      {l.created_at
                        ? new Date(l.created_at).toLocaleString("vi-VN")
                        : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    {l.phone ? (
                      <a
                        href={"tel:" + l.phone}
                        className="rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-white"
                      >
                        Gọi ngay
                      </a>
                    ) : null}
                    {!l.is_read ? (
                      <form action={markLeadRead}>
                        <input type="hidden" name="id" value={l.id} />
                        <button
                          type="submit"
                          className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                        >
                          Đã liên hệ
                        </button>
                      </form>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
