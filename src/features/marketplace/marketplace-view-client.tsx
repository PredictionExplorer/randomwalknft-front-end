"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHero } from "@/components/shared/page-hero";
import { Button } from "@/components/ui/button";
import { OfferCard } from "@/features/offers/offer-card";

import { marketplaceQueryOptions } from "./queries";

function marketplaceHref(page: number, pageSize: number) {
  const searchParams = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  return `/marketplace?${searchParams.toString()}`;
}

export function MarketplaceViewClient({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}) {
  const { data } = useSuspenseQuery(
    marketplaceQueryOptions({ page, pageSize }),
  );

  return (
    <div className="space-y-10">
      <PageHero
        description="Curated live sell offers with a cleaner browsing experience, lower latency, and a direct route into each token’s market activity."
        eyebrow="Zero-Fee Market"
        title={
          <>
            LIVE <span className="text-accent">MARKETPLACE</span>
          </>
        }
      />

      {data.items.length === 0 ? (
        <EmptyState
          body="There are no active sell offers right now. Check back later or browse the collection for off-market tokens."
          title="No active listings"
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {data.items.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      )}

      <div className="border-border bg-panel/60 flex items-center justify-between gap-4 rounded-[2rem] border p-4">
        <Button asChild disabled={page <= 1} variant="ghost">
          <Link
            aria-disabled={page <= 1}
            href={marketplaceHref(Math.max(1, page - 1), pageSize)}
          >
            Previous
          </Link>
        </Button>
        <p className="text-muted text-sm tracking-[0.18em] uppercase">
          Page {data.page} of {data.totalPages}
        </p>
        <Button asChild disabled={page >= data.totalPages} variant="ghost">
          <Link
            aria-disabled={page >= data.totalPages}
            href={marketplaceHref(
              Math.min(data.totalPages, page + 1),
              pageSize,
            )}
          >
            Next
          </Link>
        </Button>
      </div>
    </div>
  );
}
