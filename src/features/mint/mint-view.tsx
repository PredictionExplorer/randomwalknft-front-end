"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { decodeEventLog } from "viem";

import { WalletConnect } from "@/components/layout/wallet-connect";
import { PageHero } from "@/components/shared/page-hero";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { useWalletTransactions } from "@/features/wallet/use-wallet-transactions";
import { nftAbi } from "@/lib/abis";
import { getPublicEnv } from "@/lib/env";
import {
  formatCountdown,
  formatDateTime,
  formatEth,
  formatInteger,
} from "@/lib/format";
import { queryKeys } from "@/lib/query/query-keys";

import { mintQueryOptions } from "./queries";

const env = getPublicEnv();

export function MintView() {
  const router = useRouter();
  const { data } = useSuspenseQuery(mintQueryOptions());
  const {
    address,
    isConnected,
    isPending,
    isReady,
    needsChainSwitch,
    refreshAfterMutation,
    runContract,
  } = useWalletTransactions();

  async function handleMint() {
    if (!address) return;
    const receipt = await runContract("Mint token", {
      abi: nftAbi,
      address: env.nftAddress,
      functionName: "mint",
      args: [],
      value: BigInt(data.displayMintPriceWei),
    });
    const mintEvent = receipt.logs.find((log) => {
      try {
        return (
          decodeEventLog({
            abi: nftAbi,
            data: log.data,
            topics: log.topics,
          }).eventName === "MintEvent"
        );
      } catch {
        return false;
      }
    });
    const decoded =
      mintEvent &&
      decodeEventLog({
        abi: nftAbi,
        data: mintEvent.data,
        topics: mintEvent.topics,
      });
    const tokenId =
      decoded &&
      decoded.args &&
      "tokenId" in decoded.args &&
      typeof decoded.args.tokenId === "bigint"
        ? Number(decoded.args.tokenId)
        : null;

    if (tokenId !== null) {
      const response = await fetch("/api/tokens", {
        body: JSON.stringify({ tokenId }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      if (response.ok) {
        toast.success("Generation pipeline started.");
      }

      refreshAfterMutation([
        queryKeys.mint(),
        queryKeys.home(),
        queryKeys.walletTokens(address),
      ]);
      router.push(`/detail/${tokenId}`);
      return;
    }

    toast.success("Mint confirmed.");
  }

  return (
    <div className="space-y-10">
      <PageHero
        description="Confirm the mint on Arbitrum, trigger media generation, and jump directly into the token detail experience without any full-page reloads."
        eyebrow="Primary Action"
        title={
          <>
            MINT <span className="text-accent">RANDOM WALK</span>
          </>
        }
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Payable Price</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-4xl tracking-[0.16em] uppercase">
              {formatEth(data.displayMintPriceWei)} ETH
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Supply</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-4xl tracking-[0.16em] uppercase">
              {formatInteger(data.totalSupply)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sale Timing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Badge
              variant={data.timeUntilSaleSeconds > 0 ? "default" : "success"}
            >
              {data.timeUntilSaleSeconds > 0
                ? formatCountdown(data.timeUntilSaleSeconds)
                : "Live now"}
            </Badge>
            {data.saleOpensAt ? (
              <p className="text-muted text-sm">
                {formatDateTime(data.saleOpensAt)}
              </p>
            ) : null}
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardContent className="flex flex-col gap-6 p-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <h2 className="font-display text-3xl tracking-[0.16em] uppercase">
              Mint the next token
            </h2>
            <p className="text-muted text-sm leading-7">
              The frontend sends the mint transaction, waits for confirmation,
              triggers backend media generation, invalidates live query state,
              and routes directly to the token detail page.
            </p>
          </div>
          {!isConnected || needsChainSwitch ? (
            <WalletConnect />
          ) : (
            <Button
              disabled={data.timeUntilSaleSeconds > 0 || isPending || !isReady}
              onClick={() => void handleMint().catch(() => undefined)}
              size="lg"
            >
              {data.timeUntilSaleSeconds > 0
                ? "Sale not open yet"
                : isPending
                  ? "Waiting for confirmation..."
                  : "Mint now"}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
