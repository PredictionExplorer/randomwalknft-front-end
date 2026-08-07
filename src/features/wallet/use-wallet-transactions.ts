"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Abi, Address } from "viem";
import { useConnection, usePublicClient, useWalletClient } from "wagmi";

import { toast } from "@/components/ui/sonner";
import { appChain } from "@/lib/wallet/config";
import { getWalletErrorMessage } from "@/lib/wallet/errors";

export type TransactionPhase =
  | "idle"
  | "awaiting-wallet"
  | "confirming"
  | "confirmation-unknown"
  | "success"
  | "error";

export function useWalletTransactions() {
  const connection = useConnection();
  const publicClient = usePublicClient({ chainId: appChain.id });
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: walletClient } = useWalletClient();
  const [phase, setPhase] = useState<TransactionPhase>("idle");
  const [hash, setHash] = useState<`0x${string}`>();
  const [error, setError] = useState<string>();

  const needsChainSwitch =
    connection.isConnected && connection.chainId !== appChain.id;
  const isReady =
    connection.isConnected &&
    connection.status === "connected" &&
    !needsChainSwitch &&
    Boolean(connection.address && publicClient && walletClient);

  async function runContract(
    label: string,
    request: {
      abi: Abi;
      address: Address;
      args?: readonly unknown[];
      functionName: string;
      value?: bigint;
    },
  ) {
    if (!connection.isConnected || !connection.address) {
      const message = "Connect a wallet before continuing.";
      setError(message);
      setPhase("error");
      throw new Error(message);
    }
    if (needsChainSwitch) {
      const message = "Switch your wallet to Arbitrum before continuing.";
      setError(message);
      setPhase("error");
      throw new Error(message);
    }
    if (!walletClient || !publicClient) {
      const message = "The wallet is still reconnecting. Please try again.";
      setError(message);
      setPhase("error");
      throw new Error(message);
    }

    setError(undefined);
    setHash(undefined);
    setPhase("awaiting-wallet");
    const toastId = toast.loading(
      `Confirm ${label.toLowerCase()} in your wallet...`,
    );
    let submittedHash: `0x${string}` | undefined;
    let confirmedRevert = false;

    try {
      // Keep the wallet request as the first asynchronous operation. Mobile
      // browsers can suppress wallet handoffs after unrelated awaited work.
      const transactionHash = await walletClient.writeContract({
        ...(request as Record<string, unknown>),
        account: connection.address,
        chain: appChain,
      } as never);

      submittedHash = transactionHash;
      setHash(transactionHash);
      setPhase("confirming");
      toast.loading(`${label} submitted. Waiting for confirmation...`, {
        id: toastId,
      });

      const receipt = await publicClient.waitForTransactionReceipt({
        hash: transactionHash,
      });
      if (receipt.status !== "success") {
        confirmedRevert = true;
        throw new Error(`${label} reverted.`);
      }

      setPhase("success");
      toast.success(`${label} confirmed.`, { id: toastId });
      return receipt;
    } catch (caughtError) {
      if (submittedHash && !confirmedRevert) {
        const message =
          "The transaction was submitted, but confirmation could not be verified. Check your wallet or Arbiscan before retrying.";
        setError(message);
        setPhase("confirmation-unknown");
        toast.error(message, { id: toastId });
        throw caughtError;
      }

      const message = getWalletErrorMessage(
        caughtError,
        `${label} failed. Please try again.`,
      );
      setError(message);
      setPhase("error");
      toast.error(message, { id: toastId });
      throw caughtError;
    }
  }

  function refreshAfterMutation(
    queryKeys: ReadonlyArray<readonly unknown[]> = [],
  ) {
    for (const queryKey of queryKeys) {
      void queryClient.invalidateQueries({ queryKey });
    }
    router.refresh();
  }

  return {
    address: connection.address as Address | undefined,
    error,
    hash,
    isConnected: connection.isConnected,
    isPending:
      phase === "awaiting-wallet" ||
      phase === "confirming" ||
      phase === "confirmation-unknown",
    isReady,
    needsChainSwitch,
    phase,
    publicClient,
    refreshAfterMutation,
    resetTransaction: () => {
      setError(undefined);
      setHash(undefined);
      setPhase("idle");
    },
    runContract,
  };
}
