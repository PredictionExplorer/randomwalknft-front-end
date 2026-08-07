import { afterEach, describe, expect, it, vi } from "vitest";
import { createConfig, http } from "wagmi";
import { connect } from "wagmi/actions";
import { arbitrum } from "wagmi/chains";
import { injected } from "wagmi/connectors";

const ACCOUNT = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

describe("injected MetaMask connector", () => {
  afterEach(() => {
    Reflect.deleteProperty(window, "ethereum");
  });

  it("uses eth_requestAccounts when MetaMask iOS lacks wallet_requestPermissions", async () => {
    const config = createConfig({
      chains: [arbitrum],
      connectors: [
        injected({
          target: "metaMask",
          unstable_shimAsyncInject: 2_000,
        }),
      ],
      transports: {
        [arbitrum.id]: http(),
      },
    });
    const request = vi.fn(
      async ({ method }: { method: string }): Promise<unknown> => {
        if (method === "wallet_requestPermissions") {
          throw Object.assign(new Error("Method not found"), { code: -32601 });
        }
        if (method === "eth_requestAccounts" || method === "eth_accounts") {
          return [ACCOUNT];
        }
        if (method === "eth_chainId") return "0xa4b1";
        throw new Error(`Unexpected method: ${method}`);
      },
    );
    const provider = {
      isMetaMask: true,
      on: vi.fn(),
      removeListener: vi.fn(),
      request,
    };

    // MetaMask Mobile can inject after the application bundle evaluates.
    Object.defineProperty(window, "ethereum", {
      configurable: true,
      value: provider,
    });

    const result = await connect(config, {
      connector: config.connectors[0],
    });

    expect(result.accounts).toEqual([ACCOUNT]);
    expect(result.chainId).toBe(arbitrum.id);
    expect(request.mock.calls.map(([request]) => request.method)).toEqual(
      expect.arrayContaining([
        "wallet_requestPermissions",
        "eth_requestAccounts",
      ]),
    );
  });
});
