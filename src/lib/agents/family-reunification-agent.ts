import Anthropic from "@anthropic-ai/sdk";
import type { MissingPersonReport, SurvivorReport, FamilyMatch } from "@/types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `Eres el Agente de Reunificación Familiar de una plataforma humanitaria de emergencia.
Tu función es comparar reportes de personas desaparecidas con reportes de sobrevivientes y calcular probabilidades de coincidencia.

SIEMPRE responde en JSON válido con esta estructura:
{
  "matches": [
    {
      "missing_report_id": "string",
      "survivor_report_id": "string",
      "score": número entre 0 y 100,
      "match_reasons": ["razón 1", "razón 2", "razón 3"],
      "confidence": "low" | "medium" | "high" | "very_high"
    }
  ]
}

CRITERIOS DE COINCIDENCIA (por peso):
1. Nombre completo o alias (40%) — tolera errores ortográficos y variaciones
2. Edad aproximada ±5 años (20%)
3. Sexo (15%)
4. Ciudad / estado / zona geográfica (15%)
5. Fecha y lugar de la última vez visto vs ubicación actual (10%)

REGLAS IMPORTANTES:
- Solo incluye coincidencias con score >= 60
- Explica cada razón de coincidencia con claridad
- Usa "high" o "very_high" solo cuando múltiples criterios coincidan
- Considera errores de escritura en nombres (ej: "Andrés" vs "Andres")
- Considera variaciones culturales (ej: apodo vs nombre formal)
- Un score de 90+ indica coincidencia casi segura
- Un score de 75-89 indica coincidencia probable
- Un score de 60-74 indica coincidencia posible que merece verificación`;

interface AgentMatchInput {
  missing_report_id: string;
  survivor_report_id: string;
  score: number;
  match_reasons: string[];
  confidence: "low" | "medium" | "high" | "very_high";
}

export async function findFamilyMatches(
  missingReports: MissingPersonReport[],
  survivorReports: SurvivorReport[]
): Promise<Omit<FamilyMatch, "missing_side_consent" | "survivor_side_consent" | "updated_at">[]> {
  if (missingReports.length === 0 || survivorReports.length === 0) return [];

  const prompt = `Compara estos reportes de personas desaparecidas con reportes de sobrevivientes.

PERSONAS DESAPARECIDAS:
${JSON.stringify(
  missingReports.slice(0, 15).map((r) => ({
    id: r.id,
    full_name: r.full_name,
    alias: r.alias,
    age_approx: r.age_approx,
    sex: r.sex,
    country: r.country,
    state: r.state,
    city: r.city,
    last_seen_place: r.last_seen_place,
    last_seen_at: r.last_seen_at,
    physical: {
      height_cm: r.height_cm,
      hair_color: r.hair_color,
      eye_color: r.eye_color,
      clothing: r.clothing_description,
    },
  })),
  null,
  2
)}

SOBREVIVIENTES REPORTADOS:
${JSON.stringify(
  survivorReports.slice(0, 15).map((s) => ({
    id: s.id,
    full_name: s.full_name,
    age_approx: s.age_approx,
    current_location: s.current_location,
    location_type: s.location_type,
    location_name: s.location_name,
    health_status: s.health_status,
  })),
  null,
  2
)}

Encuentra todas las coincidencias potenciales con score >= 60. Responde solo con el JSON.`;

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "{}";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return [];

    const result = JSON.parse(jsonMatch[0]);
    const now = new Date().toISOString();

    return (result.matches || []).map((m: AgentMatchInput) => ({
      id: `fm-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      missing_report_id: m.missing_report_id,
      survivor_report_id: m.survivor_report_id,
      score: Math.min(100, Math.max(0, m.score)),
      match_reasons: m.match_reasons || [],
      status: "suggested" as const,
      created_at: now,
    }));
  } catch {
    return [];
  }
}

export async function scoreNewReport(
  newMissing: MissingPersonReport,
  existingSurvivors: SurvivorReport[]
): Promise<Omit<FamilyMatch, "missing_side_consent" | "survivor_side_consent" | "updated_at">[]> {
  return findFamilyMatches([newMissing], existingSurvivors);
}

export async function scoreSurvivorAgainstMissing(
  newSurvivor: SurvivorReport,
  existingMissing: MissingPersonReport[]
): Promise<Omit<FamilyMatch, "missing_side_consent" | "survivor_side_consent" | "updated_at">[]> {
  return findFamilyMatches(existingMissing, [newSurvivor]);
}
