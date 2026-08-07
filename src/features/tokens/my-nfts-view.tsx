"use client";

import { useQuery } from "@tanstack/react-query";
import { useConnection } from "wagmi";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHero } from "@/components/shared/page-hero";
import { Skeleton } from "@/components/ui/skeleton";
import { WalletGuard } from "@/features/wallet/wallet-guard";

import { walletTokensQueryOptions } from "./queries";
import { TokenCard } from "./token-card";

export function MyNftsView() {
  const { address } = useConnection();
  const tokensQuery = useQuery({
    ...walletTokensQueryOptions(
      address ?? "0x0000000000000000000000000000000000000000",
    ),
    enabled: Boolean(address),
  });

  return (
    <WalletGuard
      body="Connect a wallet to load owned tokens, refresh wallet queries, and jump into token actions."
      title="Wallet connection required"
    >
      <div className="space-y-10">
        <PageHero
          description="A wallet-aware view of owned tokens, powered by server-backed reads and client-side query invalidation."
          eyebrow="Connected Wallet"
          title={
            <>
              MY <span className="text-accent">NFTS</span>
            </>
          }
        />
        {tokensQuery.isPending ? (
          <div
            aria-label="Loading owned tokens"
            className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
          >
            {Array.from({ length: 3 }, (_, index) => (
              <Skeleton className="h-80" key={index} />
            ))}
          </div>
        ) : tokensQuery.isError ? (
          <EmptyState
            body="Owned tokens could not be loaded. Check your connection and try again."
            title="Wallet data unavailable"
          />
        ) : tokensQuery.data && tokensQuery.data.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {tokensQuery.data.map((token) => (
              <TokenCard key={token.id} token={token} />
            ))}
          </div>
        ) : (
          <EmptyState
            body="This wallet does not currently own any tokens."
            title="No tokens found"
          />
        )}
      </div>
    </WalletGuard>
  );
}
