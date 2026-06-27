import Anthropic from "@anthropic-ai/sdk";
import type { Request, Offer, Match } from "@/types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `Eres el Agente de Coincidencias de una plataforma humanitaria. Tu trabajo es conectar solicitudes de ayuda con ofertas disponibles.

Responde SIEMPRE en JSON válido:
{
  "matches": [
    {
      "request_id": "string",
      "offer_id": "string",
      "score": número entre 0 y 100,
      "reason": "explicación breve de por qué son compatibles"
    }
  ]
}

CRITERIOS DE COINCIDENCIA:
1. Categoría igual o compatible (peso: 40%)
2. Proximidad geográfica (peso: 30%)
3. Urgencia vs disponibilidad (peso: 20%)
4. Cantidad compatible (peso: 10%)

Categorías compatibles:
- "water" ↔ "food" (pueden compartir distribución)
- "shelter" ↔ "clothing" (mismo tipo de necesidad física)
- "transport" puede servir para "rescue" y "medical"

Solo incluye coincidencias con score >= 60.
Máximo 5 coincidencias por solicitud.`;

export async function findMatches(
  requests: Request[],
  offers: Offer[]
): Promise<Match[]> {
  if (requests.length === 0 || offers.length === 0) return [];

  const prompt = `Encuentra las mejores coincidencias entre estas solicitudes y ofertas:

SOLICITUDES:
${JSON.stringify(
  requests.slice(0, 10).map(r => ({
    id: r.id,
    title: r.title,
    category: r.category,
    location: r.location,
    urgency: r.urgency,
    people_count: r.people_count,
  })),
  null,
  2
)}

OFERTAS DISPONIBLES:
${JSON.stringify(
  offers.slice(0, 10).map(o => ({
    id: o.id,
    title: o.title,
    category: o.category,
    location: o.location,
    quantity: o.quantity,
  })),
  null,
  2
)}

Responde con el JSON de coincidencias.`;

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "{}";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return [];

    const result = JSON.parse(jsonMatch[0]);
    return (result.matches || []).map((m: Match & { created_at?: string }) => ({
      ...m,
      created_at: new Date().toISOString(),
    }));
  } catch {
    return [];
  }
}
