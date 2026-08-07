import { NextResponse } from "next/server";

import { getRandomSelection } from "@/lib/api/nft-service";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(await getRandomSelection());
}
