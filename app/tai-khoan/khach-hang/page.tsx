import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { markLeadRead } from "@/app/actions/leads";

export const metadata = { title: "Quản lý khách hàng" };
export const dynamic = "force-dynamic";

type Lead = {
  id: number;
  post_id: number | null;
  name: string | null;
  phone: string | null;
  note: string | null;
  is_read: boolean | null;
  created_at: string | null;
};

type PostLite = { id: number; title: string | null };

// Chữ cái đầu để làm avatar
function getInitials(name: string | null, phone: string | null) {
  const source = (name || "").trim();
  if (source) {
    const parts = source.split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] || "";
    const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
    return (first + last).toUpperCase();
  }
  const digits = (phone || "").replace(/\D/g, "");
  return digits.slice(-2) || "KH";
}

// Màu avatar ổn định theo tên/sđt
function avatarColor(seed: string) {
  const palette = [
    "bg-rose-100 text-rose-700",
    "bg-orange-100 text-orange-700",
    "bg-amber-100 text-amber-700",
    "bg-emerald-100 text-emerald-700",
    "bg-sky-100 text-sky-700",
    "bg-indigo-100 text-indigo-700",
    "bg-violet-100 text-violet-700",
  ];
  let sum = 0;
  for (let i = 0; i < seed.length; i++) sum += seed.charCodeAt(i);
  return palette[sum % palette.length];
}

// Thời gian dạng "x ngày trước"
function timeAgo(dateStr: string | null) {
  if (!dateStr) return "";
  const then = new Date(dateStr).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - then);
  const min = Math.floor(diff / 60000);
  if (min < 1) return "Vừa xong";
  if (min < 60) return `${min} phút trước`;
  const hour = Math.floor(min / 60);
  if (hour < 24) return `${hour} giờ trước`;
  const day = Math.floor(hour / 24);
  if (day < 30) return `${day} ngày trước`;
  const month = Math.floor(day / 30);
  if (month < 12) return `${month} tháng trước`;
  return `${Math.floor(month / 12)} năm trước`;
}

// Link Zalo từ số điện thoại
function zaloLink(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return `https://zalo.me/${digits}`;
}

export default async function KhachHangPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/dang-nhap?next=/tai-khoan/khach-hang");

  const { data: leadData } = await supabase
    .from("web_post_leads")
    .select("*")
    .eq("owner", user.id)
    .order("created_at", { ascending: false });

  const leads = (leadData || []) as Lead[];

  const postIds = Array.from(
    new Set(leads.map((l) => l.post_id).filter(Boolean) as number[])
  );

  const postMap: Record<number, string> = {};
  if (postIds.length) {
    const { data: posts } = await supabase
      .from("web_posts")
      .select("id, title")
      .in("id", postIds);
    for (const p of (posts || []) as PostLite[]) {
      postMap[p.id] = p.title || `Tin #${p.id}`;
    }
  }

  const total = leads.length;
  const unread = leads.filter((l) => !l.is_read).length;
  const now = Date.now();
  const last7 = leads.filter(
    (l) =>
      l.created_at &&
      now - new Date(l.created_at).getTime() < 7 * 24 * 60 * 60 * 1000
  ).length;

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <div className="mx-auto max-w-3xl px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Quản lý khách hàng</h1>
            <p className="mt-1 text-sm text-gray-500">
              {total} khách hàng · Số điện thoại khách để lại trên tin đăng của bạn sẽ đổ về đây.
            </p>
          </div>
          <Link
            href="/tai-khoan"
            className="text-sm text-brand hover:underline whitespace-nowrap"
          >
            ← Về tài khoản
          </Link>
        </div>

        {/* Thống kê */}
        <div className="mb-6 grid grid-cols-3 gap-3 sm:gap-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
            <div className="text-2xl font-extrabold text-brand sm:text-3xl">
              {total}
            </div>
            <div className="mt-1 text-xs text-gray-500 sm:text-sm">
              Tổng khách quan tâm
            </div>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
            <div className="text-2xl font-extrabold text-emerald-600 sm:text-3xl">
              {unread}
            </div>
            <div className="mt-1 text-xs text-gray-500 sm:text-sm">
              Chưa liên hệ
            </div>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
            <div className="text-2xl font-extrabold text-sky-600 sm:text-3xl">
              {last7}
            </div>
            <div className="mt-1 text-xs text-gray-500 sm:text-sm">
              Khách mới 7 ngày
            </div>
          </div>
        </div>

        {/* Danh sách */}
        {total === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-2xl">
              👥
            </div>
            <div className="font-semibold text-gray-800">
              Chưa có khách hàng nào
            </div>
            <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
              Khi có người để lại số điện thoại trên tin đăng của bạn, thông tin
              sẽ hiển thị tại đây để bạn chủ động liên hệ và chăm sóc.
            </p>
            <Link
              href="/tai-khoan/tin-cua-toi"
              className="mt-5 inline-block rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white"
            >
              Xem tin đăng của tôi
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {leads.map((lead) => {
              const displayName = lead.name || "Khách quan tâm";
              const initials = getInitials(lead.name, lead.phone);
              const color = avatarColor(lead.name || lead.phone || String(lead.id));
              return (
                <div
                  key={lead.id}
                  className={
                    "rounded-2xl border bg-white p-4 shadow-sm transition hover:shadow-md " +
                    (lead.is_read
                      ? "border-gray-100"
                      : "border-emerald-200 ring-1 ring-emerald-100")
                  }
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div
                      className={
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold " +
                        color
                      }
                    >
                      {initials}
                    </div>

                    {/* Nội dung */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-gray-900">
                          {displayName}
                        </span>
                        {lead.is_read ? (
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                            Đã liên hệ
                          </span>
                        ) : (
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                            Mới
                          </span>
                        )}
                        {lead.created_at && (
                          <span className="text-xs text-gray-400">
                            · {timeAgo(lead.created_at)}
                          </span>
                        )}
                      </div>

                      {lead.phone && (
                        <a
                          href={`tel:${lead.phone}`}
                          className="mt-1 block text-lg font-bold text-brand"
                        >
                          {lead.phone}
                        </a>
                      )}

                      {lead.note && (
                        <p className="mt-1 text-sm text-gray-600">{lead.note}</p>
                      )}

                      {lead.post_id && postMap[lead.post_id] && (
                        <div className="mt-2 flex items-start gap-2 rounded-lg bg-gray-50 p-2">
                          <span className="mt-0.5 text-base">🏠</span>
                          <div className="min-w-0 text-xs">
                            <div className="text-gray-400">Quan tâm tin:</div>
                            <Link
                              href={`/tin-dang/${lead.post_id}`}
                              className="line-clamp-2 font-medium text-gray-700 hover:underline"
                            >
                              {postMap[lead.post_id]}
                            </Link>
                          </div>
                        </div>
                      )}

                      {/* Hành động */}
                      {lead.phone && (
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <a
                            href={`tel:${lead.phone}`}
                            className="rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
                          >
                            📞 Gọi ngay
                          </a>
                          <a
                            href={zaloLink(lead.phone)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700 hover:bg-sky-100"
                          >
                            Nhắn Zalo
                          </a>
                          {!lead.is_read && (
                            <form action={markLeadRead}>
                              <input type="hidden" name="id" value={lead.id} />
                              <button
                                type="submit"
                                className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                              >
                                Đã liên hệ
                              </button>
                            </form>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
