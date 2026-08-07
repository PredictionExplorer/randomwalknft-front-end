import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Connector } from "wagmi";

import { renderWithQueryClient } from "@/lib/testing/render";

import { WalletConnect } from "./wallet-connect";

const useConnectionMock = vi.fn();
const useConnectorsMock = vi.fn();
const connectAsyncMock = vi.fn();
const connectResetMock = vi.fn();
const disconnectMock = vi.fn();
const switchChainAsyncMock = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

vi.mock("wagmi", () => ({
  useConnect: () => ({
    error: null,
    isPending: false,
    mutateAsync: connectAsyncMock,
    reset: connectResetMock,
    variables: undefined,
  }),
  useConnection: () => useConnectionMock(),
  useConnectors: () => useConnectorsMock(),
  useDisconnect: () => ({ mutate: disconnectMock }),
  useSwitchChain: () => ({
    isPending: false,
    mutateAsync: switchChainAsyncMock,
  }),
}));

vi.mock("@/lib/wallet/config", () => ({
  appChain: {
    blockExplorers: {
      default: { url: "https://arbiscan.io" },
    },
    id: 42161,
  },
}));

vi.mock("@/components/ui/sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

function connector(id: string, provider: unknown): Connector {
  return {
    getProvider: vi.fn().mockResolvedValue(provider),
    id,
    name: id === "metaMaskSDK" ? "MetaMask" : id,
    type: id === "metaMask" ? "injected" : id,
    uid: `${id}-uid`,
  } as unknown as Connector;
}

describe("WalletConnect", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useConnectionMock.mockReturnValue({
      isConnected: false,
      status: "disconnected",
    });
  });

  it("prefers direct injected MetaMask from the in-app browser", async () => {
    const user = userEvent.setup();
    const injectedMetaMask = connector("metaMask", {});
    const metaMaskConnect = connector("metaMaskSDK", undefined);
    useConnectorsMock.mockReturnValue([injectedMetaMask, metaMaskConnect]);
    connectAsyncMock.mockResolvedValue({
      accounts: ["0x6B175474E89094C44Da98b954EedeAC495271d0F"],
      chainId: 42161,
    });

    renderWithQueryClient(<WalletConnect />);
    await user.click(screen.getByRole("button", { name: /connect wallet/i }));
    const metaMaskOption = await screen.findByRole("button", {
      name: /use metamask directly/i,
    });
    await user.click(metaMaskOption);

    expect(connectAsyncMock).toHaveBeenCalledWith({
      connector: injectedMetaMask,
    });
    expect(connectAsyncMock).not.toHaveBeenCalledWith({
      connector: metaMaskConnect,
    });
  });

  it("requires an explicit network switch before showing account controls", async () => {
    const user = userEvent.setup();
    useConnectionMock.mockReturnValue({
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      chainId: 1,
      isConnected: true,
      status: "connected",
    });
    useConnectorsMock.mockReturnValue([]);
    switchChainAsyncMock.mockResolvedValue({ id: 42161 });

    renderWithQueryClient(<WalletConnect />);
    await user.click(
      screen.getByRole("button", { name: /switch to arbitrum/i }),
    );

    await waitFor(() => {
      expect(switchChainAsyncMock).toHaveBeenCalledWith({ chainId: 42161 });
    });
  });
});
