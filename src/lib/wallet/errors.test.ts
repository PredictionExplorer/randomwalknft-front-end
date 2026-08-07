import { describe, expect, it } from "vitest";

import { getWalletErrorMessage } from "./errors";

describe("getWalletErrorMessage", () => {
  it("maps wallet rejection errors", () => {
    expect(getWalletErrorMessage(new Error("User rejected the request."))).toBe(
      "The request was cancelled in your wallet.",
    );
  });

  it("maps an already-open wallet request", () => {
    expect(
      getWalletErrorMessage(
        new Error("Request already pending. Please wait. Code: -32002"),
      ),
    ).toBe(
      "A wallet request is already open. Return to your wallet to finish it.",
    );
  });

  it("unwraps nested contract errors", () => {
    expect(
      getWalletErrorMessage({
        cause: new Error("execution reverted"),
        shortMessage: "Contract call failed",
      }),
    ).toBe(
      "The contract rejected this transaction. Refresh the page and check the action details.",
    );
  });

  it("uses the supplied fallback for unknown failures", () => {
    expect(
      getWalletErrorMessage(new Error("socket closed"), "Try later."),
    ).toBe("Try later.");
  });
});
