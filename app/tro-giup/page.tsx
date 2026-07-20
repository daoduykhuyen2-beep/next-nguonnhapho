"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { HELP_CATEGORIES, HELP_ARTICLES, HELP_CONTACT } from "@/lib/help";

export default function TroGiupPage() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return HELP_ARTICLES.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <>
      {/* Hero + Search */}
      <section className="border-b border-gray-200 bg-brand-light">
        <div className="mx-auto max-w-6xl px-4 py-14 text-center sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand">
            Trung tâm trợ giúp
          </p>
          <h1 className="mt-2 text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl">
            Chúng tôi có thể giúp gì cho bạn?
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-600 sm:text-base">
            Tìm hướng dẫn đăng tin, gói thành viên, thanh toán và câu hỏi thường gặp.
          </p>

          <div className="relative mx-auto mt-6 max-w-xl">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nhập câu hỏi hoặc từ khóa..."
              className="w-full rounded-full border border-gray-300 bg-white px-5 py-3 text-sm shadow-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
            />

            {query.trim() && (
              <div className="absolute z-10 mt-2 w-full overflow-hidden rounded-xl border border-gray-200 bg-white text-left shadow-lg">
                {results.length > 0 ? (
                  results.map((a) => (
                    <Link
                      key={a.slug}
                      href={`/tro-giup/${a.slug}`}
                      className="block border-b border-gray-100 px-4 py-3 last:border-0 hover:bg-brand-light"
                    >
                      <div className="text-sm font-semibold text-gray-900">{a.title}</div>
                      <div className="text-xs text-gray-500">{a.summary}</div>
                    </Link>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-500">
                    Không tìm thấy kết quả phù hợp.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Category cards */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-xl font-bold text-gray-900">Danh mục trợ giúp</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {HELP_CATEGORIES.map((cat) => {
            const count = HELP_ARTICLES.filter((a) => a.category === cat.slug).length;
            return (
              <div
                key={cat.slug}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="text-3xl">{cat.icon}</div>
                <h3 className="mt-3 text-base font-bold text-gray-900">{cat.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{cat.description}</p>
                <ul className="mt-4 space-y-2">
                  {HELP_ARTICLES.filter((a) => a.category === cat.slug)
                    .slice(0, 3)
                    .map((a) => (
                      <li key={a.slug}>
                        <Link
                          href={`/tro-giup/${a.slug}`}
                          className="text-sm text-gray-700 hover:text-brand"
                        >
                          {a.title}
                        </Link>
                      </li>
                    ))}
                </ul>
                <p className="mt-3 text-xs font-medium text-gray-400">{count} bài viết</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Contact */}
      <section className="border-t border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-10 text-center">
          <h2 className="text-lg font-bold text-gray-900">Vẫn cần hỗ trợ?</h2>
          <p className="mt-2 text-sm text-gray-600">
            Liên hệ hotline{" "}
            <span className="font-semibold text-brand">{HELP_CONTACT.hotline}</span> hoặc email{" "}
            <a href={`mailto:${HELP_CONTACT.email}`} className="font-semibold text-brand hover:underline">
              {HELP_CONTACT.email}
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
