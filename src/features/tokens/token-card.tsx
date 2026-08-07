import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatTokenId } from "@/lib/format";
import type { TokenSummary } from "@/types";

export function TokenCard({
  priority = false,
  token,
}: {
  priority?: boolean;
  token: TokenSummary;
}) {
  return (
    <Link href={`/detail/${token.id}`}>
      <Card className="group hover:border-border-strong overflow-hidden transition duration-300 hover:-translate-y-1">
        <div className="relative aspect-[4/5] overflow-hidden bg-black">
          <Image
            alt={token.name}
            className="object-cover transition duration-500 group-hover:scale-[1.02]"
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            src={token.media.blackImageThumb}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          <div className="absolute top-4 left-4">
            <Badge variant="accent">{formatTokenId(token.id)}</Badge>
          </div>
        </div>
        <CardContent className="space-y-2 p-5">
          <p className="text-muted text-xs tracking-[0.18em] uppercase">
            Token
          </p>
          <h3 className="font-display text-lg tracking-[0.14em] uppercase">
            {token.name || formatTokenId(token.id)}
          </h3>
          <p className="text-muted text-sm">
            Explore detail views, media variants, live offers, and wallet
            actions.
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
