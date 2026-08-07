import { describe, expect, it } from "vitest";

import { mintQueryOptions } from "./queries";

describe("mintQueryOptions", () => {
  it("keeps the payable mint quote fresh before a wallet interaction", () => {
    const options = mintQueryOptions();

    expect(options.refetchInterval).toBe(15_000);
    expect(options.refetchOnWindowFocus).toBe(true);
    expect(options.staleTime).toBe(5_000);
  });
});
