import Link from "next/link";
import { posts } from "@/lib/blog";
import { Container } from "@/components/ui/Container";

export function Guides() {
  return (
    <section className="bg-white py-12 lg:py-16">
      <Container>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[0.72rem] font-semibold tracking-[0.14em] text-blue uppercase">
              Guides
            </p>
            <h2 className="font-display mt-2 text-[1.7rem] font-semibold text-navy sm:text-3xl">
              Cleaning notes for Melbourne
            </h2>
          </div>
          <Link href="/blog" className="inline-flex min-h-11 items-center font-semibold text-blue">
            All guides
          </Link>
        </div>
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {posts.slice(0, 3).map((post) => (
            <li key={post.slug} className="rounded-[6px] border border-line p-5">
              <h3 className="font-display text-xl font-semibold text-navy">
                <Link href={`/blog/${post.slug}`} className="hover:text-blue">
                  {post.title}
                </Link>
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-body">{post.description}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
