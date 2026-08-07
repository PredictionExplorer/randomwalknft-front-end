"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Grid2X2, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHero } from "@/components/shared/page-hero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TokenCard } from "@/features/tokens/token-card";
import type { GallerySort, GalleryView as GalleryViewMode } from "@/types";

import { galleryQueryOptions, getGalleryQueryString } from "./queries";

function buildGalleryHref(params: {
  address?: string | null;
  page: number;
  pageSize: number;
  sort: GallerySort;
  view: GalleryViewMode;
}) {
  const query = getGalleryQueryString(params);
  return `/gallery?${query}`;
}

export function GalleryViewClient({
  address,
  page,
  pageSize,
  sort,
  view,
}: {
  address: string | null;
  page: number;
  pageSize: number;
  sort: GallerySort;
  view: GalleryViewMode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [ownerInput, setOwnerInput] = useState(address ?? "");
  const { data } = useSuspenseQuery(
    galleryQueryOptions({
      address,
      page,
      pageSize,
      sort,
      view,
    }),
  );

  return (
    <div className="space-y-10">
      <PageHero
        description="Explore the full Random Walk NFT archive with owner filtering, deep links into every token, and a presentation mode that feels built for generative art."
        eyebrow="Collection Browser"
        title={
          <>
            RANDOM <span className="text-accent">WALK</span> GALLERY
          </>
        }
      />

      <div className="border-border bg-panel/80 flex flex-col gap-5 rounded-[2rem] border p-6 backdrop-blur-xl">
        <form
          className="grid gap-4 lg:grid-cols-[1fr_auto_auto]"
          onSubmit={(event) => {
            event.preventDefault();
            const nextParams = new URLSearchParams(searchParams.toString());
            if (ownerInput) {
              nextParams.set("address", ownerInput);
            } else {
              nextParams.delete("address");
            }
            nextParams.set("page", "1");
            router.push(`${pathname}?${nextParams.toString()}`);
          }}
        >
          <Input
            onChange={(event) => setOwnerInput(event.target.value)}
            placeholder="Filter by wallet address"
            value={ownerInput}
          />
          <Tabs
            onValueChange={(nextValue) => {
              router.push(
                buildGalleryHref({
                  address,
                  page: 1,
                  pageSize,
                  sort: nextValue as GallerySort,
                  view,
                }),
              );
            }}
            value={sort}
          >
            <TabsList>
              <TabsTrigger value="latest">Latest</TabsTrigger>
              <TabsTrigger value="earliest">Earliest</TabsTrigger>
            </TabsList>
          </Tabs>
          <Tabs
            onValueChange={(nextValue) => {
              router.push(
                buildGalleryHref({
                  address,
                  page: 1,
                  pageSize,
                  sort,
                  view: nextValue as GalleryViewMode,
                }),
              );
            }}
            value={view}
          >
            <TabsList>
              <TabsTrigger value="grid">
                <Grid2X2 className="size-4" />
                Grid
              </TabsTrigger>
              <TabsTrigger value="spotlight">
                <Sparkles className="size-4" />
                Spotlight
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </form>
        <div className="text-muted flex flex-wrap items-center justify-between gap-4 text-sm">
          <p>
            Showing {data.items.length} of {data.totalItems} tokens
            {data.ownerAddress ? ` owned by ${data.ownerAddress}` : ""}.
          </p>
          {address ? (
            <Button asChild variant="ghost">
              <Link
                href={buildGalleryHref({
                  address: null,
                  page: 1,
                  pageSize,
                  sort,
                  view,
                })}
              >
                Clear owner filter
              </Link>
            </Button>
          ) : null}
        </div>
      </div>

      {data.items.length === 0 ? (
        <EmptyState
          body="No tokens match the current filters. Try a different wallet address or reset to the full collection."
          title="No tokens found"
        />
      ) : (
        <div
          className={
            view === "grid"
              ? "grid gap-6 md:grid-cols-2 xl:grid-cols-3"
              : "grid gap-6 lg:grid-cols-[1.25fr_0.75fr]"
          }
        >
          {view === "grid" ? (
            data.items.map((token, index) => (
              <TokenCard key={token.id} priority={index < 3} token={token} />
            ))
          ) : (
            <>
              <TokenCard priority token={data.items[0]} />
              <div className="grid gap-6">
                {data.items.slice(1, 4).map((token) => (
                  <TokenCard key={token.id} token={token} />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <div className="border-border bg-panel/60 flex items-center justify-between gap-4 rounded-[2rem] border p-4">
        <Button asChild disabled={page <= 1} variant="ghost">
          <Link
            aria-disabled={page <= 1}
            href={buildGalleryHref({
              address,
              page: Math.max(1, page - 1),
              pageSize,
              sort,
              view,
            })}
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
            href={buildGalleryHref({
              address,
              page: Math.min(data.totalPages, page + 1),
              pageSize,
              sort,
              view,
            })}
          >
            Next
          </Link>
        </Button>
      </div>
    </div>
  );
}
