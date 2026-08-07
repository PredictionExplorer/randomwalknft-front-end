import { describe, expect, it } from "vitest";

import { getGalleryQueryString } from "@/features/gallery/queries";

describe("gallery query helpers", () => {
  it("builds stable search params", () => {
    expect(
      getGalleryQueryString({
        address: "0x1234",
        page: 2,
        pageSize: 24,
        sort: "latest",
        view: "grid",
      }),
    ).toBe("address=0x1234&page=2&pageSize=24&sort=latest&view=grid");
  });
});
