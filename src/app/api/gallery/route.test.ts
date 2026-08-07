import { describe, expect, it, vi } from "vitest";

import { GET } from "@/app/api/gallery/route";

vi.mock("@/lib/contracts/nft", () => ({
  getGalleryPage: vi.fn().mockResolvedValue({
    items: [],
    ownerAddress: null,
    page: 2,
    pageSize: 24,
    sort: "latest",
    totalItems: 0,
    totalPages: 1,
    view: "grid",
  }),
}));

describe("GET /api/gallery", () => {
  it("parses paging params", async () => {
    const response = await GET(
      new Request(
        "http://localhost/api/gallery?page=2&pageSize=24&sort=latest&view=grid",
      ),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      page: 2,
      pageSize: 24,
      sort: "latest",
      view: "grid",
    });
  });

  it("falls back for invalid params", async () => {
    const response = await GET(
      new Request(
        "http://localhost/api/gallery?page=-1&pageSize=0&sort=oops&view=spotlight",
      ),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      view: "grid",
    });
  });
});
