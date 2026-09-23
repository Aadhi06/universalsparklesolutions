import { cn } from "@/lib/cn";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p className="mb-3 text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-blue">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-display text-[1.65rem] leading-[1.2] font-semibold text-pretty text-navy sm:text-[2.35rem]">
        {title}
      </h2>
      {intro ? (
        <p
          className={cn(
            "mt-3 text-[1rem] leading-relaxed text-body sm:mt-4 sm:text-[1.05rem]",
            align === "center" && "mx-auto max-w-2xl",
          )}
        >
          {intro}
        </p>
      ) : null}
    </div>
  );
}
