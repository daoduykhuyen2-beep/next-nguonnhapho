import type { MetadataRoute } from "next";

const BASE_URL = "https://nguonnhaphohcm.vn";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/tai-khoan", "/dang-tin", "/sua-tin"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
