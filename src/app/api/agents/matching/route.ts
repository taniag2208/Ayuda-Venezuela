import { NextRequest, NextResponse } from "next/server";
import { findMatches } from "@/lib/agents/matching-agent";
import type { Request, Offer } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { requests, offers }: { requests: Request[]; offers: Offer[] } = body;

    if (!requests?.length || !offers?.length) {
      return NextResponse.json({ matches: [] });
    }

    const matches = await findMatches(requests, offers);
    return NextResponse.json({ matches });
  } catch (err) {
    console.error("[agents/matching]", err);
    return NextResponse.json({ error: "Error al calcular coincidencias" }, { status: 500 });
  }
}
