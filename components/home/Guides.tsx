import Image from "next/image";
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
        <ul className="mt-8 grid gap-5 md:grid-cols-3">
          {posts.slice(0, 3).map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-[6px] border border-line"
              >
                <div className="relative aspect-[16/10] bg-surface">
                  <Image
                    src={post.image}
                    alt={post.imageAlt}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-xl font-semibold text-navy group-hover:text-blue">
                    {post.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-body">{post.description}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
