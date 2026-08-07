import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  description: string;
  className?: string;
}

export function PageHero({
  className,
  description,
  eyebrow,
  title,
}: PageHeroProps) {
  return (
    <section className={cn("mb-12 max-w-4xl space-y-5", className)}>
      <Badge variant="accent" className="w-fit">
        {eyebrow}
      </Badge>
      <h1 className="font-display text-4xl leading-none tracking-[0.18em] uppercase sm:text-6xl">
        {title}
      </h1>
      <p className="text-muted max-w-2xl text-base leading-8 sm:text-lg">
        {description}
      </p>
    </section>
  );
}
