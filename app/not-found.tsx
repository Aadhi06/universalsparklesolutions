import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <Container className="py-16 sm:py-24">
      <h1 className="font-display text-[1.7rem] font-semibold text-navy sm:text-3xl">
        Page not found
      </h1>
      <p className="mt-4 max-w-xl text-body">
        The page you were looking for is not available. Return to the homepage
        or request a quote.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/" className="w-full sm:w-auto">
          Back to home
        </ButtonLink>
        <ButtonLink href="/contact#quote" variant="secondary" className="w-full sm:w-auto">
          Request a Free Quote
        </ButtonLink>
      </div>
    </Container>
  );
}
