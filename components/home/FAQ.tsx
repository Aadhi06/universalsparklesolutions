"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { faqs } from "@/lib/site";
import { cn } from "@/lib/cn";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-surface py-12 sm:py-20 lg:py-24">
      <Container className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-12">
        <SectionHeading title="Common questions" />
        <div>
          {faqs.map((faq, index) => {
            const open = openIndex === index;
            const panelId = `faq-panel-${index}`;
            const buttonId = `faq-button-${index}`;

            return (
              <div key={faq.question} className="border-b border-line">
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={open}
                    aria-controls={panelId}
                    className="flex min-h-14 w-full cursor-pointer items-center justify-between gap-4 py-4 text-left font-display text-[1.02rem] font-semibold text-pretty text-navy sm:min-h-16 sm:text-[1.08rem]"
                    onClick={() => setOpenIndex(open ? null : index)}
                  >
                    {faq.question}
                    <ChevronDown
                      className={cn(
                        "size-5 shrink-0 text-blue transition-transform duration-200",
                        open && "rotate-180",
                      )}
                      aria-hidden
                    />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!open}
                  className="pb-5 leading-relaxed text-body"
                >
                  {faq.answer}
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
