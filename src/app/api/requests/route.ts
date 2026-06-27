import { NextRequest, NextResponse } from "next/server";
import { verifyReport } from "@/lib/agents/verification-agent";

// In-memory store for MVP demo (replace with Supabase in production)
const inMemoryRequests: Array<Record<string, unknown>> = [
  {
    id: "demo-1",
    title: "Necesito agua potable urgente para familia",
    description: "Llevamos 3 días sin agua en el sector Las Palmas. Somos 5 personas incluyendo dos niños y una abuela de 78 años.",
    category: "water",
    status: "pending",
    urgency: 5,
    location: "Las Palmas, Caracas",
    people_count: 5,
    contact: "0412-555-0001",
    verification_level: "high",
    created_at: new Date(Date.now() - 3600000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "demo-2",
    title: "Familia necesita refugio temporal",
    description: "Nuestra casa quedó dañada en el terremoto. Somos 3 adultos y necesitamos un lugar seguro donde quedarnos mientras evaluamos los daños.",
    category: "shelter",
    status: "pending",
    urgency: 4,
    location: "La California Norte, Miranda",
    people_count: 3,
    contact: "0424-555-0002",
    verification_level: "medium",
    created_at: new Date(Date.now() - 7200000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "demo-3",
    title: "Medicamentos para diabético",
    description: "Adulto mayor con diabetes tipo 2 necesita insulina y metformina. Se le acabaron los medicamentos y no hay farmacias abiertas en la zona.",
    category: "medical",
    status: "in_progress",
    urgency: 5,
    location: "El Cafetal, Baruta, Miranda",
    people_count: 1,
    contact: "0416-555-0003",
    verification_level: "high",
    created_at: new Date(Date.now() - 10800000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "demo-4",
    title: "Alimentos para adultos mayores en asilo",
    description: "El asilo San José tiene 45 personas mayores y solo tenemos alimentos para 2 días más. Necesitamos donación urgente de comida no perecedera.",
    category: "food",
    status: "pending",
    urgency: 4,
    location: "Los Chaguaramos, Caracas",
    people_count: 45,
    contact: "0212-555-0004",
    verification_level: "official",
    created_at: new Date(Date.now() - 14400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "demo-5",
    title: "Transporte para embarazada hacia hospital",
    description: "Mujer embarazada de 8 meses necesita transporte urgente al Hospital de Clínicas. No hay gasolina disponible en el área.",
    category: "transport",
    status: "fulfilled",
    urgency: 5,
    location: "Catia, Caracas",
    people_count: 1,
    contact: "0426-555-0005",
    verification_level: "high",
    created_at: new Date(Date.now() - 18000000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = Math.min(Number(searchParams.get("limit") ?? 20), 100);
  const status = searchParams.get("status");
  const category = searchParams.get("category");
  const urgency = searchParams.get("urgency");

  let results = [...inMemoryRequests];

  if (status) results = results.filter((r) => r.status === status);
  if (category) results = results.filter((r) => r.category === category);
  if (urgency) results = results.filter((r) => r.urgency === Number(urgency));

  // Sort by urgency desc, then created_at desc
  results.sort((a, b) => {
    const urgencyDiff = (b.urgency as number) - (a.urgency as number);
    if (urgencyDiff !== 0) return urgencyDiff;
    return new Date(b.created_at as string).getTime() - new Date(a.created_at as string).getTime();
  });

  return NextResponse.json({
    data: results.slice(0, limit),
    total: results.length,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, category, location, people_count, urgency, contact } = body;

    if (!title || !description || !category || !location || !contact) {
      return NextResponse.json({ error: "Campos requeridos faltantes" }, { status: 400 });
    }

    // Run verification agent
    const verification = await verifyReport(title, description, contact, location, category);

    if (verification.is_spam) {
      return NextResponse.json(
        { error: "La solicitud fue identificada como spam. Si crees que es un error, contacta al soporte." },
        { status: 422 }
      );
    }

    const newRequest = {
      id: `req-${Date.now()}`,
      title,
      description,
      category,
      status: "pending",
      urgency: urgency || 3,
      location,
      people_count: people_count || 1,
      contact,
      verification_level: verification.level,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    inMemoryRequests.unshift(newRequest);

    return NextResponse.json({ data: newRequest, verification }, { status: 201 });
  } catch (err) {
    console.error("[requests/POST]", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
