import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminNav from "@/components/AdminNav";
import BannerForm from "@/components/BannerForm";
import { toggleBanner, deleteBanner } from "@/app/actions/banner";

export const metadata = { title: "Quản lý banner" };
export const dynamic = "force-dynamic";

const ADMIN_EMAIL = "daoduykhuyen2@gmail.com";

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/dang-nhap?next=/admin/banner");
  const { data: prof } = await supabase
    .from("profiles")
    .select("is_admin, role")
    .eq("id", user.id)
    .maybeSingle();
  const isAdmin =
    user.email === ADMIN_EMAIL || prof?.is_admin === true || prof?.role === "admin";
  if (!isAdmin) return <div className="p-8 text-center text-gray-500">Không có quyền.</div>;

  const { data: banners } = await supabase
    .from("banners")
    .select("id, title, image_url, link_url, sort_order, active")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Quản lý banner trang chủ</h1>
      <p className="mb-4 text-gray-500">
        Banner hiển thị ngay dưới ô tìm kiếm ở trang chủ. Thêm, bật/tắt hoặc xóa banner tại đây.
      </p>
      <AdminNav />

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <BannerForm />

        <div>
          <h3 className="mb-3 text-lg font-bold">
            Danh sách banner ({(banners || []).length})
          </h3>
          <div className="space-y-3">
            {(banners || []).map((b) => (
              <div key={b.id} className="flex items-center gap-3 rounded-xl border bg-white p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={b.image_url} alt={b.title || "banner"} className="h-16 w-28 shrink-0 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{b.title || "(không tiêu đề)"}</div>
                  <div className="truncate text-xs text-gray-500">{b.link_url || "Không có link"}</div>
                  <div className="mt-1 text-xs">
                    Thứ tự: {b.sort_order} ·{" "}
                    <span className={b.active ? "text-green-600" : "text-gray-400"}>
                      {b.active ? "Đang hiển thị" : "Đang ẩn"}
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 flex-col gap-2">
                  <form action={toggleBanner}>
                    <input type="hidden" name="id" value={b.id} />
                    <input type="hidden" name="active" value={String(b.active)} />
                    <button className="rounded-md border px-3 py-1 text-xs hover:bg-gray-50">
                      {b.active ? "Ẩn" : "Hiện"}
                    </button>
                  </form>
                  <form action={deleteBanner}>
                    <input type="hidden" name="id" value={b.id} />
                    <button className="rounded-md border border-red-200 px-3 py-1 text-xs text-red-600 hover:bg-red-50">
                      Xóa
                    </button>
                  </form>
                </div>
              </div>
            ))}
            {(banners || []).length === 0 ? (
              <p className="rounded-xl border border-dashed p-6 text-center text-sm text-gray-400">
                Chưa có banner nào. Thêm banner ở bên trái.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
