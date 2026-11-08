import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import {
  pricingDisclaimer,
  servicePricingBySlug,
} from "@/lib/site";

export function ServicePricing({ slug }: { slug: string }) {
  const block = servicePricingBySlug[slug];
  if (!block) return null;

  return (
    <section className="border-y border-line bg-surface py-12 sm:py-16">
      <Container>
        <p className="text-[0.72rem] font-semibold tracking-[0.14em] text-blue uppercase sm:text-[0.78rem] sm:tracking-[0.18em]">
          {block.eyebrow}
        </p>
        <h2 className="font-display mt-3 text-[1.65rem] font-semibold text-navy sm:text-[2rem]">
          {block.title}
        </h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-body">{block.intro}</p>

        <div className="mt-8 overflow-hidden rounded-[6px] border border-line bg-white">
          <ul className="divide-y divide-line">
            {block.rows.map((row) => (
              <li
                key={row.label}
                className="flex flex-col gap-1 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-5"
              >
                <div>
                  <p className="font-display font-semibold text-navy">{row.label}</p>
                  {row.note ? (
                    <p className="mt-0.5 text-[0.92rem] text-muted">{row.note}</p>
                  ) : null}
                </div>
                <p className="shrink-0 font-display text-[1.15rem] font-semibold text-blue sm:text-right">
                  {row.price}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {block.footnote ? (
          <p className="mt-4 max-w-3xl text-[0.92rem] leading-relaxed text-muted">
            {block.footnote}
          </p>
        ) : null}
        <p className="mt-3 max-w-3xl text-[0.92rem] leading-relaxed text-muted">
          {pricingDisclaimer}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <ButtonLink href="/contact#quote" className="w-full sm:w-auto">
            Confirm Your Quote
          </ButtonLink>
          <Link
            href="/pricing"
            className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-blue"
          >
            View full pricing guide
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
