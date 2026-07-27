import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const BASE_URL = "https://nguonnhaphohcm.vn";

async function fetchAllPosts(supabase: Awaited<ReturnType<typeof createClient>>) {
  const pageSize = 1000;
  let from = 0;
  const all: { id: number; created_at: string | null }[] = [];
  for (;;) {
    const { data, error } = await supabase
      .from("web_posts")
      .select("id, created_at")
      .eq("trang_thai", "duyet")
      .order("created_at", { ascending: false })
      .range(from, from + pageSize - 1);
    if (error || !data || data.length === 0) break;
    all.push(...data);
    if (data.length < pageSize) break;
    from += pageSize;
  }
  return all;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/tin-dang`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/du-an`, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/tin-tuc`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/goi-thanh-vien`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/gioi-thieu`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/tuyen-dung`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${BASE_URL}/quy-che`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/chinh-sach-bao-mat`, changeFrequency: "yearly", priority: 0.3 },
  ];

  try {
    const supabase = await createClient();

    const posts = await fetchAllPosts(supabase);
    const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
      url: `${BASE_URL}/tin-dang/${p.id}`,
      lastModified: p.created_at ? new Date(p.created_at) : undefined,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    const { data: newsData } = await supabase
      .from("news")
      .select("id, created_at")
      .order("created_at", { ascending: false })
      .range(0, 4999);
    const newsRoutes: MetadataRoute.Sitemap = (newsData ?? []).map((n) => ({
      url: `${BASE_URL}/tin-tuc/${n.id}`,
      lastModified: n.created_at ? new Date(n.created_at) : undefined,
      changeFrequency: "monthly",
      priority: 0.6,
    }));

    return [...staticRoutes, ...postRoutes, ...newsRoutes];
  } catch {
    return staticRoutes;
  }
}
