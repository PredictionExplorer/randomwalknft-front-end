import { describe, expect, it, vi } from "vitest";

import { GET } from "@/app/api/home/route";

vi.mock("@/lib/contracts/nft", () => ({
  getHomeStats: vi.fn().mockResolvedValue({
    activeSellOffers: 0,
    displayMintPriceWei: "10100000000000000",
    finishedCount: 0,
    mintPriceWei: "10000000000000000",
    runningCount: 0,
    totalSupply: 1088,
  }),
}));

vi.mock("@/lib/api/nft-service", () => ({
  getResultStats: vi.fn().mockResolvedValue({
    finishedCount: 7037,
    runningCount: 270,
  }),
}));

vi.mock("@/lib/contracts/market", () => ({
  getMarketplacePage: vi.fn().mockResolvedValue({
    items: [],
    page: 1,
    pageSize: 100,
    totalItems: 12,
    totalPages: 1,
  }),
}));

describe("GET /api/home", () => {
  it("aggregates contract and API-backed stats", async () => {
    const response = await GET();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      activeSellOffers: 12,
      finishedCount: 7037,
      runningCount: 270,
      totalSupply: 1088,
    });
  });
});
