import { describe, expect, it } from "vitest";

import {
  buildTokenMedia,
  getMediaUrlFromHash,
  parseMediaHash,
} from "@/lib/media";

describe("media helpers", () => {
  it("builds deterministic media URLs", () => {
    const media = buildTokenMedia(17, "https://example.com/media");

    expect(media.blackImage).toBe("https://example.com/media/000017_black.png");
    expect(media.whiteTripleVideo).toBe(
      "https://example.com/media/000017_white_triple.mp4",
    );
  });

  it("accepts only known deep-link hashes", () => {
    const media = buildTokenMedia(17, "https://example.com/media");

    expect(parseMediaHash("#black_image")).toBe("#black_image");
    expect(parseMediaHash("#unknown")).toBeNull();
    expect(getMediaUrlFromHash(media, "#white_single_video")).toBe(
      "https://example.com/media/000017_white_single.mp4",
    );
  });
});
