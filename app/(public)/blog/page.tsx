import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/layout/PageIntro";
import { Container } from "@/components/ui/Container";
import { formatPostDate, posts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Cleaning guides for Melbourne",
  description:
    "Practical guides to office cleaning, house cleaning, end of lease, carpet, clinic and builders cleaning across Melbourne and Regional Victoria.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return (
    <>
      <PageIntro
        eyebrow="Guides"
        title="Cleaning guides for Melbourne workplaces and homes"
        intro="Plain-language notes on office cleaning, house cleaning, end of lease, carpets, clinics and builders cleans across Melbourne and Regional Victoria."
      />
      <section className="bg-white py-12 lg:py-16">
        <Container>
          <ul className="grid gap-5 md:grid-cols-2">
            {posts.map((post) => (
              <li key={post.slug}>
                <article className="flex h-full flex-col rounded-[6px] border border-line bg-white p-6">
                  <p className="text-sm text-muted">{formatPostDate(post.published)}</p>
                  <h2 className="font-display mt-2 text-2xl font-semibold text-navy">
                    <Link href={`/blog/${post.slug}`} className="hover:text-blue">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-3 flex-1 leading-relaxed text-body">{post.description}</p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="mt-5 inline-flex min-h-11 items-center font-semibold text-blue"
                  >
                    Read the guide
                  </Link>
                </article>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
