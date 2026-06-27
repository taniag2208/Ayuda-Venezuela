import { NextResponse } from "next/server";
import { z } from "zod";
import { familyStore } from "@/lib/family-store";
import { scoreSurvivorAgainstMissing } from "@/lib/agents/family-reunification-agent";
import type { SurvivorReport } from "@/types";

const createSchema = z.object({
  full_name: z.string().min(2).max(150),
  age_approx: z.number().int().min(0).max(120).optional(),
  photo_url: z.string().url().optional(),
  current_location: z.string().min(2).max(300),
  location_type: z.enum(["hospital", "shelter", "care_center", "home", "other"]),
  location_name: z.string().max(200).optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  health_status: z.enum(["good", "injured", "critical", "unknown"]),
  needs_help: z.boolean().default(false),
  message_for_family: z.string().max(1000).optional(),
  consent_to_be_found: z.boolean().default(true),
  show_email: z.boolean().default(false),
  show_phone: z.boolean().default(false),
  show_whatsapp: z.boolean().default(false),
  email: z.string().email().optional(),
  phone: z.string().max(30).optional(),
  whatsapp: z.string().max(30).optional(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const location_type = searchParams.get("location_type");
  const limit = Math.min(Number(searchParams.get("limit") || "50"), 100);

  let reports = familyStore.getAllSurvivors().filter((r) => r.consent_to_be_found);

  if (location_type) reports = reports.filter((r) => r.location_type === location_type);

  const safe = reports.slice(0, limit).map(stripContact);

  return NextResponse.json({ data: safe, total: reports.length });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Datos inválidos", details: parsed.error.issues }, { status: 400 });
    }

    const now = new Date().toISOString();
    const report: SurvivorReport = {
      ...parsed.data,
      id: `sv-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      status: "searching",
      created_at: now,
      updated_at: now,
    };

    familyStore.addSurvivor(report);

    // Run matching agent in background
    const missing = familyStore.getAllMissing().filter((m) => m.status === "searching");
    if (missing.length > 0) {
      scoreSurvivorAgainstMissing(report, missing)
        .then((matches) => {
          matches.forEach((m) => {
            familyStore.addMatch({
              ...m,
              missing_side_consent: false,
              survivor_side_consent: false,
              updated_at: now,
            });
            if (m.score >= 80) {
              familyStore.updateSurvivor(report.id, { status: "possible_match" });
              familyStore.updateMissing(m.missing_report_id, { status: "possible_match" });
            }
          });
        })
        .catch(() => {});
    }

    return NextResponse.json({ data: stripContact(report) }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

function stripContact(r: SurvivorReport) {
  // Conditionally expose contact based on survivor's own consent preferences
  return {
    id: r.id,
    full_name: r.full_name,
    age_approx: r.age_approx,
    photo_url: r.photo_url,
    current_location: r.current_location,
    location_type: r.location_type,
    location_name: r.location_name,
    health_status: r.health_status,
    needs_help: r.needs_help,
    message_for_family: r.message_for_family,
    consent_to_be_found: r.consent_to_be_found,
    show_email: r.show_email,
    show_phone: r.show_phone,
    show_whatsapp: r.show_whatsapp,
    // Only include contact fields if the survivor explicitly opted in
    ...(r.show_email && r.email ? { email: r.email } : {}),
    ...(r.show_phone && r.phone ? { phone: r.phone } : {}),
    ...(r.show_whatsapp && r.whatsapp ? { whatsapp: r.whatsapp } : {}),
    status: r.status,
    created_at: r.created_at,
    updated_at: r.updated_at,
  };
}
