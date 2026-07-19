import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Tin tức",
  description:
    "Tin tức & kiến thức mua nhà an toàn, tin thị trường từ các báo lớn, góc nhìn Founder và video thực tế từ Nguồn Nhà Phố HCM.",
};

type NewsItem = {
  id: number;
  tieu_de: string | null;
  mo_ta: string | null;
  anh_bia: string | null;
  hinh_anh: string[] | null;
  loai: string | null;
  video_url: string | null;
};

async function layTin(): Promise<NewsItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("news")
            .select("id, tieu_de, mo_ta, anh_bia, hinh_anh, loai, video_url")
    .order("created_at", { ascending: false });
  if (error) return [];
  return (data as NewsItem[]) ?? [];
}

function NewsCard({ item }: { item: NewsItem }) {
  const isRealImg = (u?: string | null) =>
    !!u && !u.startsWith("data:") && !/placeholder|default/i.test(u);
  const firstHinh = Array.isArray(item.hinh_anh)
    ? item.hinh_anh.find(isRealImg)
    : null;
  const STOCK = [
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=60",
  ];
  const real = firstHinh || (isRealImg(item.anh_bia) ? item.anh_bia : null);
  const cover = real || STOCK[item.id % STOCK.length];
  return (
    <Link
      href={"/tin-tuc/" + item.id}
      className="group overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="relative h-44 w-full overflow-hidden bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cover}
          alt={item.tieu_de ?? ""}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="line-clamp-2 font-semibold text-gray-900 group-hover:text-brand">
          {item.tieu_de}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-gray-500">{item.mo_ta}</p>
      </div>
    </Link>
  );
}

function Section({
  tieuDe,
  moTa,
  items,
}: {
  tieuDe: string;
  moTa?: string;
  items: NewsItem[];
}) {
  if (!items.length) return null;
  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <h2 className="text-2xl font-bold text-brand">{tieuDe}</h2>
      {moTa ? <p className="mt-1 text-gray-500">{moTa}</p> : null}
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

export default async function TinTucPage() {
  const all = await layTin();
  const tinTuc = all.filter((x) => x.loai === "tin_tuc" || !x.loai);
  const thiTruong = all.filter((x) => x.loai === "thi_truong");
  const founder = all.filter((x) => x.loai === "founder");

  return (
    <>
      {/* Hero */}
      <section className="bg-white text-black">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-16">
          <p className="text-sm font-semibold uppercase tracking-widest opacity-80">
            Tin tức & kiến thức
          </p>
          <h1 className="mt-2 max-w-3xl text-3xl font-extrabold leading-tight sm:text-4xl">
            Tin tức & kiến thức mua nhà an toàn
          </h1>
          <p className="mt-4 max-w-2xl text-sm opacity-90 sm:text-base">
            Cập nhật thị trường, cảnh báo rủi ro pháp lý, góc nhìn từ Founder và
            video thực tế — giúp anh chị mua nhà tự tin, an toàn.
          </p>
        </div>
      </section>

      {all.length === 0 ? (
        <div className="mx-auto max-w-6xl px-4 py-16">
          <p className="rounded-lg border bg-white p-6 text-gray-500">
            Chưa có bài viết nào. Vui lòng quay lại sau.
          </p>
        </div>
      ) : (
        <>
          <Section
            tieuDe="Bài viết mới nhất"
            moTa="Kiến thức & kinh nghiệm mua bán nhà phố"
            items={tinTuc}
          />
          <div className="bg-white">
            <Section
              tieuDe="📰 Tin thị trường từ các báo lớn"
              moTa="Tổng hợp diễn biến thị trường bất động sản TP.HCM"
              items={thiTruong}
            />
          </div>
          <Section
            tieuDe="Bài viết từ Founder"
            moTa="Góc nhìn & chia sẻ từ người sáng lập Nguồn Nhà Phố"
            items={founder}
          />
        </>
      )}

      {/* CTA */}
      <section className="bg-gray-100">
        <div className="mx-auto max-w-6xl px-4 py-12 text-center">
          <h2 className="text-2xl font-bold text-brand">
            Cần tư vấn mua nhà an toàn?
          </h2>
          <div className="mt-5 flex justify-center gap-3">
            <Link href="/tin-dang" className="rounded-lg bg-brand px-5 py-2.5 font-semibold text-white hover:opacity-90">
              Xem nhà đang bán
            </Link>
            <Link href="/gioi-thieu" className="rounded-lg border border-brand px-5 py-2.5 font-semibold text-brand hover:bg-brand hover:text-white">
              Về Nguồn Nhà Phố
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
