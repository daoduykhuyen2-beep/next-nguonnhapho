import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Moi gioi chuyen nghiep" };
export const dynamic = "force-dynamic";

function formatDate(d: string | null) {
  if (!d) return "--";
  try {
    return new Date(d).toLocaleDateString("vi-VN");
  } catch {
    return "--";
  }
}

export default async function MoiGioiPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/dang-nhap");

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "full_name, phone, email, avatar_url, bio, address, membership_tier, created_at"
    )
    .eq("id", user.id)
    .maybeSingle();

  const { count: totalPosts } = await supabase
    .from("web_posts")
    .select("id", { count: "exact", head: true })
    .eq("owner", user.id);

  const { count: activePosts } = await supabase
    .from("web_posts")
    .select("id", { count: "exact", head: true })
    .eq("owner", user.id)
    .eq("trang_thai", "duyet");

  const { count: totalLeads } = await supabase
    .from("web_post_leads")
    .select("id", { count: "exact", head: true })
    .eq("owner", user.id);

  const { data: viewsRows } = await supabase
    .from("web_posts")
    .select("luot_xem")
    .eq("owner", user.id);
  const totalViews = (viewsRows ?? []).reduce(
    (s: number, r: { luot_xem: number | null }) => s + (r.luot_xem ?? 0),
    0
  );

  const tier = profile?.membership_tier ?? "free";
  const isPro = tier && tier !== "free";
  const name = profile?.full_name ?? "Moi gioi";
  const letter = (name || "M").charAt(0).toUpperCase();

  const stats = [
    { label: "Tin da dang", value: totalPosts ?? 0 },
    { label: "Tin dang hien thi", value: activePosts ?? 0 },
    { label: "Luot xem tin", value: totalViews },
    { label: "Khach hang tiem nang", value: totalLeads ?? 0 },
  ];

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="mb-1 text-2xl font-extrabold">Moi gioi chuyen nghiep</h1>
        <p className="mb-6 text-sm text-gray-500">
          Ho so moi gioi cua ban - xay dung uy tin, ket noi khach hang va nang
          tam thuong hieu ca nhan.
        </p>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="h-24 bg-gradient-to-r from-emerald-500 to-emerald-600" />
          <div className="px-6 pb-6">
            <div className="-mt-10 flex flex-wrap items-end gap-4">
              {profile?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar_url}
                  alt={name}
                  className="h-20 w-20 rounded-full border-4 border-white object-cover shadow"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-emerald-100 text-2xl font-bold text-emerald-700 shadow">
                  {letter}
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold">{name}</h2>
                  {isPro ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      Da xac thuc
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-500">
                      Chua xac thuc
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Tham gia tu {formatDate(profile?.created_at ?? null)}
                  {profile?.address ? " - " + profile.address : ""}
                </p>
              </div>
              <Link
                href="/tai-khoan/thong-tin"
                className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Chinh sua ho so
              </Link>
            </div>

            {profile?.bio ? (
              <p className="mt-4 whitespace-pre-line text-sm text-gray-700">
                {profile.bio}
              </p>
            ) : (
              <p className="mt-4 text-sm text-gray-400">
                Chua co gioi thieu. Them mo ta ban than de tang do tin cay voi
                khach hang.
              </p>
            )}

            <div className="mt-5 flex flex-wrap gap-4 text-sm text-gray-600">
              {profile?.phone ? <span>SDT: {profile.phone}</span> : null}
              {profile?.email ? <span>Email: {profile.email}</span> : null}
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-sm"
            >
              <div className="text-2xl font-extrabold text-emerald-600">
                {s.value.toLocaleString("vi-VN")}
              </div>
              <div className="mt-1 text-xs text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-bold">Quyen loi moi gioi chuyen nghiep</h3>
          <ul className="mt-3 space-y-2 text-sm text-gray-700">
            <li>- Huy hieu "Da xac thuc" giup tin dang duoc tin tuong hon.</li>
            <li>- Uu tien hien thi tin dang tren ket qua tim kiem.</li>
            <li>- Quan ly khach hang tiem nang tap trung tai mot noi.</li>
            <li>- Bao cao hieu qua tin dang chi tiet theo luot xem.</li>
          </ul>
          {!isPro ? (
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/tai-khoan/goi-hoi-vien"
                className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Nang cap moi gioi chuyen nghiep
              </Link>
              <Link
                href="/tai-khoan/khach-hang"
                className="rounded-xl border border-emerald-600 px-5 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
              >
                Xem khach hang tiem nang
              </Link>
            </div>
          ) : (
            <div className="mt-5">
              <span className="inline-block rounded-full bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-700">
                Ban dang la moi gioi chuyen nghiep - Goi {tier}
              </span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
