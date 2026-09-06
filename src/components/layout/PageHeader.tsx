import type { ReactNode } from "react";
import { Aurora } from "@/components/animations/backgrounds";
import { SplitText } from "@/components/animations/text";
import { Reveal } from "@/components/animations/interactive";

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-border/40 px-4 pt-32 pb-14 sm:px-6 sm:pt-40 sm:pb-16">
      <Aurora intensity={0.28} />
      <div
        aria-hidden
        className="grid-lines pointer-events-none absolute inset-0 opacity-25 [mask-image:radial-gradient(60%_60%_at_50%_0%,black,transparent)]"
      />
      <div className="relative mx-auto max-w-7xl">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-4 max-w-4xl text-4xl leading-[1.05] font-semibold sm:text-5xl lg:text-6xl">
          <SplitText text={title} />
        </h1>
        <Reveal delay={0.15}>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {description}
          </p>
        </Reveal>
        {children && <Reveal delay={0.25}>{children}</Reveal>}
      </div>
    </section>
  );
}
