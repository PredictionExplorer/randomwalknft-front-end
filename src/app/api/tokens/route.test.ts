import { describe, expect, it, vi } from "vitest";

import { POST } from "@/app/api/tokens/route";

vi.mock("@/lib/api/nft-service", () => ({
  triggerTokenMediaGeneration: vi.fn().mockResolvedValue({ ok: true }),
}));

describe("POST /api/tokens", () => {
  it("validates payloads and returns success", async () => {
    const response = await POST(
      new Request("http://localhost/api/tokens", {
        body: JSON.stringify({ tokenId: 17 }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true });
  });
});
