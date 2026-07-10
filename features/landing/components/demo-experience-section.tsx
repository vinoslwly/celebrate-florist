import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";

/**
 * Founder decision: the Demo Experience stays in its planned sitemap
 * position, but it isn't functional yet — the Greeting Experience
 * feature it depends on hasn't been built (that's a future sprint).
 * The CTA is intentionally disabled rather than removed, so the page
 * order matches what was approved in Sprint 01A.
 */
export function DemoExperienceSection() {
  return (
    <section
      id="demo"
      className="px-4 py-20 sm:px-6 sm:py-28"
      aria-labelledby="demo-heading"
    >
      <div className="mx-auto max-w-2xl text-center">
        <SectionHeading
          id="demo-heading"
          eyebrow="See It in Action"
          title="Try the experience yourself."
          subtitle="A live, click-through demo is coming soon — for now, keep scrolling to see how it works."
        />
        <Button
          size="lg"
          disabled
          className="mt-8"
          title="Demo coming soon"
          aria-disabled="true"
        >
          ✨ Watch Experience — Coming Soon
        </Button>
      </div>
    </section>
  );
}
