import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const LOAI_LABEL: Record<string, string> = {
  tin_tuc: "Tin tuc",
  thi_truong: "Thi truong",
  founder: "Goc nhin Founder",
  video: "Video",
};

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
    loai: string | null;
    created_at: string;
  };

  return (
    <article className="mx-auto max-w-3xl">
      <Link href="/tin-tuc" className="text-sm text-brand hover:underline">
        &larr; Quay lai Tin tuc
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

      {item.anh_bia ? (
        <div className="mt-6 overflow-hidden rounded-xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.anh_bia}
            alt={item.tieu_de}
            className="w-full object-cover"
          />
        </div>
      ) : null}

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
