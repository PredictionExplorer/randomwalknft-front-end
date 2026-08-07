import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <Card className="mx-auto w-full max-w-5xl">
      <CardHeader className="space-y-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-14 w-96 max-w-full" />
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2">
        <Skeleton className="aspect-square w-full rounded-[1.5rem]" />
        <div className="space-y-4">
          <Skeleton className="h-12 w-full rounded-2xl" />
          <Skeleton className="h-12 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-[1.5rem]" />
        </div>
      </CardContent>
    </Card>
  );
}
