import { NextRequest, NextResponse } from "next/server";

const inMemoryVolunteers: Array<Record<string, unknown>> = [];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = Math.min(Number(searchParams.get("limit") ?? 50), 200);

  return NextResponse.json({
    data: inMemoryVolunteers.slice(0, limit),
    total: inMemoryVolunteers.length,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, contact, location, skills, availability, organization, languages } = body;

    if (!name || !contact || !location || !skills) {
      return NextResponse.json({ error: "Campos requeridos faltantes" }, { status: 400 });
    }

    const volunteer = {
      id: `vol-${Date.now()}`,
      name,
      contact,
      location,
      skills: Array.isArray(skills) ? skills : [skills],
      availability: availability ?? "flexible",
      organization: organization ?? null,
      languages: languages ?? ["Español"],
      verified: false,
      assigned_task: null,
      created_at: new Date().toISOString(),
    };

    inMemoryVolunteers.unshift(volunteer);

    return NextResponse.json({ data: volunteer }, { status: 201 });
  } catch (err) {
    console.error("[volunteers/POST]", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
