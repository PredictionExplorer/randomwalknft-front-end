import type { ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function EmptyState({
  body,
  cta,
  title,
}: {
  body: string;
  cta?: ReactNode;
  title: string;
}) {
  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted max-w-2xl text-sm leading-7">{body}</p>
        {cta}
      </CardContent>
    </Card>
  );
}
