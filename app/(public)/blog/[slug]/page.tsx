import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogParagraph } from "@/components/blog/BlogParagraph";
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
      images: [{ url: post.image, alt: post.imageAlt }],
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
    image: `${getSiteUrl()}${post.image}`,
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
          <div className="relative aspect-[16/9] overflow-hidden rounded-[6px] bg-surface">
            <Image
              src={post.image}
              alt={post.imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>
          <p className="mt-5 text-sm text-muted">{formatPostDate(post.published)}</p>
          <div className="mt-8 space-y-10">
            {post.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-display text-2xl font-semibold text-navy">{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <BlogParagraph key={paragraph} text={paragraph} />
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
          <ul className="mt-6 grid gap-5 md:grid-cols-3">
            {related.map((item) => (
              <li key={item.slug}>
                <Link href={`/blog/${item.slug}`} className="group block">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-[6px] bg-white">
                    <Image
                      src={item.image}
                      alt={item.imageAlt}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <p className="mt-3 font-semibold text-navy group-hover:text-blue">{item.title}</p>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
