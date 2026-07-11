import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminNav from "@/components/AdminNav";
import BannerManager from "@/components/BannerManager";
import { type BannerRow } from "@/components/BannerForm";

export const metadata = { title: "Quản lý banner" };
export const dynamic = "force-dynamic";

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/dang-nhap?next=/admin/banner");
  const { data: prof } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();
  const isAdmin = user.email === "daoduykhuyen2@gmail.com" || prof?.is_admin === true;
  if (!isAdmin)
    return <div className="p-8 text-center text-gray-500">Không có quyền.</div>;

  const { data } = await supabase
    .from("banners")
    .select("id, image_url, title, subtitle, link, sort, active")
    .order("sort", { ascending: true });
  const banners = (data as BannerRow[]) || [];

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Quản lý banner trang chủ</h1>
      <AdminNav />
      <p className="mb-4 text-sm text-gray-500">
        Banner sẽ hiển thị dạng lướt (slider) ở đầu trang chủ. Bạn có thể đổi ảnh,
        sửa tiêu đề/mô tả, đặt liên kết và thứ tự hiển thị.
      </p>
      <BannerManager banners={banners} />
    </div>
  );
}
