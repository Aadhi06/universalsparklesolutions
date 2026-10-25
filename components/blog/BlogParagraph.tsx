import Link from "next/link";
import { parseBlogText } from "@/lib/blog";

export function BlogParagraph({ text }: { text: string }) {
  return (
    <p className="mt-4 leading-relaxed text-body">
      {parseBlogText(text).map((part, index) =>
        part.type === "link" && part.href ? (
          <Link
            key={`${part.href}-${index}`}
            href={part.href}
            className="font-semibold text-blue underline decoration-blue/30 underline-offset-2 hover:decoration-blue"
          >
            {part.value}
          </Link>
        ) : (
          <span key={`text-${index}`}>{part.value}</span>
        ),
      )}
    </p>
  );
}
