import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminNav from "@/components/AdminNav";
import HomeVideoForm from "@/components/HomeVideoForm";
import { toggleHomeVideo, deleteHomeVideo } from "@/app/actions/home-video";

export const metadata = { title: "Quản lý video trang chủ" };
export const dynamic = "force-dynamic";

const ADMIN_EMAIL = "daoduykhuyen2@gmail.com";

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/dang-nhap?next=/admin/quan-ly-video");
  const { data: prof } = await supabase
    .from("profiles")
    .select("is_admin, role")
    .eq("id", user.id)
    .maybeSingle();
  const isAdmin =
    user.email === ADMIN_EMAIL || prof?.is_admin === true || prof?.role === "admin";
  if (!isAdmin) return <div className="p-8 text-center text-gray-500">Không có quyền.</div>;

  const { data: videos } = await supabase
    .from("home_videos")
    .select("id, title, tiktok_url, sort_order, active")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Quản lý video TikTok trang chủ</h1>
      <p className="mb-4 text-gray-500">
        Dán link video TikTok để hiển thị ở mục &quot;Video&quot; trên trang chủ (khung 16:9). Thêm, bật/tắt hoặc xóa video tại đây; đặt &quot;Thứ tự hiển thị&quot; nhỏ hơn để video lên trước.
      </p>
      <AdminNav />

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <HomeVideoForm />

        <div>
          <h3 className="mb-3 text-lg font-bold">
            Danh sách video ({(videos || []).length})
          </h3>
          <div className="space-y-3">
            {(videos || []).map((v) => (
              <div key={v.id} className="flex items-center gap-3 rounded-xl border bg-white p-3">
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{v.title || "(không tiêu đề)"}</div>
                  <div className="truncate text-xs text-gray-500">{v.tiktok_url}</div>
                  <div className="mt-1 text-xs">
                    Thứ tự: {v.sort_order} ·{" "}
                    <span className={v.active ? "text-green-600" : "text-gray-400"}>
                      {v.active ? "Đang hiển thị" : "Đang ẩn"}
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 flex-col gap-2">
                  <form action={toggleHomeVideo}>
                    <input type="hidden" name="id" value={v.id} />
                    <input type="hidden" name="active" value={String(v.active)} />
                    <button className="rounded-md border px-3 py-1 text-xs hover:bg-gray-50">
                      {v.active ? "Ẩn" : "Hiện"}
                    </button>
                  </form>
                  <form action={deleteHomeVideo}>
                    <input type="hidden" name="id" value={v.id} />
                    <button className="rounded-md border border-red-200 px-3 py-1 text-xs text-red-600 hover:bg-red-50">
                      Xóa
                    </button>
                  </form>
                </div>
              </div>
            ))}
            {(videos || []).length === 0 ? (
              <p className="rounded-xl border border-dashed p-6 text-center text-sm text-gray-400">
                Chưa có video nào. Thêm video ở bên trái.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
