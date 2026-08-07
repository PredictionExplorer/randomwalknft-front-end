"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { isAddress, parseEther, zeroAddress } from "viem";
import { useReadContract } from "wagmi";

import { WalletConnect } from "@/components/layout/wallet-connect";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useWalletTransactions } from "@/features/wallet/use-wallet-transactions";
import { marketAbi, nftAbi } from "@/lib/abis";
import { getPublicEnv } from "@/lib/env";
import { formatAddress, formatEth, formatTokenId } from "@/lib/format";
import { queryKeys } from "@/lib/query/query-keys";
import { appChain } from "@/lib/wallet/config";
import type { Offer, TokenMarketSnapshot } from "@/types";

const env = getPublicEnv();

function parsePositiveEther(value: string) {
  try {
    const parsed = parseEther(value);
    return parsed > 0n ? parsed : null;
  } catch {
    return null;
  }
}

function OfferRow({
  action,
  actionLabel,
  offer,
  pending = false,
}: {
  action?: () => Promise<void>;
  actionLabel?: string;
  offer: Offer;
  pending?: boolean;
}) {
  return (
    <div className="border-border flex flex-col gap-3 rounded-[1.5rem] border bg-white/4 p-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-muted text-xs tracking-[0.18em] uppercase">
          {offer.type} offer
        </p>
        <p className="font-display text-lg tracking-[0.14em] uppercase">
          {formatEth(offer.priceWei)} ETH
        </p>
        <p className="text-muted text-sm">
          {offer.type === "buy"
            ? formatAddress(offer.buyer)
            : formatAddress(offer.seller)}
        </p>
      </div>
      {action && actionLabel ? (
        <Button
          disabled={pending}
          onClick={() => void action().catch(() => undefined)}
          variant="ghost"
        >
          {pending ? "Waiting for wallet..." : actionLabel}
        </Button>
      ) : null}
    </div>
  );
}

