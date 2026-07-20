import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  HELP_ARTICLES,
  HELP_CATEGORIES,
  getArticle,
  getArticlesByCategory,
  HELP_CONTACT,
  type HelpBlock,
} from "@/lib/help";

export function generateStaticParams() {
  return HELP_ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "Không tìm thấy" };
  return { title: article.title, description: article.summary };
}

function Block({ block }: { block: HelpBlock }) {
  switch (block.type) {
    case "callout":
      return (
        <div className="rounded-lg border-l-4 border-brand bg-brand-light px-5 py-4">
          <p className="text-sm font-bold uppercase tracking-wide text-brand-dark">
            {block.title}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">{block.body}</p>
        </div>
      );
    case "heading":
      return <h2 className="mt-8 text-lg font-bold text-gray-900">{block.text}</h2>;
    case "paragraph":
      return <p className="leading-relaxed text-gray-700">{block.text}</p>;
    case "list":
      return (
        <ul className="ml-5 list-disc space-y-2 text-gray-700">
          {block.items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ul>
      );
    case "steps":
      return (
        <ol className="ml-5 list-decimal space-y-2 text-gray-700">
          {block.items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ol>
      );
    default:
      return null;
  }
}

export default async function HelpArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const category = HELP_CATEGORIES.find((c) => c.slug === article.category);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500">
        <Link href="/tro-giup" className="hover:text-brand">
          Trợ giúp
        </Link>
        <span>/</span>
        <span className="text-gray-700">{category?.name}</span>
        <span>/</span>
        <span className="font-medium text-gray-900">{article.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            {HELP_CATEGORIES.map((cat) => {
              const arts = getArticlesByCategory(cat.slug);
              if (arts.length === 0) return null;
              return (
                <div key={cat.slug} className="mb-4 last:mb-0">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-400">
                    {cat.icon} {cat.name}
                  </p>
                  <ul className="space-y-1">
                    {arts.map((a) => {
                      const active = a.slug === article.slug;
                      return (
                        <li key={a.slug}>
                          <Link
                            href={`/tro-giup/${a.slug}`}
                            className={
                              "block rounded-md px-2 py-1.5 text-sm " +
                              (active
                                ? "bg-brand-light font-semibold text-brand"
                                : "text-gray-700 hover:bg-gray-50 hover:text-brand")
                            }
                          >
                            {a.title}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Article body */}
        <article className="min-w-0">
          <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
            {article.title}
          </h1>
          <p className="mt-2 text-gray-500">{article.summary}</p>

          <div className="mt-6 space-y-4">
            {article.blocks.map((block, i) => (
              <Block key={i} block={block} />
            ))}
          </div>

          {/* FAQ */}
          {article.faqs && article.faqs.length > 0 && (
            <section className="mt-10">
              <h2 className="text-lg font-bold text-gray-900">Câu hỏi thường gặp</h2>
              <div className="mt-4 divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white">
                {article.faqs.map((f, i) => (
                  <details key={i} className="group px-5 py-4">
                    <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-gray-900">
                      {f.q}
                      <span className="ml-4 text-brand transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-gray-600">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* Contact */}
          <div className="mt-10 rounded-2xl bg-gray-50 px-5 py-5 text-sm text-gray-600">
            Cần hỗ trợ thêm? Liên hệ hotline{" "}
            <span className="font-semibold text-brand">{HELP_CONTACT.hotline}</span> hoặc email{" "}
            <a
              href={`mailto:${HELP_CONTACT.email}`}
              className="font-semibold text-brand hover:underline"
            >
              {HELP_CONTACT.email}
            </a>
            .
          </div>
        </article>
      </div>
    </div>
  );
}
