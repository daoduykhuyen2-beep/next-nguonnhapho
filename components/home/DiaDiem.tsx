import Link from "next/link";

export type DiaDiemItem = {
  ten: string;
  soTin: string;
  href: string;
  anh: string;
};

/** Card lớn (nổi bật) bên trái */
function CardLon({ item }: { item: DiaDiemItem }) {
  return (
    <Link href={item.href} className="group relative block overflow-hidden rounded-2xl">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.anh}
        alt={item.ten}
        className="h-full min-h-[320px] w-full object-cover transition duration-500 group-hover:scale-105 lg:min-h-[440px]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      <div className="absolute left-0 top-0 p-6">
        <h3 className="text-2xl font-bold text-white drop-shadow">{item.ten}</h3>
        <p className="mt-1 text-sm font-medium text-white/90">{item.soTin} tin đăng</p>
      </div>
    </Link>
  );
}

/** Card nhỏ trong lưới bên phải */
function CardNho({ item }: { item: DiaDiemItem }) {
  return (
    <Link href={item.href} className="group relative block overflow-hidden rounded-2xl">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.anh}
        alt={item.ten}
        className="h-full min-h-[150px] w-full object-cover transition duration-500 group-hover:scale-105 lg:min-h-[210px]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      <div className="absolute left-0 top-0 p-4">
        <h3 className="text-lg font-bold text-white drop-shadow">{item.ten}</h3>
        <p className="mt-0.5 text-xs font-medium text-white/90">{item.soTin} tin đăng</p>
      </div>
    </Link>
  );
}

export default function DiaDiem({ items }: { items: DiaDiemItem[] }) {
  if (!items || items.length === 0) return null;
  const noiBat = items[0];
  const conLai = items.slice(1, 5);

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <h2 className="mb-5 text-xl font-bold text-brand sm:text-2xl">
        Bất động sản theo địa điểm
      </h2>

      <div className="grid gap-4 lg:grid-cols-2">
        <CardLon item={noiBat} />
        <div className="grid grid-cols-2 gap-4">
          {conLai.map((it) => (
            <CardNho key={it.ten} item={it} />
          ))}
        </div>
      </div>
    </section>
  );
}
