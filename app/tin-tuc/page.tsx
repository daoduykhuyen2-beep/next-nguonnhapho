import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type News = {
  id: number;
  tieu_de: string;
  mo_ta: string | null;
  anh_bia: string | null;
  loai: string | null;
  video_url: string | null;
  created_at: string;
};

const LOAI_LABEL: Record<string, string> = {
  tin_tuc: "Tin tuc",
  thi_truong: "Thi truong",
  founder: "Goc nhin Founder",
  video: "Video",
};

function NewsCard({ item }: { item: News }) {
  return (
    <Link
      href={`/tin-tuc/${item.id}`}
      className="group block overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
        {item.anh_bia ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.anh_bia}
            alt={item.tieu_de}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : null}
        {item.loai ? (
          <span className="absolute left-3 top-3 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">
            {LOAI_LABEL[item.loai] ?? item.loai}
          </span>
        ) : null}
      </div>
      <div className="p-4">
        <h3 className="line-clamp-2 font-semibold text-gray-900 group-hover:text-brand">
          {item.tieu_de}
        </h3>
        {item.mo_ta ? (
          <p className="mt-2 line-clamp-2 text-sm text-gray-600">{item.mo_ta}</p>
        ) : null}
        <p className="mt-3 text-xs text-gray-400">
          {new Date(item.created_at).toLocaleDateString("vi-VN")}
        </p>
      </div>
    </Link>
  );
}

export default async function TinTucPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("news")
    .select("*")
    .order("created_at", { ascending: false });

  const items = (data ?? []) as News[];
  const videos = items.filter((n) => n.loai === "video");
  const articles = items.filter((n) => n.loai !== "video");

  return (
    <div className="space-y-10">
      <section className="rounded-2xl bg-brand px-6 py-10 text-white">
        <h1 className="text-3xl font-bold">Tin tuc &amp; Thi truong</h1>
        <p className="mt-2 max-w-2xl text-white/90">
          Cap nhat tin tuc bat dong san, kien thuc mua ban nha pho va goc nhin tu
          doi ngu chuyen gia NguonNhaPho.
        </p>
      </section>

      {articles.length > 0 ? (
        <section>
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Bai viet moi nhat</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      ) : null}

      {videos.length > 0 ? (
        <section>
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Video thuc te</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      ) : null}

      {items.length === 0 ? (
        <p className="text-center text-gray-500">Chua co tin tuc nao.</p>
      ) : null}
    </div>
  );
}
