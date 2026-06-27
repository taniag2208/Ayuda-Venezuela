import { NextResponse } from "next/server";
import { familyStore } from "@/lib/family-store";
import type { MissingPersonReport, SurvivorReport } from "@/types";

/** Normalize string for fuzzy comparison: lowercase, remove accents, collapse spaces */
function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Trigram-based similarity score 0–1 */
function trigramSimilarity(a: string, b: string): number {
  if (!a || !b) return 0;
  const na = normalize(a);
  const nb = normalize(b);
  if (na === nb) return 1;

  const getTrigrams = (s: string): Set<string> => {
    const padded = `  ${s}  `;
    const tg = new Set<string>();
    for (let i = 0; i < padded.length - 2; i++) tg.add(padded.slice(i, i + 3));
    return tg;
  };

  const ta = getTrigrams(na);
  const tb = getTrigrams(nb);
  let intersection = 0;
  ta.forEach((t) => { if (tb.has(t)) intersection++; });
  return (2 * intersection) / (ta.size + tb.size);
}

/** Contains check with normalization */
function fuzzyContains(haystack: string, needle: string): boolean {
  return normalize(haystack).includes(normalize(needle));
}

/** Score a missing person record against a query */
function scoreMissing(r: MissingPersonReport, q: string, city: string, state: string): number {
  const normQ = normalize(q);
  let score = 0;

  if (normQ) {
    const nameSim = trigramSimilarity(r.full_name, q);
    const aliasSim = r.alias ? trigramSimilarity(r.alias, q) : 0;
    score += Math.max(nameSim, aliasSim) * 70;

    if (fuzzyContains(r.full_name, q)) score += 15;
    if (r.alias && fuzzyContains(r.alias, q)) score += 10;
  }

  if (city && fuzzyContains(r.city, city)) score += 20;
  if (state && fuzzyContains(r.state, state)) score += 15;

  return Math.min(score, 100);
}

/** Score a survivor record against a query */
function scoreSurvivor(r: SurvivorReport, q: string, city: string, state: string): number {
  const normQ = normalize(q);
  let score = 0;

  if (normQ) {
    const nameSim = trigramSimilarity(r.full_name, q);
    score += nameSim * 70;
    if (fuzzyContains(r.full_name, q)) score += 15;
  }

  if (city && fuzzyContains(r.current_location, city)) score += 20;
  if (state && fuzzyContains(r.current_location, state)) score += 10;
  if (r.location_name && (city && fuzzyContains(r.location_name, city))) score += 10;

  return Math.min(score, 100);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const city = searchParams.get("city") || "";
  const state = searchParams.get("state") || "";
  const ageStr = searchParams.get("age");
  const sex = searchParams.get("sex");
  const type = searchParams.get("type") || "all"; // "missing" | "survivor" | "all"
  const limit = Math.min(Number(searchParams.get("limit") || "20"), 50);
  const minScore = 20;

  if (!q && !city && !state && !ageStr && !sex) {
    return NextResponse.json({ missing: [], survivors: [], total: 0 });
  }

  const results: {
    missing: Array<{ score: number; record: object }>;
    survivors: Array<{ score: number; record: object }>;
  } = { missing: [], survivors: [] };

  if (type !== "survivor") {
    const missing = familyStore
      .getAllMissing()
      .filter((r) => !["closed", "archived"].includes(r.status));

    for (const r of missing) {
      let score = scoreMissing(r, q, city, state);

      // Age filter
      if (ageStr) {
        const age = Number(ageStr);
        if (Math.abs(r.age_approx - age) > 10) continue;
        if (Math.abs(r.age_approx - age) <= 5) score += 10;
      }

      // Sex filter
      if (sex && sex !== "unknown" && r.sex !== sex) continue;

      if (score >= minScore) {
        // Strip sensitive fields
        const { allergies, disability, medications, medical_conditions,
                reporter_email, reporter_phone, reporter_whatsapp,
                lat, lng, address_approx, ...safe } = r;
        void allergies; void disability; void medications; void medical_conditions;
        void reporter_email; void reporter_phone; void reporter_whatsapp;
        void lat; void lng; void address_approx;
        results.missing.push({ score, record: safe });
      }
    }

    results.missing.sort((a, b) => b.score - a.score);
    results.missing = results.missing.slice(0, limit);
  }

  if (type !== "missing") {
    const survivors = familyStore
      .getAllSurvivors()
      .filter((r) => r.consent_to_be_found && !["closed", "archived"].includes(r.status));

    for (const r of survivors) {
      let score = scoreSurvivor(r, q, city, state);

      if (ageStr && r.age_approx != null) {
        const age = Number(ageStr);
        if (Math.abs(r.age_approx - age) > 10) continue;
        if (Math.abs(r.age_approx - age) <= 5) score += 10;
      }

      if (score >= minScore) {
        results.survivors.push({
          score,
          record: {
            id: r.id,
            full_name: r.full_name,
            age_approx: r.age_approx,
            current_location: r.current_location,
            location_type: r.location_type,
            location_name: r.location_name,
            health_status: r.health_status,
            needs_help: r.needs_help,
            message_for_family: r.message_for_family,
            consent_to_be_found: r.consent_to_be_found,
            ...(r.show_email && r.email ? { email: r.email } : {}),
            ...(r.show_phone && r.phone ? { phone: r.phone } : {}),
            ...(r.show_whatsapp && r.whatsapp ? { whatsapp: r.whatsapp } : {}),
            status: r.status,
            created_at: r.created_at,
          },
        });
      }
    }

    results.survivors.sort((a, b) => b.score - a.score);
    results.survivors = results.survivors.slice(0, limit);
  }

  return NextResponse.json({
    missing: results.missing,
    survivors: results.survivors,
    total: results.missing.length + results.survivors.length,
  });
}
