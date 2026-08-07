// @vitest-environment node

import { describe, expect, it } from "vitest";

describe("wallet config server safety", () => {
  it("imports without browser storage and keeps WalletConnect lazy", async () => {
    expect("indexedDB" in globalThis).toBe(false);

    const { appChain, walletConfig } = await import("./config");

    expect(appChain.id).toBe(42161);
    expect(walletConfig.connectors.map((connector) => connector.id)).toEqual([
      "metaMask",
      "metaMaskSDK",
      "injected",
      "walletConnect",
      "baseAccount",
      "safe",
    ]);
  });
});
