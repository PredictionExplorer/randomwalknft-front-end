import { NextResponse } from "next/server";
import { type Address, isAddress } from "viem";

import { getWalletTokens } from "@/lib/contracts/nft";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");

  if (!address || !isAddress(address)) {
    return NextResponse.json(
      { message: "Valid wallet address required." },
      { status: 400 },
    );
  }

  return NextResponse.json(await getWalletTokens(address as Address));
}
