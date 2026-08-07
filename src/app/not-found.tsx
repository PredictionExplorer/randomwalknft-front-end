import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <EmptyState
      body="The requested route or token could not be found."
      cta={
        <Button asChild>
          <Link href="/">Back home</Link>
        </Button>
      }
      title="Not found"
    />
  );
}
