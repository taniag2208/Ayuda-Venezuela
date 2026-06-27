import { NextResponse } from "next/server";

// In production this queries Supabase aggregates
export async function GET() {
  // Demo stats — replace with real Supabase queries
  const stats = {
    total_requests: 47,
    fulfilled_requests: 12,
    total_offers: 28,
    active_volunteers: 243,
    active_centers: 6,
    people_helped: 1847,
    matches_made: 31,
  };

  return NextResponse.json(stats, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30" },
  });
}
