import { describe, expect, it } from "vitest";

import {
  formatAddress,
  formatCountdown,
  formatDateTime,
  formatEth,
  formatTokenId,
  secondsFromNow,
  serializeMintPrice,
} from "@/lib/format";

describe("format helpers", () => {
  it("shortens wallet addresses", () => {
    expect(formatAddress("0x1234567890abcdef1234567890abcdef12345678")).toBe(
      "0x1234...5678",
    );
    expect(formatAddress("")).toBe("");
  });

  it("formats token ids with left padding", () => {
    expect(formatTokenId(17)).toBe("#000017");
  });

  it("formats wei to eth", () => {
    expect(formatEth("420000000000000000")).toBe("0.42");
    expect(serializeMintPrice("10100000000000000")).toBe("0.0101 ETH");
  });

  it("formats countdown values", () => {
    expect(formatCountdown(90_061)).toBe("1d 1h 1m 1s");
    expect(formatDateTime(secondsFromNow(60))).toMatch(/\w+/);
  });
});
