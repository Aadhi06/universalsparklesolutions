import { CheckCircle2, Leaf, ShieldCheck, Wrench } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { standards } from "@/lib/site";

const icons = [CheckCircle2, Wrench, Leaf, ShieldCheck];

export function StandardsStrip() {
  return (
    <section className="border-b border-line bg-surface" aria-label="Service standards">
      <Container className="grid grid-cols-2 gap-4 py-6 sm:gap-6 sm:py-8 lg:grid-cols-4 lg:gap-8 lg:py-9">
        {standards.map((item, index) => {
          const Icon = icons[index];
          return (
            <div key={item.title} className="flex items-center gap-2.5">
              <Icon className="size-5 shrink-0 text-blue" strokeWidth={1.6} aria-hidden />
              <p className="font-display text-[0.95rem] font-semibold tracking-[-0.02em] text-navy sm:text-[1.02rem]">
                {item.title}
              </p>
            </div>
          );
        })}
      </Container>
    </section>
  );
}
