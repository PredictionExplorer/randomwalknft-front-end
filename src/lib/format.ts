import { formatEther } from "viem";

export function formatAddress(address: string, lead = 6, tail = 4) {
  if (!address) {
    return "";
  }

  return `${address.slice(0, lead)}...${address.slice(-tail)}`;
}

export function formatTokenId(id: number) {
  return `#${id.toString().padStart(6, "0")}`;
}

export function formatEth(value: bigint | string, maximumFractionDigits = 4) {
  const bigintValue = typeof value === "bigint" ? value : BigInt(value);
  const formatted = Number.parseFloat(formatEther(bigintValue));

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits,
    minimumFractionDigits: 0,
  }).format(formatted);
}

export function serializeMintPrice(value: string) {
  return `${formatEth(value)} ETH`;
}

export function formatInteger(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function secondsFromNow(seconds: number) {
  return new Date(Date.now() + seconds * 1000).toISOString();
}

export function formatCountdown(seconds: number) {
  const safeSeconds = Math.max(seconds, 0);
  const days = Math.floor(safeSeconds / 86_400);
  const hours = Math.floor((safeSeconds % 86_400) / 3_600);
  const minutes = Math.floor((safeSeconds % 3_600) / 60);
  const remainingSeconds = safeSeconds % 60;

  return [
    days > 0 ? `${days}d` : null,
    `${hours}h`,
    `${minutes}m`,
    `${remainingSeconds}s`,
  ]
    .filter(Boolean)
    .join(" ");
}
