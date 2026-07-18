import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const BASE_URL = "https://nguonnhaphohcm.vn";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/tin-dang`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/tin-tuc`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/goi-thanh-vien`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/gioi-thieu`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/tuyen-dung`, changeFrequency: "weekly", priority: 0.5 },
  ];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("web_posts")
      .select("id, created_at")
      .eq("trang_thai", "duyet")
      .order("created_at", { ascending: false })
      .limit(1000);

    const postRoutes: MetadataRoute.Sitemap = (data ?? []).map((p) => ({
      url: `${BASE_URL}/tin-dang/${p.id}`,
      lastModified: p.created_at ? new Date(p.created_at) : undefined,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    return [...staticRoutes, ...postRoutes];
  } catch {
    return staticRoutes;
  }
}
import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const BASE_URL = "https://nguonnhaphohcm.vn";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/tin-dang`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/dang-nhap`, priority: 0.3 },
    { url: `${BASE_URL}/dang-ky`, priority: 0.3 },
  ];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("web_posts")
      .select("id, created_at")
      .eq("trang_thai", "duyet")
      .order("created_at", { ascending: false })
      .limit(1000);

    const postRoutes: MetadataRoute.Sitemap = (data ?? []).map((p) => ({
      url: `${BASE_URL}/tin-dang/${p.id}`,
      lastModified: p.created_at ? new Date(p.created_at) : undefined,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    return [...staticRoutes, ...postRoutes];
  } catch {
    return staticRoutes;
  }
}
