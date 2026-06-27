import { NextRequest, NextResponse } from "next/server";
import { verifyReport } from "@/lib/agents/verification-agent";

export async function POST(req: NextRequest) {
  try {
    const { title, description, contact, location, category } = await req.json();

    if (!title || !description) {
      return NextResponse.json({ error: "Título y descripción requeridos" }, { status: 400 });
    }

    const result = await verifyReport(title, description, contact ?? "", location ?? "", category ?? "other");
    return NextResponse.json(result);
  } catch (err) {
    console.error("[agents/verification]", err);
    return NextResponse.json({ error: "Error al verificar" }, { status: 500 });
  }
}
