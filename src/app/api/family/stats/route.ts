import { NextResponse } from "next/server";
import { familyStore } from "@/lib/family-store";

export async function GET() {
  const stats = familyStore.getStats();
  return NextResponse.json({ data: stats });
}
