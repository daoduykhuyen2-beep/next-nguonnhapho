import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import AdminNav from "@/components/AdminNav";
import NewsForm from "@/components/NewsForm";

export const metadata = { title: "Sửa tin tức" };
export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/dang-nhap?next=/admin/tin-tuc");
  const { data: prof } = await supabase.from("profiles").select("is_admin, role").eq("id", user.id).maybeSingle();
  const isAdmin =
    user.email === "daoduykhuyen2@gmail.com" ||
    prof?.is_admin === true ||
    prof?.role === "admin" ||
    prof?.role === "pho_cong_dong";
  if (!isAdmin) return <div className="p-8 text-center text-gray-500">Không có quyền.</div>;

  const { data: news } = await supabase
    .from("news")
    .select("id, tieu_de, mo_ta, noi_dung, anh_bia, loai")
    .eq("id", Number(id))
    .maybeSingle();
  if (!news) notFound();

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Sửa tin tức</h1>
        <Link href="/admin/tin-tuc" className="text-sm font-medium text-brand hover:underline">← Quay lại danh sách</Link>
      </div>
      <AdminNav role={(prof?.role as "admin" | "pho_cong_dong" | "member") ?? (prof?.is_admin ? "admin" : "member")} />
      <div className="max-w-2xl">
        <NewsForm initial={news} />
      </div>
    </div>
  );
}
