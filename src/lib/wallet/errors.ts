interface ErrorLike {
  cause?: unknown;
  message?: string;
  shortMessage?: string;
}

function collectMessages(error: unknown): string {
  const messages: string[] = [];
  let current = error;
  const seen = new Set<unknown>();

  while (current && !seen.has(current)) {
    seen.add(current);

    if (current instanceof Error && current.message) {
      messages.push(current.message);
    } else if (typeof current === "object") {
      const errorLike = current as ErrorLike;
      if (errorLike.shortMessage) messages.push(errorLike.shortMessage);
      if (errorLike.message) messages.push(errorLike.message);
      current = errorLike.cause;
      continue;
    } else if (typeof current === "string") {
      messages.push(current);
    }

    current =
      typeof current === "object" && current
        ? (current as ErrorLike).cause
        : undefined;
  }

  return messages.join(" ");
}

export function getWalletErrorMessage(
  error: unknown,
  fallback = "The wallet request failed. Please try again.",
) {
  const message = collectMessages(error);

  if (
    /user rejected|user denied|rejected the request|code.?4001/i.test(message)
  ) {
    return "The request was cancelled in your wallet.";
  }

  if (
    /request already pending|resource unavailable|code.?-?32002/i.test(message)
  ) {
    return "A wallet request is already open. Return to your wallet to finish it.";
  }

  if (
    /provider not found|connector not found|wallet not found/i.test(message)
  ) {
    return "That wallet is not available in this browser.";
  }

  if (
    /chain mismatch|wrong chain|switch chain|unsupported chain/i.test(message)
  ) {
    return "Switch your wallet to Arbitrum and try again.";
  }

  if (/insufficient funds/i.test(message)) {
    return "This wallet does not have enough ETH for the transaction and gas.";
  }

  if (/revert|execution reverted/i.test(message)) {
    return "The contract rejected this transaction. Refresh the page and check the action details.";
  }

  return fallback;
}
