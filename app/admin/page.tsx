import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/types";
import { formatGia } from "@/components/PostCard";
import DeletePostButton from "@/components/DeletePostButton";

export const metadata = { title: "Quản trị" };
const ADMIN_EMAIL = "daoduykhuyen2@gmail.com";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/dang-nhap?next=/admin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();

  const isAdmin = user.email === ADMIN_EMAIL || profile?.is_admin === true;
  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-lg rounded-xl border bg-white p-8 text-center">
        <h2 className="mb-2 text-xl font-bold">Không có quyền truy cập</h2>
        <p className="text-gray-500">Trang này chỉ dành cho quản trị viên.</p>
      </div>
    );
  }

  const { data, count: postCount } = await supabase
    .from("web_posts")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .limit(200);

  const { count: userCount } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true });

  const posts = (data as Post[]) || [];

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Trang quản trị</h1>

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Stat label="Tổng tin đăng" value={postCount ?? posts.length} />
        <Stat label="Thành viên" value={userCount ?? 0} />
        <Stat label="Hiển thị (trang này)" value={posts.length} />
      </div>

      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3">Tiêu đề</th>
              <th className="px-4 py-3">Giá</th>
              <th className="px-4 py-3">Quận</th>
              <th className="px-4 py-3">Ngày</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} className="border-b last:border-0">
                <td className="px-4 py-3">
                  <Link
                    href={"/tin-dang/" + p.id}
                    className="font-medium hover:text-brand"
                  >
                    {p.title || "(Không có tiêu đề)"}
                  </Link>
                </td>
                <td className="px-4 py-3">{formatGia(p.gia)}</td>
                <td className="px-4 py-3">{p.quan || "-"}</td>
                <td className="px-4 py-3 text-gray-500">
                  {p.created_at
                    ? new Date(p.created_at).toLocaleDateString("vi-VN")
                    : "-"}
                </td>
                <td className="px-4 py-3">{p.trang_thai || "-"}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={"/sua-tin/" + p.id}
                      className="rounded border px-2 py-1 text-xs hover:bg-gray-50"
                    >
                      Sửa
                    </Link>
                    <DeletePostButton id={p.id} />
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  Chưa có tin đăng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="text-2xl font-bold text-brand">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}
