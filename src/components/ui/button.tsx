import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-accent px-5 py-2.5 text-canvas shadow-[0_0_32px_rgba(198,118,215,0.25)] hover:bg-highlight",
        ghost:
          "border border-border bg-transparent px-4 py-2 text-foreground hover:border-border-strong hover:bg-accent-soft",
        subtle: "bg-white/5 px-4 py-2 text-foreground hover:bg-white/10",
      },
      size: {
        default: "h-11",
        lg: "h-12 px-6 text-base",
        sm: "h-9 px-3 text-sm",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild = false, className, size, variant, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ className, size, variant }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
