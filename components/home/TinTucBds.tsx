import Link from "next/link";

export type TinTucItem = {
  id: string | number;
  tieu_de: string;
  mo_ta?: string | null;
  anh_bia?: string | null;
  loai?: string | null;
  created_at?: string | null;
};

function thoiGian(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const diff = Math.max(0, Date.now() - d.getTime());
  const ngay = Math.floor(diff / 86400000);
  if (ngay <= 0) return "Hôm nay";
  if (ngay === 1) return "1 ngày trước";
  if (ngay < 30) return ngay + " ngày trước";
  const thang = Math.floor(ngay / 30);
  if (thang < 12) return thang + " tháng trước";
  return Math.floor(thang / 12) + " năm trước";
}

export default function TinTucBds({ items }: { items: TinTucItem[] }) {
  if (!items || items.length === 0) return null;
  const noiBat = items[0];
  const conLai = items.slice(1, 6);

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-5 flex items-end justify-between">
        <h2 className="text-xl font-bold text-brand sm:text-2xl">
          Tin tức bất động sản
        </h2>
        <Link
          href="/tin-tuc"
          className="text-sm font-semibold text-[var(--np-do)] hover:underline"
        >
          Xem thêm &rarr;
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Bài nổi bật bên trái */}
        <Link href={`/tin-tuc/${noiBat.id}`} className="group block">
          <div className="overflow-hidden rounded-2xl bg-[var(--np-nen)]">
            {noiBat.anh_bia ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={noiBat.anh_bia}
                alt={noiBat.tieu_de}
                className="aspect-[16/10] w-full object-cover transition duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="aspect-[16/10] w-full bg-[var(--np-vien)]" />
            )}
          </div>
          <h3 className="mt-4 text-lg font-bold leading-snug text-[var(--np-muc)] line-clamp-2 group-hover:text-[var(--np-do)] sm:text-xl">
            {noiBat.tieu_de}
          </h3>
          {noiBat.created_at ? (
            <p className="mt-2 flex items-center gap-1.5 text-sm text-gray-400">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {thoiGian(noiBat.created_at)}
            </p>
          ) : null}
        </Link>

        {/* Danh sách bên phải */}
        <ul className="divide-y divide-[var(--np-vien)]">
          {conLai.map((n) => (
            <li key={n.id}>
              <Link href={`/tin-tuc/${n.id}`} className="block py-4 first:pt-0 group">
                <h4 className="text-base font-semibold leading-snug text-[var(--np-muc)] line-clamp-2 group-hover:text-[var(--np-do)]">
                  {n.tieu_de}
                </h4>
                {n.mo_ta ? (
                  <p className="mt-1 text-sm text-gray-500 line-clamp-1">{n.mo_ta}</p>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
