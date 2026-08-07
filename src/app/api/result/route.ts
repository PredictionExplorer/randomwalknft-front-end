import { NextResponse } from "next/server";

import { getResultStats } from "@/lib/api/nft-service";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(await getResultStats());
}
