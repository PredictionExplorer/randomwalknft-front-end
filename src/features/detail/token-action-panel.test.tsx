import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { zeroAddress } from "viem";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithQueryClient } from "@/lib/testing/render";
import type { TokenMarketSnapshot } from "@/types";

import { TokenActionPanel } from "./token-action-panel";

const OWNER = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const runContractMock = vi.fn();
const refreshAfterMutationMock = vi.fn();
const approvalRefetchMock = vi.fn();
let marketplaceApproved = false;

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("wagmi", () => ({
  useReadContract: () => ({
    data: marketplaceApproved,
    isPending: false,
    refetch: approvalRefetchMock,
  }),
}));

vi.mock("@/features/wallet/use-wallet-transactions", () => ({
  useWalletTransactions: () => ({
    address: OWNER,
    error: undefined,
    hash: undefined,
    isConnected: true,
    isPending: false,
    isReady: true,
    needsChainSwitch: false,
    refreshAfterMutation: refreshAfterMutationMock,
    runContract: runContractMock,
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

const snapshot: TokenMarketSnapshot = {
  activeBuyOffers: [],
  activeSellOffer: null,
  token: {
    id: 1088,
    media: {
      blackImage: "/black.png",
      blackImageThumb: "/black-thumb.png",
      blackSingleVideo: "/black-single.mp4",
      blackTripleVideo: "/black-triple.mp4",
      whiteImage: "/white.png",
      whiteImageThumb: "/white-thumb.png",
      whiteSingleVideo: "/white-single.mp4",
      whiteTripleVideo: "/white-triple.mp4",
    },
    name: "Random Walk 1088",
    nextTokenId: null,
    owner: OWNER,
    previousTokenId: null,
    seed: `0x${"1".repeat(64)}`,
  },
};

const escrowedSnapshot: TokenMarketSnapshot = {
  ...snapshot,
  activeBuyOffers: [
    {
      active: true,
      buyer: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      id: 8,
      imageThumb: "/black-thumb.png",
      priceEth: "0.20",
      priceWei: "200000000000000000",
      seller: zeroAddress,
      tokenId: 1088,
      tokenName: "Random Walk 1088",
      type: "buy",
    },
  ],
  activeSellOffer: {
    active: true,
    buyer: zeroAddress,
    id: 7,
    imageThumb: "/black-thumb.png",
    priceEth: "0.25",
    priceWei: "250000000000000000",
    seller: OWNER,
    tokenId: 1088,
    tokenName: "Random Walk 1088",
    type: "sell",
  },
  token: {
    ...snapshot.token,
    owner: "0x47eF85Dfb775aCE0934fBa9EEd09D22e6eC0Cc08",
  },
};

describe("TokenActionPanel mobile transaction flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    marketplaceApproved = false;
    runContractMock.mockResolvedValue({ status: "success" });
    approvalRefetchMock.mockResolvedValue({ data: true });
  });

  it("requires separate approval and listing taps", async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<TokenActionPanel snapshot={snapshot} />);
    await user.type(screen.getByPlaceholderText("0.25"), "0.25");

    await user.click(
      screen.getByRole("button", { name: "Approve marketplace" }),
    );

    expect(runContractMock).toHaveBeenCalledTimes(1);
    expect(runContractMock).toHaveBeenCalledWith(
      "Approve marketplace",
      expect.objectContaining({
        functionName: "setApprovalForAll",
      }),
    );
    expect(
      runContractMock.mock.calls.some(
        ([, request]) => request.functionName === "makeSellOffer",
      ),
    ).toBe(false);
  });

  it("lists only after marketplace approval is already confirmed", async () => {
    marketplaceApproved = true;
    const user = userEvent.setup();
    renderWithQueryClient(<TokenActionPanel snapshot={snapshot} />);
    await user.type(screen.getByPlaceholderText("0.25"), "0.25");

    await user.click(screen.getByRole("button", { name: "List token" }));

    expect(runContractMock).toHaveBeenLastCalledWith(
      "Create sell offer",
      expect.objectContaining({
        functionName: "makeSellOffer",
        args: expect.arrayContaining([250000000000000000n]),
      }),
    );
  });

  it("lets an escrowed listing seller cancel instead of buying", () => {
    renderWithQueryClient(<TokenActionPanel snapshot={escrowedSnapshot} />);

    expect(
      screen.getAllByRole("button", { name: "Cancel listing" }).length,
    ).toBeGreaterThan(0);
    expect(
      screen.queryByRole("button", { name: "Accept sell offer" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Accept buy offer" }),
    ).not.toBeInTheDocument();
  });
});
