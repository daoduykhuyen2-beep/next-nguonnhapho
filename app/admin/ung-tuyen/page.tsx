import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminNav from "@/components/AdminNav";
import { markJobApplicationRead } from "@/app/actions/jobApplications";

export const metadata = { title: "Hồ sơ ứng tuyển" };
export const dynamic = "force-dynamic";

type JobApplication = {
  id: number;
  ho_ten: string | null;
  phone: string | null;
  vi_tri: string | null;
  loi_nhan: string | null;
  is_read: boolean;
  created_at: string;
};

function fmtDate(s: string) {
  try {
    return new Date(s).toLocaleString("vi-VN");
  } catch {
    return s;
  }
}

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/dang-nhap?next=/admin/ung-tuyen");

  const { data: prof } = await supabase
    .from("profiles")
    .select("is_admin, role")
    .eq("id", user.id)
    .maybeSingle();
  const isAdmin =
    user.email === "daoduykhuyen2@gmail.com" ||
    prof?.is_admin === true ||
    prof?.role === "admin";
  if (!isAdmin)
    return <div className="p-6 text-center text-gray-500">Không có quyền.</div>;

  const { data } = await supabase
    .from("job_applications")
    .select("id, ho_ten, phone, vi_tri, loi_nhan, is_read, created_at")
    .order("created_at", { ascending: false })
    .limit(500);
  const rows = (data ?? []) as JobApplication[];
  const chuaDoc = rows.filter((r) => !r.is_read).length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <AdminNav />
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Hồ sơ ứng tuyển</h1>
        <span className="text-sm text-gray-500">
          Tổng: {rows.length} — Chưa đọc: {chuaDoc}
        </span>
      </div>

      {rows.length === 0 ? (
        <p className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-500">
          Chưa có hồ sơ ứng tuyển nào.
        </p>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => (
            <div
              key={r.id}
              className={
                "rounded-lg border p-4 " +
                (r.is_read
                  ? "border-gray-200 bg-white"
                  : "border-brand/40 bg-brand/5")
              }
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">
                    {r.ho_ten || "(Chưa có tên)"}
                    {!r.is_read ? (
                      <span className="ml-2 rounded bg-brand px-2 py-0.5 text-xs font-medium text-white">
                        Mới
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-1 text-sm text-gray-700">
                    <a href={"tel:" + (r.phone || "")} className="text-brand underline">
                      {r.phone}
                    </a>
                    {r.vi_tri ? " — " + r.vi_tri : ""}
                  </p>
                  {r.loi_nhan ? (
                    <p className="mt-1 whitespace-pre-line text-sm text-gray-600">
                      {r.loi_nhan}
                    </p>
                  ) : null}
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">{fmtDate(r.created_at)}</p>
                  {!r.is_read ? (
                    <form action={markJobApplicationRead} className="mt-2">
                      <input type="hidden" name="id" value={r.id} />
                      <button
                        type="submit"
                        className="rounded-lg border border-gray-300 px-3 py-1 text-xs font-semibold hover:bg-gray-50"
                      >
                        Đánh dấu đã đọc
                      </button>
                    </form>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
