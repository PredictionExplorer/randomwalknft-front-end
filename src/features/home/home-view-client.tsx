"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { PageHero } from "@/components/shared/page-hero";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TokenCard } from "@/features/tokens/token-card";
import { formatInteger, serializeMintPrice } from "@/lib/format";
import type { TokenSummary } from "@/types";

import { homeQueryOptions } from "./queries";

export function HomeViewClient({
  featuredTokens,
}: {
  featuredTokens: TokenSummary[];
}) {
  const { data } = useSuspenseQuery(homeQueryOptions());

  return (
    <div className="space-y-14">
      <section className="grid gap-12 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
        <div className="noise-overlay overflow-hidden rounded-[2rem] border border-white/8 bg-[url('/brand/back.png')] bg-cover bg-center p-8 shadow-[0_40px_120px_rgba(0,0,0,0.35)] sm:p-12">
          <PageHero
            description="A cinematic generative-art experience rebuilt on a modern frontend stack. Mint on Arbitrum, explore the collection, and trade through a zero-fee marketplace."
            eyebrow="Generative Art on Arbitrum"
            title={
              <>
                RANDOM <span className="text-accent">WALK</span>{" "}
                <span className="text-highlight">NFT</span>
              </>
            }
          />
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/mint">
                Mint now
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <Link href="/gallery">Browse gallery</Link>
            </Button>
          </div>
        </div>
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle>Live Snapshot</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <StatCard
              label="Mint Price"
              value={serializeMintPrice(data.displayMintPriceWei)}
            />
            <StatCard label="Supply" value={formatInteger(data.totalSupply)} />
            <StatCard
              label="Rendered Frames"
              value={formatInteger(data.finishedCount)}
            />
            <StatCard
              label="Marketplace Listings"
              value={formatInteger(data.activeSellOffers)}
            />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Minting</CardTitle>
          </CardHeader>
          <CardContent className="text-muted space-y-4 text-sm leading-7">
            <p>
              Each mint increases the next price and kicks off media generation
              through the backend pipeline.
            </p>
            <p className="font-display text-foreground tracking-[0.14em] uppercase">
              Current payable price:{" "}
              {serializeMintPrice(data.displayMintPriceWei)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Gallery</CardTitle>
          </CardHeader>
          <CardContent className="text-muted space-y-4 text-sm leading-7">
            <p>
              View the full archive with owner filters, spotlight mode, and
              deep-linked media variants.
            </p>
            <Button asChild variant="ghost">
              <Link href="/gallery">Explore collection</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Marketplace</CardTitle>
          </CardHeader>
          <CardContent className="text-muted space-y-4 text-sm leading-7">
            <p>
              Review live listings and purchase without platform fees through
              the built-in market.
            </p>
            <Button asChild variant="ghost">
              <Link href="/marketplace">See live offers</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-muted text-xs tracking-[0.18em] uppercase">
              Featured Tokens
            </p>
            <h2 className="font-display text-3xl tracking-[0.16em] uppercase">
              Collection Highlights
            </h2>
          </div>
          <Button asChild variant="ghost">
            <Link href="/gallery">View all tokens</Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {featuredTokens.map((token, index) => (
            <TokenCard key={token.id} priority={index < 2} token={token} />
          ))}
        </div>
      </section>
    </div>
  );
}
