import Link from "next/link";

export type TieuDiemItem = {
  id: string | number;
  tieu_de: string;
  anh_bia?: string | null;
};

export default function TieuDiem({ items = [] }: { items?: TieuDiemItem[] }) {
  const ds = (items || []).slice(0, 3);
  if (ds.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <h2 className="mb-5 text-xl font-bold text-brand sm:text-2xl">Tiêu điểm</h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {ds.map((n, i) => (
          <Link key={n.id} href={`/tin-tuc/${n.id}`} className="group block">
            <div className="overflow-hidden rounded-2xl bg-[var(--np-nen)]">
              {n.anh_bia ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={n.anh_bia}
                  alt={n.tieu_de}
                  className="aspect-[16/10] w-full object-cover transition duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="aspect-[16/10] w-full bg-[var(--np-vien)]" />
              )}
            </div>
            <div className="mt-4 flex items-start gap-3">
              <span className="shrink-0 text-3xl font-extrabold leading-none text-[var(--np-vien)] group-hover:text-[var(--np-do)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-base font-bold leading-snug text-[var(--np-muc)] line-clamp-2 group-hover:text-[var(--np-do)]">
                {n.tieu_de}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
