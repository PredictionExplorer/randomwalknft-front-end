import { describe, expect, it, vi } from "vitest";

import { GET } from "@/app/api/detail/[id]/route";

vi.mock("@/lib/contracts/market", () => ({
  getTokenMarketSnapshot: vi.fn().mockResolvedValue({
    activeBuyOffers: [],
    activeSellOffer: null,
    token: {
      id: 1088,
      media: {
        blackImage: "/brand/back.png",
        blackImageThumb: "/brand/back.png",
        blackSingleVideo: "/brand/back.png",
        blackTripleVideo: "/brand/back.png",
        whiteImage: "/brand/back.png",
        whiteImageThumb: "/brand/back.png",
        whiteSingleVideo: "/brand/back.png",
        whiteTripleVideo: "/brand/back.png",
      },
      name: "Random Walk 1088",
      nextTokenId: null,
      owner: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      previousTokenId: 1087,
      seed: "0x01",
    },
  }),
}));

describe("GET /api/detail/[id]", () => {
  it("rejects invalid token ids", async () => {
    const response = await GET(
      new Request("http://localhost/api/detail/nope"),
      {
        params: Promise.resolve({ id: "nope" }),
      },
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      message: "Invalid token id.",
    });
  });

  it("returns token detail payloads for valid ids", async () => {
    const response = await GET(
      new Request("http://localhost/api/detail/1088"),
      {
        params: Promise.resolve({ id: "1088" }),
      },
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      token: {
        id: 1088,
        name: "Random Walk 1088",
      },
    });
  });
});
