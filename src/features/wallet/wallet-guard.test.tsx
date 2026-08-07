import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { renderWithQueryClient } from "@/lib/testing/render";

import { WalletGuard } from "./wallet-guard";

const useConnectionMock = vi.fn();

vi.mock("wagmi", () => ({
  useConnection: () => useConnectionMock(),
}));

vi.mock("@/components/layout/wallet-connect", () => ({
  WalletConnect: () => <button>Connect test wallet</button>,
}));

vi.mock("@/lib/wallet/config", () => ({
  appChain: { id: 42161 },
}));

describe("WalletGuard", () => {
  it("renders the empty state when disconnected", () => {
    useConnectionMock.mockReturnValue({
      isConnected: false,
      status: "disconnected",
    });
    renderWithQueryClient(
      <WalletGuard body="Connect first" title="Wallet required">
        <div>Secure content</div>
      </WalletGuard>,
    );

    expect(screen.getByText("Wallet required")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Connect test wallet" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Secure content")).not.toBeInTheDocument();
  });

  it("renders children when connected", () => {
    useConnectionMock.mockReturnValue({
      chainId: 42161,
      isConnected: true,
      status: "connected",
    });
    renderWithQueryClient(
      <WalletGuard body="Connect first" title="Wallet required">
        <div>Secure content</div>
      </WalletGuard>,
    );

    expect(screen.getByText("Secure content")).toBeInTheDocument();
  });

  it("asks a connected wallet to switch to Arbitrum", () => {
    useConnectionMock.mockReturnValue({
      chainId: 1,
      isConnected: true,
      status: "connected",
    });
    renderWithQueryClient(
      <WalletGuard body="Connect first" title="Wallet required">
        <div>Secure content</div>
      </WalletGuard>,
    );

    expect(screen.getByText("Switch to Arbitrum")).toBeInTheDocument();
    expect(screen.queryByText("Secure content")).not.toBeInTheDocument();
  });

  it("shows a restoring state while reconnecting", () => {
    useConnectionMock.mockReturnValue({
      isConnected: false,
      status: "reconnecting",
    });
    renderWithQueryClient(
      <WalletGuard body="Connect first" title="Wallet required">
        <div>Secure content</div>
      </WalletGuard>,
    );

    expect(
      screen.getByLabelText("Restoring wallet connection"),
    ).toBeInTheDocument();
    expect(screen.queryByText("Wallet required")).not.toBeInTheDocument();
  });
});
