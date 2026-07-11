import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import AdminNav from "@/components/AdminNav";
import PostAdminItem from "@/components/PostAdminItem";

export const metadata = { title: "Quản lý bài đăng" };
export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const sp = await searchParams;
  const q = (sp.q || "").trim();
  const page = Math.max(1, Number(sp.page || "1"));
  const pageSize = 20;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/dang-nhap?next=/admin");
  const { data: prof } = await supabase.from("profiles").select("is_admin").eq("id", user.id).maybeSingle();
  const isAdmin = user.email === "daoduykhuyen2@gmail.com" || prof?.is_admin === true;
  if (!isAdmin) return <div className="p-8 text-center text-gray-500">Không có quyền.</div>;

  let query = supabase.from("web_posts").select("id, title, gia, dien_tich, quan, mota, status, trang_thai", { count: "exact" }).order("created_at", { ascending: false });
  if (q) query = query.ilike("title", "%" + q + "%");
  const { data, count } = await query.range((page - 1) * pageSize, page * pageSize - 1);
  const posts = data || [];
  const total = count || 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const mk = (p: number) => "/admin/bai-dang?" + new URLSearchParams({ q, page: String(p) }).toString();
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Quản lý bài đăng</h1>
      <AdminNav />
      <form className="mb-4 flex gap-2">
        <input name="q" defaultValue={q} placeholder="Tìm theo tiêu đề..." className="w-full max-w-md rounded-lg border px-4 py-2" />
        <button className="rounded-lg bg-brand px-5 py-2 font-semibold text-white">Tìm</button>
      </form>
      <p className="mb-3 text-sm text-gray-500">Tổng: {total.toLocaleString("vi-VN")} tin · Trang {page}/{totalPages}</p>
      <div className="space-y-3">
        {posts.map((p) => <PostAdminItem key={p.id} post={p} />)}
      </div>
      <div className="mt-5 flex gap-2">
        {page > 1 ? <Link href={mk(page - 1)} className="rounded-lg border px-4 py-2 text-sm font-semibold">Trang trước</Link> : null}
        {page < totalPages ? <Link href={mk(page + 1)} className="rounded-lg border px-4 py-2 text-sm font-semibold">Trang sau</Link> : null}
      </div>
    </div>
  );
}
