import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/types";
import MyPostCard, { computeState } from "@/components/MyPostCard";
import ExportExcelButton from "@/components/ExportExcelButton";

export const metadata = { title: "Quản lý tin - Tin của tôi" };
export const dynamic = "force-dynamic";

type MyPost = Post & { ngay_het_han?: string | null; luot_xem?: number | null };

const TABS: { key: string; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "het_han", label: "Hết hạn" },
  { key: "sap_het_han", label: "Sắp hết hạn" },
  { key: "hien_thi", label: "Đang hiển thị" },
  { key: "cho_duyet", label: "Chờ duyệt" },
  { key: "da_ha", label: "Đã hạ" },
];

export default async function TinCuaToiPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; q?: string; sort?: string }>;
}) {
  const sp = await searchParams;
  const tab = sp.tab ?? "all";
  const q = (sp.q ?? "").trim();
  const sort = sp.sort ?? "moi_nhat";

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
  let posts = (data ?? []) as MyPost[];

  // Đếm theo từng trạng thái (trên toàn bộ tin, trước khi lọc)
  const counts: Record<string, number> = { all: posts.length, het_han: 0, sap_het_han: 0, hien_thi: 0, cho_duyet: 0, da_ha: 0 };
  for (const p of posts) counts[computeState(p).key] = (counts[computeState(p).key] ?? 0) + 1;

  // Lọc theo tab
  if (tab !== "all") posts = posts.filter((p) => computeState(p).key === tab);
  // Lọc theo từ khoá (tiêu đề hoặc mã tin)
  if (q) {
    const lower = q.toLowerCase();
    posts = posts.filter(
      (p) => (p.title ?? "").toLowerCase().includes(lower) || String(p.id).includes(q)
    );
  }
  // Sắp xếp
  if (sort === "cu_nhat") posts = [...posts].reverse();
  else if (sort === "xem_nhieu") posts = [...posts].sort((a, b) => (b.luot_xem ?? 0) - (a.luot_xem ?? 0));

  const mkHref = (t: string) => {
    const params = new URLSearchParams();
    if (t !== "all") params.set("tab", t);
    if (q) params.set("q", q);
    if (sort !== "moi_nhat") params.set("sort", sort);
    const qs = params.toString();
    return qs ? `/tai-khoan/tin-cua-toi?${qs}` : "/tai-khoan/tin-cua-toi";
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      {/* Tiêu đề + hành động */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Quản lý tin</h1>
        <div className="flex items-center gap-2">
          <ExportExcelButton posts={posts} />
          <Link href="/dang-tin" className="rounded-lg bg-brand px-4 py-2 font-semibold text-white hover:opacity-90">
            + Đăng tin
          </Link>
        </div>
      </div>

      {/* Thanh tìm kiếm */}
      <form action="/tai-khoan/tin-cua-toi" method="get" className="mb-4 flex gap-2">
        {tab !== "all" ? <input type="hidden" name="tab" value={tab} /> : null}
        {sort !== "moi_nhat" ? <input type="hidden" name="sort" value={sort} /> : null}
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Nhập mã tin hoặc tiêu đề tin"
          className="flex-1 rounded-full border border-gray-300 px-5 py-2.5 text-sm outline-none focus:border-brand"
        />
        <button type="submit" className="rounded-full border border-gray-300 px-5 py-2.5 text-sm font-semibold hover:bg-gray-50">
          Tìm
        </button>
      </form>

      {/* Tabs trạng thái */}
      <div className="mb-5 flex flex-wrap gap-2">
        {TABS.map((t) => {
          const active = t.key === tab;
          return (
            <Link
              key={t.key}
              href={mkHref(t.key)}
              className={
                "rounded-full px-4 py-1.5 text-sm font-semibold transition " +
                (active ? "bg-gray-900 text-white" : "border border-gray-300 text-gray-700 hover:bg-gray-50")
              }
            >
              {t.label} ({counts[t.key] ?? 0})
            </Link>
          );
        })}
      </div>

      {/* Sắp xếp */}
      <div className="mb-3 flex items-center justify-end gap-3 text-sm">
        <span className="text-gray-500">{posts.length} tin</span>
        <div className="flex gap-2">
          <Link href={sortHref("moi_nhat", tab, q)} className={sortCls(sort === "moi_nhat")}>Mới nhất</Link>
          <Link href={sortHref("cu_nhat", tab, q)} className={sortCls(sort === "cu_nhat")}>Cũ nhất</Link>
          <Link href={sortHref("xem_nhieu", tab, q)} className={sortCls(sort === "xem_nhieu")}>Xem nhiều</Link>
        </div>
      </div>

      {/* Danh sách tin */}
      {posts.length === 0 ? (
        <div className="rounded-xl border bg-white p-8 text-center text-gray-500">
          Không có tin nào phù hợp.
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((p) => (
            <MyPostCard key={p.id} post={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function sortHref(s: string, tab: string, q: string) {
  const params = new URLSearchParams();
  if (tab !== "all") params.set("tab", tab);
  if (q) params.set("q", q);
  if (s !== "moi_nhat") params.set("sort", s);
  const qs = params.toString();
  return qs ? `/tai-khoan/tin-cua-toi?${qs}` : "/tai-khoan/tin-cua-toi";
}

function sortCls(active: boolean) {
  return active ? "font-semibold text-brand" : "text-gray-500 hover:text-gray-800";
}
