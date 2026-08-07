import { afterEach, describe, expect, it, vi } from "vitest";

import { getPublicEnv, getServerEnv } from "@/lib/env";

describe("env helpers", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("falls back to defaults", () => {
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("NEXT_PUBLIC_NFT_ADDRESS", undefined);
    vi.stubEnv("NEXT_PUBLIC_MARKET_ADDRESS", undefined);
    vi.stubEnv("NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID", undefined);
    vi.stubEnv("RPC_URL", undefined);

    const publicEnv = getPublicEnv();
    const serverEnv = getServerEnv();

    expect(publicEnv.chainId).toBe(42161);
    expect(publicEnv.nftAddress).toBe(
      "0x895a6F444BE4ba9d124F61DF736605792B35D66b",
    );
    expect(publicEnv.walletConnectProjectId).toBe(
      "00000000000000000000000000000000",
    );
    expect(serverEnv.rpcUrl).toBe("https://arb1.arbitrum.io/rpc");
  });

  it("rejects placeholder WalletConnect project IDs", () => {
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv(
      "NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID",
      "development-project-id",
    );

    expect(() => getPublicEnv()).toThrow(
      "Expected a 32-character WalletConnect project ID.",
    );
  });

  it("requires a WalletConnect project ID in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID", undefined);

    expect(() => getPublicEnv()).toThrow(
      "NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is required in production.",
    );
  });

  it("rejects the test WalletConnect project ID in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv(
      "NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID",
      "00000000000000000000000000000000",
    );

    expect(() => getPublicEnv()).toThrow(
      "The all-zero WalletConnect project ID is test-only",
    );
  });

  it("rejects unsupported public chain IDs", () => {
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("NEXT_PUBLIC_CHAIN_ID", "1");

    expect(() => getPublicEnv()).toThrow("Only Arbitrum (42161) is supported.");
  });
});
