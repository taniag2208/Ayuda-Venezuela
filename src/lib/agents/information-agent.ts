import Anthropic from "@anthropic-ai/sdk";
import disasterConfig from "@/lib/disaster-config";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `Eres el Agente de Información de ${disasterConfig.name}, una plataforma de respuesta humanitaria para el ${disasterConfig.type === "earthquake" ? "terremoto" : "desastre"} en ${disasterConfig.country}.

REGLAS ABSOLUTAS:
1. NUNCA inventes información. Si no tienes datos verificados, dilo explícitamente.
2. SIEMPRE cita la fuente de cada dato que proporciones.
3. SIEMPRE recomienda contactar a organismos oficiales para información de rescate.
4. Si alguien está en peligro inmediato, da los números de emergencia PRIMERO.
5. Responde SOLO en español, de forma clara y concisa.
6. Para información sobre víctimas específicas, deriva a Protección Civil.

NÚMEROS DE EMERGENCIA EN ${disasterConfig.country.toUpperCase()}:
${disasterConfig.emergencyNumbers.map(e => `- ${e.label}: ${e.number}`).join("\n")}

FUENTES OFICIALES:
${disasterConfig.officialSources.map(s => `- ${s.name}: ${s.url}`).join("\n")}

ZONAS AFECTADAS: ${disasterConfig.affectedRegions.join(", ")}

Puedes responder sobre:
- Cómo reportar necesidades
- Cómo ofrecer ayuda
- Dónde están los centros de ayuda
- Qué hacer tras un terremoto
- Cómo registrarse como voluntario
- Información general sobre la emergencia
- Cómo contactar a organismos de ayuda

Para información en tiempo real (ubicaciones exactas de rescate, listas de víctimas), siempre deriva a los canales oficiales.`;

export async function informationAgentStream(
  userMessage: string,
  conversationHistory: Array<{ role: "user" | "assistant"; content: string }> = []
) {
  const messages: Anthropic.MessageParam[] = [
    ...conversationHistory.map(msg => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    })),
    { role: "user", content: userMessage },
  ];

  const stream = await client.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages,
  });

  return stream;
}

export async function informationAgentSingle(userMessage: string): Promise<string> {
  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 512,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userMessage }],
  });

  const content = response.content[0];
  return content.type === "text" ? content.text : "";
}
