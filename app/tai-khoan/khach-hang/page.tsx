import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LeadRow from "@/components/LeadRow";

export const metadata = { title: "Quan ly khach hang" };
export const dynamic = "force-dynamic";

type Lead = {
  id: number;
  post_id: number | null;
  name: string | null;
  phone: string;
  note: string | null;
  is_read: boolean;
  created_at: string;
};

export default async function KhachHangPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const tab = sp.tab ?? "all";
  const q = (sp.q ?? "").trim();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/dang-nhap");

  const { data: leadsData } = await supabase
    .from("web_post_leads")
    .select("id, post_id, name, phone, note, is_read, created_at")
    .eq("owner", user.id)
    .order("created_at", { ascending: false });

  const leads = (leadsData ?? []) as Lead[];

  // Lay tieu de tin de hien thi
  const postIds = Array.from(
    new Set(leads.map((l) => l.post_id).filter(Boolean))
  ) as number[];
  const titleMap = new Map<number, string>();
  if (postIds.length > 0) {
    const { data: posts } = await supabase
      .from("web_posts")
      .select("id, title")
      .in("id", postIds);
    (posts ?? []).forEach((p: { id: number; title: string | null }) =>
      titleMap.set(p.id, p.title ?? "Tin dang")
    );
  }

  const total = leads.length;
  const unread = leads.filter((l) => !l.is_read).length;

  let filtered = leads;
  if (tab === "unread") filtered = filtered.filter((l) => !l.is_read);
  if (q) {
    const qq = q.toLowerCase();
    filtered = filtered.filter(
      (l) =>
        l.phone.toLowerCase().includes(qq) ||
        (l.name ?? "").toLowerCase().includes(qq) ||
        (l.note ?? "").toLowerCase().includes(qq)
    );
  }

  const tabCls = (active: boolean) =>
    "rounded-full px-4 py-1.5 text-sm font-semibold transition " +
    (active ? "bg-brand text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200");

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quan ly khach hang</h1>
        <Link href="/tai-khoan" className="text-sm text-brand hover:underline">
          &larr; Ve tai khoan
        </Link>
      </div>

      <p className="mb-4 text-sm text-gray-500">
        Danh sach khach hang da de lai so dien thoai tren cac tin ban dang.
      </p>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Link href="/tai-khoan/khach-hang?tab=all" className={tabCls(tab === "all")}>
          Tat ca ({total})
        </Link>
        <Link href="/tai-khoan/khach-hang?tab=unread" className={tabCls(tab === "unread")}>
          Chua doc ({unread})
        </Link>
      </div>

      <form className="mb-5 flex gap-2" action="/tai-khoan/khach-hang">
        <input type="hidden" name="tab" value={tab} />
        <input
          name="q"
          defaultValue={q}
          placeholder="Tim theo ten, so dien thoai..."
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
        <button className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white">
          Tim
        </button>
      </form>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-12 text-center text-gray-500">
          Chua co khach hang nao. Khi co nguoi de lai so dien thoai tren tin cua
          ban, ho se hien thi o day.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((l) => (
            <LeadRow
              key={l.id}
              lead={l}
              postTitle={l.post_id ? titleMap.get(l.post_id) ?? null : null}
            />
          ))}
        </div>
      )}
    </main>
  );
}
