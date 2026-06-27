import { NextResponse } from "next/server";
import { z } from "zod";
import { familyStore } from "@/lib/family-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const missingId = searchParams.get("missing_id");
  const survivorId = searchParams.get("survivor_id");

  let matches = familyStore.getAllMatches();

  if (missingId) matches = familyStore.getMatchesForMissing(missingId);
  else if (survivorId) matches = familyStore.getMatchesForSurvivor(survivorId);

  // Enrich matches with safe public data from both sides
  const enriched = matches.map((m) => {
    const missing = familyStore.getMissingById(m.missing_report_id);
    const survivor = familyStore.getSurvivorById(m.survivor_report_id);

    return {
      ...m,
      missing_person: missing
        ? {
            id: missing.id,
            full_name: missing.full_name,
            alias: missing.alias,
            age_approx: missing.age_approx,
            sex: missing.sex,
            city: missing.city,
            state: missing.state,
            last_seen_at: missing.last_seen_at,
            last_seen_place: missing.last_seen_place,
            photo_url: missing.photo_url,
            status: missing.status,
            // Reporter contact only if both sides accepted
            ...(m.missing_side_consent && m.survivor_side_consent
              ? {
                  reporter_name: missing.reporter_name,
                  reporter_relationship: missing.reporter_relationship,
                  reporter_email: missing.reporter_email,
                  reporter_phone: missing.reporter_phone,
                  reporter_whatsapp: missing.reporter_whatsapp,
                }
              : {}),
          }
        : null,
      survivor: survivor
        ? {
            id: survivor.id,
            full_name: survivor.full_name,
            age_approx: survivor.age_approx,
            current_location: survivor.current_location,
            location_type: survivor.location_type,
            location_name: survivor.location_name,
            health_status: survivor.health_status,
            message_for_family: survivor.message_for_family,
            photo_url: survivor.photo_url,
            status: survivor.status,
            // Contact only after mutual consent
            ...(m.missing_side_consent && m.survivor_side_consent
              ? {
                  ...(survivor.show_email ? { email: survivor.email } : {}),
                  ...(survivor.show_phone ? { phone: survivor.phone } : {}),
                  ...(survivor.show_whatsapp ? { whatsapp: survivor.whatsapp } : {}),
                }
              : {}),
          }
        : null,
    };
  });

  return NextResponse.json({ data: enriched, total: enriched.length });
}

const consentSchema = z.object({
  match_id: z.string(),
  side: z.enum(["missing", "survivor"]),
  accepted: z.boolean(),
});

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const parsed = consentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const { match_id, side, accepted } = parsed.data;
    const match = familyStore.getMatchById(match_id);
    if (!match) {
      return NextResponse.json({ error: "Coincidencia no encontrada" }, { status: 404 });
    }

    const update: Parameters<typeof familyStore.updateMatch>[1] = {};

    if (side === "missing") update.missing_side_consent = accepted;
    else update.survivor_side_consent = accepted;

    // Determine new status
    const newMissingConsent = side === "missing" ? accepted : match.missing_side_consent;
    const newSurvivorConsent = side === "survivor" ? accepted : match.survivor_side_consent;

    if (!accepted) {
      update.status = "rejected";
    } else if (newMissingConsent && newSurvivorConsent) {
      update.status = "accepted";
    } else {
      update.status = "pending_consent";
    }

    const updated = familyStore.updateMatch(match_id, update);
    return NextResponse.json({ data: updated });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
