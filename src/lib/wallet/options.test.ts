import { describe, expect, it } from "vitest";
import type { Connector } from "wagmi";

import { resolveWalletOptions } from "./options";

function connector(id: string, name: string, type = id): Connector {
  return {
    id,
    name,
    type,
    uid: `${id}-uid`,
  } as Connector;
}

describe("resolveWalletOptions", () => {
  const injectedMetaMask = connector("metaMask", "MetaMask", "injected");
  const metaMaskConnect = connector("metaMaskSDK", "MetaMask", "metaMask");
  const walletConnect = connector(
    "walletConnect",
    "WalletConnect",
    "walletConnect",
  );
  const base = connector("baseAccount", "Base Account", "baseAccount");

  it("prefers injected MetaMask in an in-app browser", () => {
    const options = resolveWalletOptions(
      [injectedMetaMask, metaMaskConnect, walletConnect, base],
      new Set([injectedMetaMask.uid]),
    );

    expect(options[0]).toMatchObject({
      connector: injectedMetaMask,
      label: "MetaMask",
    });
    expect(options.some((option) => option.connector === metaMaskConnect)).toBe(
      false,
    );
  });

  it("falls back to MetaMask Connect without an injected provider", () => {
    const options = resolveWalletOptions(
      [injectedMetaMask, metaMaskConnect, walletConnect],
      new Set(),
    );

    expect(options[0]).toMatchObject({
      connector: metaMaskConnect,
      label: "MetaMask",
    });
  });

  it("keeps installed wallets and generic wallet choices", () => {
    const rabby = connector("io.rabby", "Rabby", "injected");
    const duplicateRabby = connector("rabby.legacy", "Rabby", "injected");
    const options = resolveWalletOptions(
      [metaMaskConnect, rabby, duplicateRabby, base, walletConnect],
      new Set([rabby.uid, duplicateRabby.uid]),
    );

    expect(options.map((option) => option.label)).toEqual([
      "MetaMask",
      "Rabby",
      "Base Account",
      "Rainbow & other wallets",
    ]);
  });
});
