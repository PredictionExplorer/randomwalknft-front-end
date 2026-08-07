import { NextResponse } from "next/server";

import { getMintState } from "@/lib/contracts/nft";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(await getMintState());
}
