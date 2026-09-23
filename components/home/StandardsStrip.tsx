import { CheckCircle2, Leaf, ShieldCheck, Wrench } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { standards } from "@/lib/site";

const icons = [CheckCircle2, Wrench, Leaf, ShieldCheck];

export function StandardsStrip() {
  return (
    <section className="border-b border-line bg-surface" aria-label="Service standards">
      <Container className="grid gap-6 py-7 sm:grid-cols-2 sm:gap-8 sm:py-8 lg:grid-cols-4 lg:gap-10 lg:py-10">
        {standards.map((item, index) => {
          const Icon = icons[index];
          return (
            <div key={item.title} className="flex gap-3">
              <Icon className="mt-0.5 size-5 shrink-0 text-blue" strokeWidth={1.6} aria-hidden />
              <div>
                <h2 className="font-display text-[1.02rem] font-semibold tracking-[-0.02em] text-navy">
                  {item.title}
                </h2>
                <p className="mt-1 text-[0.92rem] leading-relaxed text-muted">
                  {item.text}
                </p>
              </div>
            </div>
          );
        })}
      </Container>
    </section>
  );
}
