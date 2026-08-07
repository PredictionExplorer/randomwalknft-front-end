import { Card, CardContent } from "@/components/ui/card";

export function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="space-y-3 p-6">
        <p className="text-muted text-xs tracking-[0.18em] uppercase">
          {label}
        </p>
        <p className="font-display text-3xl tracking-[0.12em] uppercase">
          {value}
        </p>
      </CardContent>
    </Card>
  );
}
