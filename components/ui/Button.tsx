import Link from "next/link";
import { cn } from "@/lib/cn";

const variants = {
  primary:
    "bg-blue text-white hover:bg-blue-dark shadow-[0_1px_0_rgb(16_35_66_/_0.08)]",
  secondary:
    "bg-white text-navy border border-navy/15 hover:border-navy/40 hover:bg-surface",
  ghost: "bg-transparent text-navy hover:bg-surface",
  gold: "bg-navy text-white hover:bg-navy-deep",
};

type Common = {
  children: React.ReactNode;
  className?: string;
  variant?: keyof typeof variants;
};

export function ButtonLink({
  href,
  children,
  className,
  variant = "primary",
  onClick,
}: Common & { href: string; onClick?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "inline-flex min-h-12 cursor-pointer items-center justify-center rounded-[6px] px-5 text-[0.95rem] font-semibold tracking-[-0.01em] transition-colors duration-200",
        variants[variant],
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function Button({
  children,
  className,
  variant = "primary",
  type = "button",
  disabled,
  ...props
}: Common & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        "inline-flex min-h-12 cursor-pointer items-center justify-center rounded-[6px] px-5 text-[0.95rem] font-semibold tracking-[-0.01em] transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
