import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useWalletTransactions } from "./use-wallet-transactions";

const ACCOUNT = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const HASH = `0x${"1".repeat(64)}` as const;
const {
  routerRefreshMock,
  toastErrorMock,
  toastLoadingMock,
  toastSuccessMock,
  useConnectionMock,
  usePublicClientMock,
  useWalletClientMock,
} = vi.hoisted(() => ({
  routerRefreshMock: vi.fn(),
  toastErrorMock: vi.fn(),
  toastLoadingMock: vi.fn(() => "toast-id"),
  toastSuccessMock: vi.fn(),
  useConnectionMock: vi.fn(),
  usePublicClientMock: vi.fn(),
  useWalletClientMock: vi.fn(),
}));

vi.mock("wagmi", () => ({
  useConnection: () => useConnectionMock(),
  usePublicClient: () => usePublicClientMock(),
  useWalletClient: () => useWalletClientMock(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: routerRefreshMock }),
}));

vi.mock("@/components/ui/sonner", () => ({
  toast: {
    error: toastErrorMock,
    loading: toastLoadingMock,
    success: toastSuccessMock,
  },
}));

vi.mock("@/lib/wallet/config", () => ({
  appChain: { id: 42161, name: "Arbitrum" },
}));

function wrapper({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider
      client={
        new QueryClient({
          defaultOptions: { queries: { retry: false } },
        })
      }
    >
      {children}
    </QueryClientProvider>
  );
}

describe("useWalletTransactions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useConnectionMock.mockReturnValue({
      address: ACCOUNT,
      chainId: 42161,
      isConnected: true,
      status: "connected",
    });
  });

  it("starts the wallet request immediately and tracks confirmation", async () => {
    let resolveWrite!: (hash: typeof HASH) => void;
    let resolveReceipt!: (receipt: { status: "success" }) => void;
    const writeContract = vi.fn(
      () =>
        new Promise<typeof HASH>((resolve) => {
          resolveWrite = resolve;
        }),
    );
    const waitForTransactionReceipt = vi.fn(
      () =>
        new Promise<{ status: "success" }>((resolve) => {
          resolveReceipt = resolve;
        }),
    );
    useWalletClientMock.mockReturnValue({ data: { writeContract } });
    usePublicClientMock.mockReturnValue({ waitForTransactionReceipt });
    const { result } = renderHook(() => useWalletTransactions(), { wrapper });

    let transaction!: ReturnType<typeof result.current.runContract>;
    act(() => {
      transaction = result.current.runContract("Mint token", {
        abi: [],
        address: ACCOUNT,
        functionName: "mint",
      });
    });

    expect(writeContract).toHaveBeenCalledTimes(1);
    expect(result.current.phase).toBe("awaiting-wallet");

    await act(async () => {
      resolveWrite(HASH);
      await Promise.resolve();
    });
    expect(result.current.phase).toBe("confirming");
    expect(result.current.hash).toBe(HASH);

    await act(async () => {
      resolveReceipt({ status: "success" });
      await transaction;
    });
    expect(result.current.phase).toBe("success");
    expect(toastSuccessMock).toHaveBeenCalledWith("Mint token confirmed.", {
      id: "toast-id",
    });
  });

  it("does not write while connected to the wrong chain", async () => {
    const writeContract = vi.fn();
    useConnectionMock.mockReturnValue({
      address: ACCOUNT,
      chainId: 1,
      isConnected: true,
      status: "connected",
    });
    useWalletClientMock.mockReturnValue({ data: { writeContract } });
    usePublicClientMock.mockReturnValue({
      waitForTransactionReceipt: vi.fn(),
    });
    const { result } = renderHook(() => useWalletTransactions(), { wrapper });

    await act(async () => {
      await expect(
        result.current.runContract("Mint token", {
          abi: [],
          address: ACCOUNT,
          functionName: "mint",
        }),
      ).rejects.toThrow("Switch your wallet to Arbitrum");
    });
    expect(writeContract).not.toHaveBeenCalled();
    expect(result.current.needsChainSwitch).toBe(true);
  });

  it("does not invite a duplicate transaction when receipt polling fails", async () => {
    const writeContract = vi.fn().mockResolvedValue(HASH);
    const waitForTransactionReceipt = vi
      .fn()
      .mockRejectedValue(new Error("RPC connection closed"));
    useWalletClientMock.mockReturnValue({ data: { writeContract } });
    usePublicClientMock.mockReturnValue({ waitForTransactionReceipt });
    const { result } = renderHook(() => useWalletTransactions(), { wrapper });

    await act(async () => {
      await expect(
        result.current.runContract("Mint token", {
          abi: [],
          address: ACCOUNT,
          functionName: "mint",
        }),
      ).rejects.toThrow("RPC connection closed");
    });

    expect(result.current.hash).toBe(HASH);
    expect(result.current.phase).toBe("confirmation-unknown");
    expect(result.current.isPending).toBe(true);
    expect(result.current.error).toMatch(/check your wallet or arbiscan/i);
  });

  it("surfaces wallet rejection before a transaction hash exists", async () => {
    const writeContract = vi
      .fn()
      .mockRejectedValue(new Error("User rejected the request."));
    useWalletClientMock.mockReturnValue({ data: { writeContract } });
    usePublicClientMock.mockReturnValue({
      waitForTransactionReceipt: vi.fn(),
    });
    const { result } = renderHook(() => useWalletTransactions(), { wrapper });

    await act(async () => {
      await expect(
        result.current.runContract("Mint token", {
          abi: [],
          address: ACCOUNT,
          functionName: "mint",
        }),
      ).rejects.toThrow("User rejected");
    });

    expect(result.current.phase).toBe("error");
    expect(result.current.error).toBe(
      "The request was cancelled in your wallet.",
    );
    expect(toastErrorMock).toHaveBeenCalledWith(
      "The request was cancelled in your wallet.",
      { id: "toast-id" },
    );
  });
});
