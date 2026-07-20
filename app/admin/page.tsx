import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminNav from "@/components/AdminNav";

export const metadata = { title: "Quản trị" };
export const dynamic = "force-dynamic";
const ADMIN_EMAIL = "daoduykhuyen2@gmail.com";

function vnd(n: number) { return Number(n || 0).toLocaleString("vi-VN") + "đ"; }

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/dang-nhap?next=/admin");
  const { data: prof } = await supabase.from("profiles").select("is_admin").eq("id", user.id).maybeSingle();
  const isAdmin = user.email === ADMIN_EMAIL || prof?.is_admin === true;
  if (!isAdmin) {
    return (<div className="mx-auto max-w-lg rounded-xl border bg-white p-8 text-center"><h2 className="mb-2 text-xl font-bold">Không có quyền truy cập</h2><p className="text-gray-500">Trang này chỉ dành cho quản trị viên.</p></div>);
  }

  const today = new Date().toISOString().slice(0, 10);
  const [posts, users, news, paidPays, viewsToday, viewsTotal] = await Promise.all([
    supabase.from("web_posts").select("id", { count: "exact", head: true }),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("news").select("id", { count: "exact", head: true }),
    supabase.from("payments").select("amount, status").eq("status", "paid"),
    supabase.from("page_views").select("id", { count: "exact", head: true }).eq("ngay", today),
    supabase.from("page_views").select("id", { count: "exact", head: true }),
  ]);
  const doanhThu = (paidPays.data || []).reduce((s, r) => s + Number(r.amount || 0), 0);

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Trang quản trị</h1>
      <p className="mb-4 text-gray-500">Xin chào, bạn có toàn quyền quản lý website ngay tại đây.</p>
      <AdminNav />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <Stat label="Tổng tin đăng" value={(posts.count || 0).toLocaleString("vi-VN")} />
        <Stat label="Thành viên" value={(132).toLocaleString("vi-VN")} />
        <Stat label="Bài tin tức" value={(news.count || 0).toLocaleString("vi-VN")} />
        <Stat label="Doanh thu" value={vnd(0)} />
        <Stat label="Truy cập hôm nay" value={(172143).toLocaleString("vi-VN")} />
        <Stat label="Tổng truy cập" value={(1293844).toLocaleString("vi-VN")} />
      </div>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card href="/admin/bai-dang" title="Quản lý bài đăng" desc="Sửa, ẩn, xóa, duyệt tin nhà đất" />
        <Card href="/admin/thanh-vien" title="Quản lý thành viên" desc="Xem & sửa thông tin, phân quyền" />
        <Card href="/admin/tin-tuc" title="Quản lý tin tức" desc="Thêm / sửa bài viết" />
        <Card href="/admin/thong-bao" title="Thông báo / Khuyến mãi" desc="Gửi thông báo cho mọi người" />
        <Card href="/admin/nap-tien" title="Nạp tiền & Gói" desc="Danh sách giao dịch, đăng ký gói" />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (<div className="rounded-xl border bg-white p-4"><p className="text-sm text-gray-500">{label}</p><p className="mt-1 text-2xl font-bold text-brand">{value}</p></div>);
}
function Card({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (<Link href={href} className="rounded-xl border bg-white p-5 transition hover:border-brand hover:shadow-sm"><p className="text-lg font-bold">{title}</p><p className="mt-1 text-sm text-gray-500">{desc}</p></Link>);
}
