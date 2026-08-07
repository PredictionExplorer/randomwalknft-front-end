"use client";

import {
  Check,
  ChevronDown,
  Copy,
  ExternalLink,
  Loader2,
  LogOut,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import {
  useConnect,
  useConnection,
  useConnectors,
  useDisconnect,
  useSwitchChain,
} from "wagmi";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/sonner";
import { formatAddress } from "@/lib/format";
import { cn } from "@/lib/utils";
import { appChain } from "@/lib/wallet/config";
import { getWalletErrorMessage } from "@/lib/wallet/errors";
import { resolveWalletOptions } from "@/lib/wallet/options";

const subscribeToHydration = () => () => {};
const getClientHydrationSnapshot = () => true;
const getServerHydrationSnapshot = () => false;

export function WalletConnect() {
  const pathname = usePathname();
  const connection = useConnection();
  const connectors = useConnectors();
  const connect = useConnect();
  const disconnect = useDisconnect();
  const switchChain = useSwitchChain();
  const mounted = useSyncExternalStore(
    subscribeToHydration,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot,
  );
  const [availableConnectorUids, setAvailableConnectorUids] = useState<
    ReadonlySet<string>
  >(new Set());
  const [detectionComplete, setDetectionComplete] = useState(false);
  const [connectOpen, setConnectOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  useEffect(() => {
    let active = true;
    const detectionTimeout = window.setTimeout(() => {
      if (active) setDetectionComplete(true);
    }, 2_000);

    async function probeInjectedConnectors() {
      const candidates = connectors.filter(
        (connector) => connector.type === "injected" || connector.id === "safe",
      );
      const available = await Promise.all(
        candidates.map(async (connector) => {
          try {
            return (await connector.getProvider()) ? connector.uid : null;
          } catch {
            return null;
          }
        }),
      );

      if (!active) return;
      setAvailableConnectorUids(
        new Set(available.filter((uid): uid is string => Boolean(uid))),
      );
      if (available.some(Boolean)) {
        window.clearTimeout(detectionTimeout);
        setDetectionComplete(true);
      }
    }

    void probeInjectedConnectors();

    const handleProviderChange = () => {
      void probeInjectedConnectors();
    };

    window.addEventListener("ethereum#initialized", handleProviderChange);
    window.addEventListener(
      "eip6963:announceProvider",
      handleProviderChange as EventListener,
    );
    window.dispatchEvent(new Event("eip6963:requestProvider"));

    return () => {
      active = false;
      window.clearTimeout(detectionTimeout);
      window.removeEventListener("ethereum#initialized", handleProviderChange);
      window.removeEventListener(
        "eip6963:announceProvider",
        handleProviderChange as EventListener,
      );
    };
  }, [connectors]);

  const walletOptions = useMemo(
    () => resolveWalletOptions(connectors, availableConnectorUids),
    [availableConnectorUids, connectors],
  );

  async function handleConnect(connectorUid: string) {
    const connector = connectors.find((item) => item.uid === connectorUid);
    if (!connector) return;

    try {
      await connect.mutateAsync({ connector });
      setConnectOpen(false);
      toast.success("Wallet connected.");
    } catch (error) {
      toast.error(
        getWalletErrorMessage(error, "Could not connect that wallet."),
      );
    }
  }

  async function handleSwitchChain() {
    try {
      await switchChain.mutateAsync({ chainId: appChain.id });
      toast.success("Switched to Arbitrum.");
    } catch (error) {
      toast.error(
        getWalletErrorMessage(error, "Could not switch to Arbitrum."),
      );
    }
  }

  async function handleCopyAddress() {
    if (!connection.address) return;
    await navigator.clipboard.writeText(connection.address);
    toast.success("Wallet address copied.");
  }

  if (
    !mounted ||
    connection.status === "reconnecting" ||
    connection.status === "connecting"
  ) {
    return (
      <Skeleton
        aria-label="Restoring wallet connection"
        className="h-11 w-36"
        role="status"
      />
    );
  }

  if (!connection.isConnected || !connection.address) {
    return (
      <Dialog
        onOpenChange={(open) => {
          setConnectOpen(open);
          if (!open) connect.reset();
        }}
        open={connectOpen}
      >
        <DialogTrigger asChild>
          <Button className="w-full sm:w-auto" variant="default">
            <Wallet className="size-4" />
            Connect Wallet
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[min(92vw,32rem)]">
          <DialogHeader>
            <DialogTitle>Connect wallet</DialogTitle>
            <DialogDescription>
              MetaMask uses the wallet injected into its in-app browser. Other
              browsers can use MetaMask Connect, Base Account, Safe, or
              WalletConnect.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {!detectionComplete ? (
              <div
                className="space-y-3"
                aria-label="Detecting installed wallets"
              >
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : (
              walletOptions.map((option) => {
                const isPending =
                  connect.isPending &&
                  typeof connect.variables?.connector !== "function" &&
                  connect.variables?.connector.uid === option.connector.uid;

                return (
                  <button
                    className="border-border hover:border-border-strong flex w-full items-center gap-4 rounded-2xl border bg-white/4 p-4 text-left transition hover:bg-white/8 disabled:cursor-wait disabled:opacity-60"
                    disabled={connect.isPending}
                    key={option.connector.uid}
                    onClick={() => void handleConnect(option.connector.uid)}
                    type="button"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/10">
                      {option.connector.icon ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          alt=""
                          className="size-7 rounded-full"
                          src={option.connector.icon}
                        />
                      ) : (
                        <Wallet className="size-5" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium">{option.label}</span>
                      <span className="text-muted block text-sm">
                        {option.description}
                      </span>
                    </span>
                    {isPending ? (
                      <Loader2 className="size-5 animate-spin" />
                    ) : (
                      <ChevronDown className="text-muted size-4 -rotate-90" />
                    )}
                  </button>
                );
              })
            )}
            {connect.error ? (
              <p
                className="rounded-2xl border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200"
                role="alert"
              >
                {getWalletErrorMessage(
                  connect.error,
                  "Could not connect that wallet.",
                )}
              </p>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (connection.chainId !== appChain.id) {
    return (
      <Button
        disabled={switchChain.isPending}
        onClick={() => void handleSwitchChain()}
        variant="ghost"
      >
        {switchChain.isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : null}
        Switch to Arbitrum
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button className="hidden xl:inline-flex" variant="ghost">
        <Check className="size-4 text-emerald-300" />
        Arbitrum
      </Button>
      <Dialog onOpenChange={setAccountOpen} open={accountOpen}>
        <DialogTrigger asChild>
          <Card className="border-border-strong rounded-full px-1 py-1">
            <button
              className="flex items-center gap-2 rounded-full px-3 py-2 text-sm transition hover:bg-white/5"
              type="button"
            >
              <span className="font-medium">
                {formatAddress(connection.address)}
              </span>
              <ChevronDown className="text-muted size-4" />
            </button>
          </Card>
        </DialogTrigger>
        <DialogContent className="w-[min(92vw,30rem)]">
          <DialogHeader>
            <DialogTitle>Connected wallet</DialogTitle>
            <DialogDescription>
              {connection.connector?.name ?? "Wallet"} on Arbitrum
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="border-border rounded-2xl border bg-white/4 p-4 font-mono text-sm break-all">
              {connection.address}
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Button onClick={() => void handleCopyAddress()} variant="ghost">
                <Copy className="size-4" />
                Copy address
              </Button>
              <Button asChild variant="ghost">
                <a
                  href={`${appChain.blockExplorers.default.url}/address/${connection.address}`}
                  rel="noreferrer"
                  target="_blank"
                >
                  <ExternalLink className="size-4" />
                  View on Arbiscan
                </a>
              </Button>
            </div>
            <Button
              className="w-full"
              onClick={() => {
                disconnect.mutate();
                setAccountOpen(false);
              }}
              variant="subtle"
            >
              <LogOut className="size-4" />
              Disconnect
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Link
        className={cn(
          "text-muted hover:text-foreground hidden text-xs tracking-[0.18em] uppercase transition xl:block",
          pathname === "/my-nfts" || pathname === "/my-offers"
            ? "text-highlight"
            : undefined,
        )}
        href="/my-nfts"
      >
        Dashboard
      </Link>
    </div>
  );
}
