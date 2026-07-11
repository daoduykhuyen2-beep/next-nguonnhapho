import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminNav from "@/components/AdminNav";
import RoleSelect from "@/components/RoleSelect";
import { resolveRole, ROLE_LABELS, type Role } from "@/lib/permissions";

export const metadata: Metadata = { title: "Phân quyền" };
export const dynamic = "force-dynamic";

type MemberRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  role: string | null;
  is_admin: boolean | null;
};

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/dang-nhap?next=/admin");

  const { data: me } = await supabase
    .from("profiles")
    .select("role, is_admin")
    .eq("id", user.id)
    .maybeSingle();

  // CHỈ ADMIN mới được vào trang phân quyền
  const myRole = resolveRole(me);
  if (myRole !== "admin") redirect("/admin");

  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, email, phone, role, is_admin")
    .order("created_at", { ascending: false });
  const members: MemberRow[] = data || [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <AdminNav role="admin" />

      <div className="mb-4">
        <h1 className="text-2xl font-bold">Phân quyền nhân sự</h1>
        <p className="mt-1 text-sm text-gray-500">
          Gán vai trò cho thành viên. <strong>Phó cộng đồng</strong> được: chỉnh
          sửa bài viết, duyệt tin, quản lý tin tức và đăng thông báo. Chỉ{" "}
          <strong>Admin</strong> mới được vào trang này và quản lý thành viên,
          nạp tiền.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {(["admin", "pho_cong_dong", "member"] as Role[]).map((r) => (
          <div key={r} className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">{ROLE_LABELS[r]}</p>
            <p className="text-2xl font-bold">
              {members.filter((m) => resolveRole(m) === r).length}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border bg-white shadow-sm">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3">Thành viên</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">SĐT</th>
              <th className="px-4 py-3">Vai trò hiện tại</th>
              <th className="px-4 py-3">Đổi vai trò</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => {
              const role = resolveRole(m);
              const isSelf = m.id === user.id;
              return (
                <tr key={m.id} className="border-b last:border-0">
                  <td className="px-4 py-3 font-semibold">
                    {m.full_name || "(Chưa đặt tên)"}
                    {isSelf && (
                      <span className="ml-2 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
                        Bạn
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{m.email || "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{m.phone || "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        "rounded-full px-2.5 py-1 text-xs font-semibold " +
                        (role === "admin"
                          ? "bg-red-100 text-red-700"
                          : role === "pho_cong_dong"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-gray-100 text-gray-600")
                      }
                    >
                      {ROLE_LABELS[role]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <RoleSelect
                      userId={m.id}
                      currentRole={role}
                      disabled={isSelf}
                    />
                  </td>
                </tr>
              );
            })}
            {members.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  Chưa có thành viên nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
