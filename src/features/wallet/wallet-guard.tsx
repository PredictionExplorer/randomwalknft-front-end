"use client";

import { useConnection } from "wagmi";

import { WalletConnect } from "@/components/layout/wallet-connect";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { appChain } from "@/lib/wallet/config";

export function WalletGuard({
  body,
  children,
  title,
}: {
  body: string;
  children: React.ReactNode;
  title: string;
}) {
  const connection = useConnection();

  if (
    connection.status === "connecting" ||
    connection.status === "reconnecting"
  ) {
    return (
      <div
        aria-label="Restoring wallet connection"
        className="space-y-4"
        role="status"
      >
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!connection.isConnected) {
    return <EmptyState body={body} cta={<WalletConnect />} title={title} />;
  }

  if (connection.chainId !== appChain.id) {
    return (
      <EmptyState
        body="This action is available on Arbitrum. Switch networks before continuing."
        cta={<WalletConnect />}
        title="Switch to Arbitrum"
      />
    );
  }

  return <>{children}</>;
}
