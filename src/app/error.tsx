"use client";

import Link from "next/link";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Something went wrong</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted text-sm leading-7">
          The page hit an unexpected error. You can retry the render or return
          home.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button onClick={reset}>Retry</Button>
          <Button asChild variant="ghost">
            <Link href="/">Back home</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
