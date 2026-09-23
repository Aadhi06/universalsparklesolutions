import { Container } from "@/components/ui/Container";

export function PageIntro({
  eyebrow,
  title,
  intro,
}: {
  eyebrow?: string;
  title: string;
  intro: string;
}) {
  return (
    <section className="border-b border-line bg-surface">
      <Container className="py-10 sm:py-16">
        {eyebrow ? (
          <p className="text-[0.72rem] font-semibold tracking-[0.14em] text-blue uppercase sm:text-[0.78rem] sm:tracking-[0.18em]">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-display mt-3 max-w-4xl text-[1.7rem] leading-[1.18] font-semibold text-pretty text-navy sm:text-[2.8rem]">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-[1rem] leading-relaxed text-body sm:mt-5 sm:text-[1.06rem]">
          {intro}
        </p>
      </Container>
    </section>
  );
}
