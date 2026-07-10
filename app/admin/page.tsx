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
      <div className="mx-auto max-w-lg rounded-xl border bg-white p-6 text-center">
        <h1 className="mb-2 text-xl font-bold">Không có quyền truy cập</h1>
        <p className="text-gray-600">
          Trang này chỉ dành cho quản trị viên.
        </p>
      </div>
    );
  }

  const { data, count } = await supabase
    .from("web_posts")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .limit(100);

  const posts = (data as Post[]) ?? [];

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Trang quản trị</h1>
      <p className="mb-6 text-sm text-gray-500">
        Tổng cộng {count ?? posts.length} tin đăng.
      </p>

      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3">Tiêu đề</th>
              <th className="px-4 py-3">Giá</th>
              <th className="px-4 py-3">Quận</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} className="border-b last:border-0">
                <td className="px-4 py-3">
                  <Link
                    href={`/tin-dang/${p.id}`}
                    className="font-medium hover:text-brand"
                  >
                    {p.title ?? "(Không có tiêu đề)"}
                  </Link>
                </td>
                <td className="px-4 py-3">{formatGia(p.gia)}</td>
                <td className="px-4 py-3">{p.quan ?? "-"}</td>
                <td className="px-4 py-3">{p.trang_thai ?? "-"}</td>
                <td className="px-4 py-3 text-right">
                  <DeletePostButton id={p.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
