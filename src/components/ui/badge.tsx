import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-[0.18em]",
  {
    variants: {
      variant: {
        default: "border-border text-muted",
        accent: "border-border-strong bg-accent-soft text-highlight",
        success: "border-success/50 bg-success/10 text-success",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return (
    <div className={cn(badgeVariants({ className, variant }))} {...props} />
  );
}

export { Badge, badgeVariants };
