"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { WalletConnect } from "@/components/layout/wallet-connect";
import { PageHero } from "@/components/shared/page-hero";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWalletTransactions } from "@/features/wallet/use-wallet-transactions";
import { nftAbi } from "@/lib/abis";
import { getPublicEnv } from "@/lib/env";
import {
  formatAddress,
  formatCountdown,
  formatDateTime,
  formatEth,
} from "@/lib/format";
import { queryKeys } from "@/lib/query/query-keys";

import { redeemQueryOptions } from "./queries";

const env = getPublicEnv();

export function RedeemView() {
  const { data } = useSuspenseQuery(redeemQueryOptions());
  const {
    address,
    isConnected,
    isPending,
    isReady,
    needsChainSwitch,
    refreshAfterMutation,
    runContract,
  } = useWalletTransactions();
  const isLastMinter = address?.toLowerCase() === data.lastMinter.toLowerCase();

  async function handleWithdraw() {
    if (!address || !isLastMinter) return;
    await runContract("Withdraw funds", {
      abi: nftAbi,
      address: env.nftAddress,
      functionName: "withdraw",
      args: [],
    });
    refreshAfterMutation([queryKeys.redeem(), queryKeys.mint()]);
  }

  return (
    <div className="space-y-10">
      <PageHero
        description="Track the last-minter withdrawal mechanic with a clearer timeline and explicit transaction state."
        eyebrow="Contract Withdrawals"
        title={
          <>
            REDEEM <span className="text-accent">MECHANIC</span>
          </>
        }
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Withdrawal Window</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Badge
              variant={
                data.timeUntilWithdrawalSeconds > 0 ? "default" : "success"
              }
            >
              {data.timeUntilWithdrawalSeconds > 0
                ? formatCountdown(data.timeUntilWithdrawalSeconds)
                : "Available now"}
            </Badge>
            {data.withdrawalOpensAt ? (
              <p className="text-muted text-sm">
                {formatDateTime(data.withdrawalOpensAt)}
              </p>
            ) : null}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Last Minter</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-2xl tracking-[0.14em] uppercase">
              {formatAddress(data.lastMinter)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Withdrawal Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-4xl tracking-[0.16em] uppercase">
              {formatEth(data.withdrawalAmountWei)} ETH
            </p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardContent className="flex flex-col gap-6 p-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <h2 className="font-display text-3xl tracking-[0.16em] uppercase">
              Trigger contract withdrawal
            </h2>
            <p className="text-muted text-sm leading-7">
              The page checks eligibility on-chain and keeps the last-minter
              state visible while the withdrawal window counts down.
            </p>
          </div>
          {!isConnected || needsChainSwitch ? (
            <WalletConnect />
          ) : (
            <Button
              disabled={
                data.timeUntilWithdrawalSeconds > 0 ||
                !isLastMinter ||
                isPending ||
                !isReady
              }
              onClick={() => void handleWithdraw().catch(() => undefined)}
              size="lg"
            >
              {data.timeUntilWithdrawalSeconds > 0
                ? "Not available yet"
                : !isLastMinter
                  ? "Only the last minter can withdraw"
                  : isPending
                    ? "Waiting for confirmation..."
                    : "Withdraw now"}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
