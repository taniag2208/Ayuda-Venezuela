import { NextResponse } from "next/server";
import { z } from "zod";
import { familyStore } from "@/lib/family-store";
import { scoreNewReport } from "@/lib/agents/family-reunification-agent";
import type { MissingPersonReport } from "@/types";

const createSchema = z.object({
  full_name: z.string().min(2).max(150),
  alias: z.string().max(100).optional(),
  age_approx: z.number().int().min(0).max(120),
  sex: z.enum(["male", "female", "other", "unknown"]),
  photo_url: z.string().url().optional(),
  languages: z.array(z.string()).default(["Español"]),
  country: z.string().default("Venezuela"),
  state: z.string().min(1).max(100),
  city: z.string().min(1).max(100),
  address_approx: z.string().max(300).optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  last_seen_at: z.string(),
  last_seen_place: z.string().min(2).max(300),
  height_cm: z.number().int().min(50).max(250).optional(),
  hair_color: z.string().max(50).optional(),
  eye_color: z.string().max(50).optional(),
  clothing_description: z.string().max(500).optional(),
  distinguishing_marks: z.string().max(500).optional(),
  tattoos: z.string().max(500).optional(),
  scars: z.string().max(500).optional(),
  allergies: z.string().max(500).optional(),
  disability: z.string().max(500).optional(),
  medications: z.string().max(500).optional(),
  medical_conditions: z.string().max(500).optional(),
  reporter_name: z.string().min(2).max(150),
  reporter_relationship: z.string().min(1).max(100),
  reporter_email: z.string().email(),
  reporter_phone: z.string().max(30).optional(),
  reporter_whatsapp: z.string().max(30).optional(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const city = searchParams.get("city");
  const limit = Math.min(Number(searchParams.get("limit") || "50"), 100);

  let reports = familyStore.getAllMissing();

  if (status) reports = reports.filter((r) => r.status === status);
  if (city) reports = reports.filter((r) => r.city.toLowerCase().includes(city.toLowerCase()));

  // Strip sensitive fields for public response
  const safe = reports.slice(0, limit).map(stripSensitive);

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
    const report: MissingPersonReport = {
      ...parsed.data,
      id: `mp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      status: "searching",
      created_at: now,
      updated_at: now,
    };

    familyStore.addMissing(report);

    // Run matching agent in background (non-blocking)
    const survivors = familyStore.getAllSurvivors().filter((s) => s.consent_to_be_found);
    if (survivors.length > 0) {
      scoreNewReport(report, survivors)
        .then((matches) => {
          matches.forEach((m) => {
            familyStore.addMatch({
              ...m,
              missing_side_consent: false,
              survivor_side_consent: false,
              updated_at: now,
            });
            if (m.score >= 80) {
              familyStore.updateMissing(report.id, { status: "possible_match" });
            }
          });
        })
        .catch(() => {});
    }

    return NextResponse.json({ data: stripSensitive(report) }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

function stripSensitive(r: MissingPersonReport) {
  const { allergies, disability, medications, medical_conditions,
          reporter_email, reporter_phone, reporter_whatsapp,
          lat, lng, address_approx, ...safe } = r;
  void allergies; void disability; void medications; void medical_conditions;
  void reporter_email; void reporter_phone; void reporter_whatsapp;
  void lat; void lng; void address_approx;
  return safe;
}
