import { NextRequest, NextResponse } from "next/server";

const inMemoryOffers: Array<Record<string, unknown>> = [
  {
    id: "offer-1",
    title: "50 botellones de agua potable disponibles",
    description: "Tenemos 50 botellones de agua de 20 litros disponibles para entrega inmediata en el área de Chacao.",
    category: "water",
    status: "available",
    location: "Chacao, Caracas",
    quantity: "50 botellones (20L c/u)",
    contact: "0212-267-0000",
    organization: "Supermercado Central Madeirense",
    verification_level: "high",
    created_at: new Date(Date.now() - 1800000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "offer-2",
    title: "Camión disponible para transporte de ayuda",
    description: "Camión de 3 toneladas disponible para transporte de suministros de emergencia. Conductor incluido. Zona Caracas-Miranda.",
    category: "transport",
    status: "available",
    location: "La Candelaria, Caracas",
    quantity: "1 camión 3 ton",
    contact: "0414-555-0010",
    organization: "Transporte Rodríguez C.A.",
    verification_level: "medium",
    created_at: new Date(Date.now() - 3600000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "offer-3",
    title: "Cajas de alimentos no perecederos",
    description: "200 cajas con arroz, pasta, latas de sardinas, sal y aceite. Pueden ser recogidas o entregamos con coordinación previa.",
    category: "food",
    status: "available",
    location: "Valencia, Carabobo",
    quantity: "200 cajas mixtas",
    contact: "0241-555-0020",
    organization: "ONG Solidaridad Valencia",
    verification_level: "official",
    created_at: new Date(Date.now() - 5400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "offer-4",
    title: "Médico voluntario disponible para visitas a domicilio",
    description: "Médico general con disponibilidad para atención de emergencias a domicilio en zonas de Caracas. Traigo kit básico de primeros auxilios.",
    category: "medical",
    status: "available",
    location: "Altamira, Caracas",
    contact: "0416-555-0030",
    verification_level: "high",
    created_at: new Date(Date.now() - 7200000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "offer-5",
    title: "Generador eléctrico para prestar servicio temporal",
    description: "Generador de 5KVA disponible para hospitales, asilos o familias con necesidades médicas. Incluimos combustible para 48h.",
    category: "energy",
    status: "available",
    location: "El Paraíso, Caracas",
    quantity: "1 generador 5KVA",
    contact: "0212-555-0040",
    organization: null,
    verification_level: "medium",
    created_at: new Date(Date.now() - 9000000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = Math.min(Number(searchParams.get("limit") ?? 20), 100);
  const status = searchParams.get("status");
  const category = searchParams.get("category");

  let results = [...inMemoryOffers];

  if (status) results = results.filter((o) => o.status === status);
  if (category) results = results.filter((o) => o.category === category);

  results.sort(
    (a, b) =>
      new Date(b.created_at as string).getTime() - new Date(a.created_at as string).getTime()
  );

  return NextResponse.json({ data: results.slice(0, limit), total: results.length });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, category, location, quantity, contact, organization } = body;

    if (!title || !description || !category || !location || !contact) {
      return NextResponse.json({ error: "Campos requeridos faltantes" }, { status: 400 });
    }

    const newOffer = {
      id: `offer-${Date.now()}`,
      title,
      description,
      category,
      status: "available",
      location,
      quantity: quantity ?? null,
      contact,
      organization: organization ?? null,
      verification_level: "unverified",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    inMemoryOffers.unshift(newOffer);

    return NextResponse.json({ data: newOffer }, { status: 201 });
  } catch (err) {
    console.error("[offers/POST]", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
