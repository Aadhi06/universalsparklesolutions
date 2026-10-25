import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/layout/PageIntro";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { formatPostDate, getPost, posts } from "@/lib/blog";
import { getSiteUrl } from "@/lib/site";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `/blog/${post.slug}`,
      publishedTime: post.published,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = posts.filter((item) => item.slug !== post.slug).slice(0, 3);
  const articleData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.published,
    dateModified: post.published,
    author: {
      "@type": "Organization",
      name: "Universal Sparkle Solution Pty Ltd",
      url: getSiteUrl(),
    },
    mainEntityOfPage: `${getSiteUrl()}/blog/${post.slug}`,
    keywords: post.keywords.join(", "),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleData) }}
      />
      <PageIntro eyebrow="Guide" title={post.title} intro={post.description} />
      <article className="bg-white py-12 lg:py-16">
        <Container className="max-w-3xl">
          <p className="text-sm text-muted">{formatPostDate(post.published)}</p>
          <div className="mt-8 space-y-10">
            {post.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-display text-2xl font-semibold text-navy">{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="mt-4 leading-relaxed text-body">
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/contact#quote" className="w-full sm:w-auto">
              Request a Free Quote
            </ButtonLink>
            <ButtonLink href={post.serviceHref} variant="secondary" className="w-full sm:w-auto">
              {post.serviceLabel}
            </ButtonLink>
          </div>
          <p className="mt-8 text-sm">
            <Link href="/blog" className="font-semibold text-blue">
              All cleaning guides
            </Link>
          </p>
        </Container>
      </article>
      <section className="border-t border-line bg-surface py-12">
        <Container>
          <h2 className="font-display text-2xl font-semibold text-navy">More guides</h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-3">
            {related.map((item) => (
              <li key={item.slug}>
                <Link href={`/blog/${item.slug}`} className="font-semibold text-navy hover:text-blue">
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
