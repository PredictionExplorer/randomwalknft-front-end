import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Minus, Plus } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const Accordion = AccordionPrimitive.Root;
const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(
      "border-border rounded-3xl border bg-white/4 px-6",
      className,
    )}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ children, className, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "group font-display flex flex-1 items-center justify-between py-5 text-left text-base tracking-[0.14em] uppercase",
        className,
      )}
      {...props}
    >
      {children}
      <span className="border-border text-muted relative ml-4 flex size-8 items-center justify-center rounded-full border">
        <Plus className="size-4 group-data-[state=open]:hidden" />
        <Minus className="hidden size-4 group-data-[state=open]:block" />
      </span>
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ children, className, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="text-muted data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
    {...props}
  >
    <div className={cn("pb-5 leading-7", className)}>{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
