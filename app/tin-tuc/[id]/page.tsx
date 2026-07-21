import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { pickStockImage } from "@/lib/stockImages";

export const dynamic = "force-dynamic";

const LOAI_LABEL: Record<string, string> = {
  tin_tuc: "Tin tức",
  thi_truong: "Thị trường",
  founder: "Góc nhìn Founder",
  video: "Video",
};

const STOCK = [
  "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/B%E1%BA%BFn_Th%C3%A0nh_Market.jpg/960px-B%E1%BA%BFn_Th%C3%A0nh_Market.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Landmark_81%2C_Ho_Chi_Minh_City%2C_Vietnam_-_February_2021.jpg/960px-Landmark_81%2C_Ho_Chi_Minh_City%2C_Vietnam_-_February_2021.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Bitexco_Financial_Tower.jpg/960px-Bitexco_Financial_Tower.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Saigon_Notre-Dame_Basilica.jpg/960px-Saigon_Notre-Dame_Basilica.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Ho_Chi_Minh_City_Hall.jpg/960px-Ho_Chi_Minh_City_Hall.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Saigon_Central_Post_Office.jpg/960px-Saigon_Central_Post_Office.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Independence_Palace%2C_Ho_Chi_Minh_City.jpg/960px-Independence_Palace%2C_Ho_Chi_Minh_City.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/B%E1%BA%BFn_Nh%C3%A0_R%E1%BB%93ng.jpg/960px-B%E1%BA%BFn_Nh%C3%A0_R%E1%BB%93ng.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Ch%E1%BB%A3_B%C3%ACnh_T%C3%A2y.jpg/960px-Ch%E1%BB%A3_B%C3%ACnh_T%C3%A2y.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Saigon_Opera_House.jpg/960px-Saigon_Opera_House.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Ho_Chi_Minh_City%2C_Nguyen_Hue_Street%2C_2020-01_CN-01.jpg/960px-Ho_Chi_Minh_City%2C_Nguyen_Hue_Street%2C_2020-01_CN-01.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Thu_Thiem_Bridge_at_night.jpg/960px-Thu_Thiem_Bridge_at_night.jpg",
];

const isRealImg = (u?: string | null) =>
  !!u && !u.startsWith("data:") && !/placeholder|default/i.test(u);

export default async function TinTucDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("news")
    .select("*")
    .eq("id", id)
    .single();

  if (!data) {
    notFound();
  }

  const item = data as {
    id: number;
    tieu_de: string;
    mo_ta: string | null;
    noi_dung: string | null;
    anh_bia: string | null;
    hinh_anh?: string[] | null;
    loai: string | null;
    created_at: string;
  };

  const realImgs = (item.hinh_anh && item.hinh_anh.length ? item.hinh_anh : item.anh_bia ? [item.anh_bia] : []).filter(isRealImg) as string[];
  const cover = realImgs.length ? realImgs[0] : pickStockImage(item.id);
  const gallery = realImgs.length ? realImgs : [cover];

  return (
    <article className="mx-auto max-w-3xl">
      <Link href="/tin-tuc" className="text-sm text-brand hover:underline">
        &larr; Quay lại Tin tức
      </Link>

      <div className="mt-4">
        {item.loai ? (
          <span className="inline-block rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">
            {LOAI_LABEL[item.loai] ?? item.loai}
          </span>
        ) : null}
        <h1 className="mt-3 text-3xl font-bold text-gray-900">{item.tieu_de}</h1>
        <p className="mt-2 text-sm text-gray-400">
          {new Date(item.created_at).toLocaleDateString("vi-VN")}
        </p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {gallery.map((src, i) => (
          <div key={src + i} className={`overflow-hidden rounded-xl ${gallery.length === 1 ? "sm:col-span-2" : ""}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={`${item.tieu_de} ${i + 1}`} className="w-full object-cover" />
          </div>
        ))}
      </div>

      {item.mo_ta ? (
        <p className="mt-6 text-lg font-medium text-gray-700">{item.mo_ta}</p>
      ) : null}

      {item.noi_dung ? (
        <div className="mt-4 whitespace-pre-line leading-relaxed text-gray-800">
          {item.noi_dung}
        </div>
      ) : null}
    </article>
  );
}
