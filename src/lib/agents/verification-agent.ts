import Anthropic from "@anthropic-ai/sdk";
import type { VerificationLevel } from "@/types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `Eres el Agente de Verificación de una plataforma humanitaria. Tu trabajo es analizar reportes de necesidades y ofertas de ayuda para determinar su confiabilidad.

Responde SIEMPRE en JSON válido con esta estructura exacta:
{
  "level": "unverified" | "low" | "medium" | "high" | "official",
  "score": número entre 0 y 100,
  "flags": ["lista de problemas detectados"],
  "recommendation": "texto breve con tu recomendación",
  "is_spam": boolean,
  "is_duplicate_risk": boolean
}

CRITERIOS DE VERIFICACIÓN:
- "official": El reporte proviene de una organización oficial reconocida (Cruz Roja, Protección Civil, etc.)
- "high": Información detallada, consistente, con ubicación específica y contacto verificable
- "medium": Información razonablemente detallada, sin señales de alerta
- "low": Información vaga, inconsistente, o con algunas señales de alerta
- "unverified": Sin información suficiente para evaluar

SEÑALES DE ALERTA (flags):
- Solicitudes de dinero o transferencias bancarias directas
- Números de teléfono irreales o faltantes
- Ubicaciones imposibles o contradictorias
- Texto con errores ortográficos excesivos (puede indicar bot)
- Información demasiado vaga para ser actionable
- Urgencia extrema sin detalles (puede ser manipulación)
- Solicitudes que no corresponden a emergencias reales

SEÑALES POSITIVAS:
- Nombre completo y cédula de identidad
- Dirección específica con referencias
- Número de teléfono local válido
- Descripción detallada y coherente
- Número de personas afectadas específico`;

export interface VerificationResult {
  level: VerificationLevel;
  score: number;
  flags: string[];
  recommendation: string;
  is_spam: boolean;
  is_duplicate_risk: boolean;
}

export async function verifyReport(
  title: string,
  description: string,
  contact: string,
  location: string,
  category: string
): Promise<VerificationResult> {
  const prompt = `Analiza este reporte humanitario:

TÍTULO: ${title}
DESCRIPCIÓN: ${description}
CATEGORÍA: ${category}
UBICACIÓN: ${location}
CONTACTO: ${contact}

Evalúa la confiabilidad y responde en JSON.`;

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 256,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "{}";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid JSON response");

    return JSON.parse(jsonMatch[0]) as VerificationResult;
  } catch {
    return {
      level: "unverified",
      score: 0,
      flags: ["Error al procesar la verificación"],
      recommendation: "Verificación manual requerida",
      is_spam: false,
      is_duplicate_risk: false,
    };
  }
}
