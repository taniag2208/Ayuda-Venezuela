import Anthropic from "@anthropic-ai/sdk";
import type { Stats } from "@/types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function generateInsights(stats: Stats, recentActivity: string[]): Promise<string> {
  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 512,
    system: `Eres un analista de datos para una plataforma de respuesta humanitaria.
Genera insights concisos (máximo 3 puntos) sobre el estado actual de la emergencia basándote en los datos.
Responde en español, en formato JSON:
{
  "insights": ["insight 1", "insight 2", "insight 3"],
  "priority_action": "acción más urgente recomendada",
  "trend": "improving" | "stable" | "worsening"
}`,
    messages: [
      {
        role: "user",
        content: `Estadísticas actuales:
${JSON.stringify(stats, null, 2)}

Actividad reciente:
${recentActivity.slice(0, 10).join("\n")}

Genera insights.`,
      },
    ],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "{}";
  return text;
}
