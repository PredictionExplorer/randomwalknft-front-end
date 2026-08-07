import { NextResponse } from "next/server";

import { getGiveawayEntries } from "@/lib/api/nft-service";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(await getGiveawayEntries());
}
