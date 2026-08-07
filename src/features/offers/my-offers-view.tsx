"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useConnection } from "wagmi";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHero } from "@/components/shared/page-hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useWalletTransactions } from "@/features/wallet/use-wallet-transactions";
import { WalletGuard } from "@/features/wallet/wallet-guard";
import { marketAbi } from "@/lib/abis";
import { getPublicEnv } from "@/lib/env";
import { formatEth, formatTokenId } from "@/lib/format";
import { queryKeys } from "@/lib/query/query-keys";
import type { Offer } from "@/types";

import { walletOffersQueryOptions } from "./queries";

const env = getPublicEnv();

function OfferTable({
  offers,
  title,
  onCancel,
  disabled,
  pending,
}: {
  disabled: boolean;
  offers: Offer[];
  title: string;
  onCancel: (offer: Offer) => Promise<void>;
  pending: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {offers.length > 0 ? (
          offers.map((offer) => (
            <div
              className="border-border flex flex-col gap-4 rounded-[1.5rem] border bg-white/4 p-4 lg:flex-row lg:items-center lg:justify-between"
              key={offer.id}
            >
              <div className="space-y-2">
                <Link
                  className="font-display text-lg tracking-[0.14em] uppercase"
                  href={`/detail/${offer.tokenId}`}
                >
                  {offer.tokenName || formatTokenId(offer.tokenId)}
                </Link>
                <p className="text-muted text-sm">
                  {formatEth(offer.priceWei)} ETH
                </p>
              </div>
              <Button
                disabled={disabled}
                onClick={() => void onCancel(offer).catch(() => undefined)}
                variant="ghost"
              >
                {pending ? "Waiting for wallet..." : "Cancel offer"}
              </Button>
            </div>
          ))
        ) : (
          <p className="text-muted text-sm">No offers in this category.</p>
        )}
      </CardContent>
    </Card>
  );
}

export function MyOffersView() {
  const { address } = useConnection();
  const offersQuery = useQuery({
    ...walletOffersQueryOptions(
      address ?? "0x0000000000000000000000000000000000000000",
    ),
    enabled: Boolean(address),
  });
  const { isPending, isReady, refreshAfterMutation, runContract } =
    useWalletTransactions();

  async function handleCancel(offer: Offer) {
    if (!address) return;
    await runContract("Cancel offer", {
      abi: marketAbi,
      address: env.marketAddress,
      functionName: offer.type === "buy" ? "cancelBuyOffer" : "cancelSellOffer",
      args: [BigInt(offer.id)],
    });
    refreshAfterMutation([
      queryKeys.walletOffers(address),
      queryKeys.detail(offer.tokenId),
    ]);
  }

  return (
    <WalletGuard
      body="Connect a wallet to review active buy and sell offers."
      title="Wallet connection required"
    >
      <div className="space-y-10">
        <PageHero
          description="Track and cancel buy and sell offers without leaving the app shell."
          eyebrow="Connected Wallet"
          title={
            <>
              MY <span className="text-accent">OFFERS</span>
            </>
          }
        />
        {offersQuery.isPending ? (
          <div
            aria-label="Loading wallet offers"
            className="grid gap-6 xl:grid-cols-2"
          >
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        ) : offersQuery.isError ? (
          <EmptyState
            body="Your offers could not be loaded. Check your connection and try again."
            title="Wallet data unavailable"
          />
        ) : (
          <div className="grid gap-6 xl:grid-cols-2">
            <OfferTable
              offers={offersQuery.data?.buyOffers ?? []}
              onCancel={handleCancel}
              disabled={!isReady || isPending}
              pending={isPending}
              title="Buy offers"
            />
            <OfferTable
              offers={offersQuery.data?.sellOffers ?? []}
              onCancel={handleCancel}
              disabled={!isReady || isPending}
              pending={isPending}
              title="Sell offers"
            />
          </div>
        )}
      </div>
    </WalletGuard>
  );
}
