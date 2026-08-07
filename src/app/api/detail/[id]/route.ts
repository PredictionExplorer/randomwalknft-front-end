import { NextResponse } from "next/server";

import { getTokenMarketSnapshot } from "@/lib/contracts/market";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const tokenId = Number.parseInt(id, 10);

  if (Number.isNaN(tokenId)) {
    return NextResponse.json({ message: "Invalid token id." }, { status: 400 });
  }

  const data = await getTokenMarketSnapshot(tokenId);

  if (!data) {
    return NextResponse.json({ message: "Not found." }, { status: 404 });
  }

  return NextResponse.json(data);
}
