import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatEth, formatTokenId } from "@/lib/format";
import type { Offer } from "@/types";

export function OfferCard({ offer }: { offer: Offer }) {
  return (
    <Link href={`/detail/${offer.tokenId}`}>
      <Card className="group hover:border-border-strong overflow-hidden transition duration-300 hover:-translate-y-1">
        <div className="relative aspect-[4/5] overflow-hidden bg-black">
          <Image
            alt={offer.tokenName}
            className="object-cover transition duration-500 group-hover:scale-[1.02]"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            src={offer.imageThumb}
          />
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black via-black/70 to-transparent px-4 py-5">
            <Badge variant="accent">{offer.type}</Badge>
            <p className="font-display text-lg tracking-[0.12em] uppercase">
              {formatEth(offer.priceWei)} ETH
            </p>
          </div>
        </div>
        <CardContent className="space-y-2 p-5">
          <p className="text-muted text-xs tracking-[0.18em] uppercase">
            {formatTokenId(offer.tokenId)}
          </p>
          <h3 className="font-display text-lg tracking-[0.14em] uppercase">
            {offer.tokenName || formatTokenId(offer.tokenId)}
          </h3>
        </CardContent>
      </Card>
    </Link>
  );
}