export function TokenActionPanel({
  snapshot,
}: {
  snapshot: TokenMarketSnapshot;
}) {
  const { activeBuyOffers, activeSellOffer, token } = snapshot;
  const [sellPrice, setSellPrice] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [tokenName, setTokenName] = useState(token.name);
  const [transferAddress, setTransferAddress] = useState("");
  const {
    address,
    error,
    hash,
    isConnected,
    isPending,
    isReady,
    needsChainSwitch,
    refreshAfterMutation,
    runContract,
  } = useWalletTransactions();
  const queryClient = useQueryClient();
  const router = useRouter();
  const isOwner = address?.toLowerCase() === token.owner.toLowerCase();
  const isActiveSeller =
    Boolean(address) &&
    activeSellOffer?.seller.toLowerCase() === address?.toLowerCase();
  const sellPriceWei = useMemo(
    () => parsePositiveEther(sellPrice),
    [sellPrice],
  );
  const buyPriceWei = useMemo(() => parsePositiveEther(buyPrice), [buyPrice]);
  const validTransferAddress =
    isAddress(transferAddress) && transferAddress !== zeroAddress;
  const approvalQuery = useReadContract({
    abi: nftAbi,
    address: env.nftAddress,
    args: [address ?? zeroAddress, env.marketAddress],
    functionName: "isApprovedForAll",
    query: {
      enabled: Boolean(address && isOwner),
    },
  });
  const marketplaceApproved = approvalQuery.data === true;

  function refreshSnapshot() {
    refreshAfterMutation([queryKeys.detail(token.id), queryKeys.mint()]);
  }

  async function handleRename() {
    if (!address || tokenName.trim().length === 0) return;
    await runContract("Rename token", {
      abi: nftAbi,
      address: env.nftAddress,
      functionName: "setTokenName",
      args: [BigInt(token.id), tokenName.trim()],
    });
    refreshSnapshot();
  }

  async function handleTransfer() {
    if (!address || !validTransferAddress) return;
    await runContract("Transfer token", {
      abi: nftAbi,
      address: env.nftAddress,
      functionName: "transferFrom",
      args: [address, transferAddress as `0x${string}`, BigInt(token.id)],
    });
    refreshSnapshot();
    router.push("/my-nfts");
  }

  async function handleApproveMarketplace() {
    if (!address) return;
    await runContract("Approve marketplace", {
      abi: nftAbi,
      address: env.nftAddress,
      functionName: "setApprovalForAll",
      args: [env.marketAddress, true],
    });
    await approvalQuery.refetch();
  }

  async function handleCreateSellOffer() {
    if (!address || !marketplaceApproved || sellPriceWei === null) return;
    await runContract("Create sell offer", {
      abi: marketAbi,
      address: env.marketAddress,
      functionName: "makeSellOffer",
      args: [env.nftAddress, BigInt(token.id), sellPriceWei],
    });
    refreshSnapshot();
  }

  async function handleCancelSellOffer() {
    if (!address || !activeSellOffer) return;
    await runContract("Cancel sell offer", {
      abi: marketAbi,
      address: env.marketAddress,
      functionName: "cancelSellOffer",
      args: [BigInt(activeSellOffer.id)],
    });
    refreshSnapshot();
  }

  async function handleBuyNow() {
    if (!address || !activeSellOffer) return;
    await runContract("Accept sell offer", {
      abi: marketAbi,
      address: env.marketAddress,
      functionName: "acceptSellOffer",
      args: [BigInt(activeSellOffer.id)],
      value: BigInt(activeSellOffer.priceWei),
    });
    refreshSnapshot();
    void queryClient.invalidateQueries({
      queryKey: queryKeys.walletTokens(address),
    });
  }

  async function handleCreateBuyOffer() {
    if (!address || buyPriceWei === null) return;
    await runContract("Create buy offer", {
      abi: marketAbi,
      address: env.marketAddress,
      functionName: "makeBuyOffer",
      args: [env.nftAddress, BigInt(token.id)],
      value: buyPriceWei,
    });
    refreshSnapshot();
  }

  async function handleAcceptBuyOffer(offer: Offer) {
    if (!address) return;
    await runContract("Accept buy offer", {
      abi: marketAbi,
      address: env.marketAddress,
      functionName: "acceptBuyOffer",
      args: [BigInt(offer.id)],
    });
    refreshSnapshot();
    void queryClient.invalidateQueries({
      queryKey: queryKeys.walletOffers(address),
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <Card>
        <CardHeader>
          <CardTitle>Token Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 text-sm">
          <div className="space-y-2">
            <p className="text-muted text-xs tracking-[0.18em] uppercase">
              Owner
            </p>
            <p className="break-all">{token.owner}</p>
          </div>
          <div className="space-y-2">
            <p className="text-muted text-xs tracking-[0.18em] uppercase">
              Seed
            </p>
            <p className="text-muted font-mono text-xs leading-6 break-all">
              {token.seed}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {activeSellOffer ? (
              <Badge variant="success">
                Listed for {formatEth(activeSellOffer.priceWei)} ETH
              </Badge>
            ) : null}
            <Badge>{formatTokenId(token.id)}</Badge>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            {!isConnected || needsChainSwitch ? (
              <div className="space-y-3 md:col-span-2">
                <p className="text-muted text-sm leading-7">
                  Connect a wallet on Arbitrum to buy, offer, or manage this
                  token.
                </p>
                <WalletConnect />
              </div>
            ) : isOwner ? (
              <>
                <div className="space-y-3">
                  <p className="text-muted text-xs tracking-[0.18em] uppercase">
                    Rename token
                  </p>
                  <Input
                    onChange={(event) => setTokenName(event.target.value)}
                    value={tokenName}
                  />
                  <Button
                    disabled={
                      !isReady ||
                      isPending ||
                      tokenName.trim().length === 0 ||
                      tokenName.trim() === token.name
                    }
                    onClick={() => void handleRename().catch(() => undefined)}
                  >
                    {isPending ? "Waiting for wallet..." : "Save name"}
                  </Button>
                </div>
                <div className="space-y-3">
                  <p className="text-muted text-xs tracking-[0.18em] uppercase">
                    Transfer token
                  </p>
                  <Input
                    onChange={(event) => setTransferAddress(event.target.value)}
                    placeholder="0x..."
                    value={transferAddress}
                  />
                  <Button
                    disabled={!isReady || isPending || !validTransferAddress}
                    onClick={() => void handleTransfer().catch(() => undefined)}
                    variant="ghost"
                  >
                    {isPending ? "Waiting for wallet..." : "Transfer"}
                  </Button>
                </div>
                <div className="space-y-3">
                  <p className="text-muted text-xs tracking-[0.18em] uppercase">
                    Sell offer
                  </p>
                  <Input
                    onChange={(event) => setSellPrice(event.target.value)}
                    placeholder="0.25"
                    value={sellPrice}
                  />
                  {activeSellOffer ? (
                    isActiveSeller ? (
                      <Button
                        disabled={!isReady || isPending}
                        onClick={() =>
                          void handleCancelSellOffer().catch(() => undefined)
                        }
                        variant="ghost"
                      >
                        {isPending ? "Waiting for wallet..." : "Cancel listing"}
                      </Button>
                    ) : (
                      <p className="text-muted text-sm">
                        This listing belongs to{" "}
                        {formatAddress(activeSellOffer.seller)}.
                      </p>
                    )
                  ) : approvalQuery.isPending ? (
                    <Button disabled>Checking marketplace approval...</Button>
                  ) : !marketplaceApproved ? (
                    <Button
                      disabled={!isReady || isPending}
                      onClick={() =>
                        void handleApproveMarketplace().catch(() => undefined)
                      }
                    >
                      {isPending
                        ? "Waiting for wallet..."
                        : "Approve marketplace"}
                    </Button>
                  ) : (
                    <Button
                      disabled={!isReady || isPending || sellPriceWei === null}
                      onClick={() =>
                        void handleCreateSellOffer().catch(() => undefined)
                      }
                    >
                      {isPending ? "Waiting for wallet..." : "List token"}
                    </Button>
                  )}
                  {!activeSellOffer && !marketplaceApproved ? (
                    <p className="text-muted text-xs leading-5">
                      Approval and listing are separate confirmations so mobile
                      wallets receive one request per tap.
                    </p>
                  ) : null}
                </div>
              </>
            ) : isActiveSeller && activeSellOffer ? (
              <div className="space-y-3 md:col-span-2">
                <p className="text-muted text-xs tracking-[0.18em] uppercase">
                  Active listing
                </p>
                <p className="text-muted text-sm">
                  Your token is listed for {formatEth(activeSellOffer.priceWei)}{" "}
                  ETH.
                </p>
                <Button
                  disabled={!isReady || isPending}
                  onClick={() =>
                    void handleCancelSellOffer().catch(() => undefined)
                  }
                  variant="ghost"
                >
                  {isPending ? "Waiting for wallet..." : "Cancel listing"}
                </Button>
              </div>
            ) : (
              <>
                {activeSellOffer ? (
                  <div className="space-y-3">
                    <p className="text-muted text-xs tracking-[0.18em] uppercase">
                      Buy now
                    </p>
                    <p className="text-muted text-sm">
                      Accept the active sell offer for{" "}
                      {formatEth(activeSellOffer.priceWei)} ETH.
                    </p>
                    <Button
                      disabled={!isReady || isPending}
                      onClick={() => void handleBuyNow().catch(() => undefined)}
                    >
                      {isPending
                        ? "Waiting for wallet..."
                        : "Accept sell offer"}
                    </Button>
                  </div>
                ) : null}
                <div className="space-y-3">
                  <p className="text-muted text-xs tracking-[0.18em] uppercase">
                    Place buy offer
                  </p>
                  <Input
                    onChange={(event) => setBuyPrice(event.target.value)}
                    placeholder="0.20"
                    value={buyPrice}
                  />
                  <Button
                    disabled={!isReady || isPending || buyPriceWei === null}
                    onClick={() =>
                      void handleCreateBuyOffer().catch(() => undefined)
                    }
                    variant="ghost"
                  >
                    {isPending ? "Waiting for wallet..." : "Submit buy offer"}
                  </Button>
                </div>
              </>
            )}
            {error ? (
              <p
                className="rounded-2xl border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200 md:col-span-2"
                role="alert"
              >
                {error}
              </p>
            ) : null}
            {hash ? (
              <a
                className="text-highlight text-sm underline-offset-4 hover:underline md:col-span-2"
                href={`${appChain.blockExplorers.default.url}/tx/${hash}`}
                rel="noreferrer"
                target="_blank"
              >
                View pending transaction on Arbiscan
              </a>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Market Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeSellOffer ? (
              <OfferRow
                action={
                  isReady
                    ? isActiveSeller
                      ? handleCancelSellOffer
                      : handleBuyNow
                    : undefined
                }
                actionLabel={
                  isReady
                    ? isActiveSeller
                      ? "Cancel listing"
                      : "Buy now"
                    : undefined
                }
                offer={activeSellOffer}
                pending={isPending}
              />
            ) : (
              <p className="text-muted text-sm">No active sell offer.</p>
            )}

            {activeBuyOffers.length > 0 ? (
              activeBuyOffers.map((offer) => (
                <OfferRow
                  action={
                    isOwner && isReady
                      ? async () => handleAcceptBuyOffer(offer)
                      : undefined
                  }
                  actionLabel={
                    isOwner && isReady ? "Accept buy offer" : undefined
                  }
                  key={offer.id}
                  offer={offer}
                  pending={isPending}
                />
              ))
            ) : (
              <p className="text-muted text-sm">No active buy offers.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
