import type { Metadata } from "next";
import { Building2, Phone, Clock, Users } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { Center } from "@/types";

export const metadata: Metadata = { title: "Centros de Ayuda" };

const CENTERS: Center[] = [
  {
    id: "1",
    name: "Albergue Poliedro de Caracas",
    type: "shelter",
    address: "Poliedro de Caracas, El Valle, Caracas",
    coordinates: { lat: 10.4534, lng: -66.9225 },
    capacity: 2000,
    current_occupancy: 850,
    contact: "0212-555-0001",
    services: ["Alojamiento", "Alimentación", "Atención médica", "Psicología"],
    schedule: "24 horas — todos los días",
    verification_level: "official",
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Centro de Distribución Cruz Roja",
    type: "distribution",
    address: "Av. Lecuna, La Candelaria, Caracas",
    coordinates: { lat: 10.499, lng: -66.9167 },
    contact: "0212-706-5555",
    services: ["Agua potable", "Alimentos", "Medicamentos", "Ropa", "Higiene personal"],
    schedule: "L-V 8am-5pm · S 8am-2pm",
    verification_level: "official",
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Puesto Médico Petare",
    type: "medical",
    address: "Sector José Félix Ribas, Petare, Miranda",
    coordinates: { lat: 10.4775, lng: -66.8125 },
    contact: "0212-555-0003",
    services: ["Emergencias", "Primeros auxilios", "Medicamentos", "Vacunación"],
    schedule: "24 horas",
    verification_level: "high",
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Punto de Acopio Maracay",
    type: "distribution",
    address: "Plaza Girardot, Maracay, Aragua",
    coordinates: { lat: 10.2469, lng: -67.5958 },
    contact: "0243-555-0001",
    services: ["Recepción de donaciones", "Distribución", "Alimentos no perecederos"],
    schedule: "L-D 7am-7pm",
    verification_level: "medium",
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Centro de Coordinación de Voluntarios Chacao",
    type: "coordination",
    address: "Alcaldía de Chacao, Francisco de Miranda, Caracas",
    coordinates: { lat: 10.4946, lng: -66.8503 },
    contact: "0212-267-0001",
    services: ["Registro voluntarios", "Asignación de tareas", "Información general"],
    schedule: "L-D 7am-8pm",
    verification_level: "official",
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "6",
    name: "Albergue Complejo Deportivo Valencia",
    type: "shelter",
    address: "Av. Bolívar Norte, Valencia, Carabobo",
    coordinates: { lat: 10.1667, lng: -68.0 },
    capacity: 1500,
    current_occupancy: 1100,
    contact: "0241-555-0002",
    services: ["Alojamiento", "Alimentación", "Ropa", "Información"],
    schedule: "24 horas",
    verification_level: "official",
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

const typeConfig: Record<Center["type"], { label: string; variant: "default" | "success" | "warning" | "danger" | "info" | "official" | "outline"; emoji: string }> = {
  shelter: { label: "Albergue", variant: "info", emoji: "🏠" },
  medical: { label: "Médico", variant: "danger", emoji: "🏥" },
  food: { label: "Alimentos", variant: "warning", emoji: "🥫" },
  distribution: { label: "Distribución", variant: "success", emoji: "📦" },
  coordination: { label: "Coordinación", variant: "official", emoji: "🤝" },
};

export default function CentrosPage() {
  return (
    <>
      <Header />
      <main className="flex-1 mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-950">
            <Building2 className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Centros de Ayuda</h1>
            <p className="text-sm text-gray-500">{CENTERS.filter((c) => c.is_active).length} centros activos</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CENTERS.map((center) => {
            const tc = typeConfig[center.type];
            const occupancyPct =
              center.capacity && center.current_occupancy !== undefined
                ? Math.round((center.current_occupancy / center.capacity) * 100)
                : null;

            return (
              <Card key={center.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="text-2xl">{tc.emoji}</div>
                    <Badge variant={tc.variant}>{tc.label}</Badge>
                  </div>

                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {center.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{center.address}</p>

                  {occupancyPct !== null && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="flex items-center gap-1 text-gray-500">
                          <Users className="h-3 w-3" />
                          Ocupación
                        </span>
                        <span
                          className={
                            occupancyPct > 80
                              ? "text-red-600 font-semibold"
                              : occupancyPct > 60
                              ? "text-amber-600"
                              : "text-green-600"
                          }
                        >
                          {center.current_occupancy}/{center.capacity} ({occupancyPct}%)
                        </span>
                      </div>
                      <Progress value={occupancyPct} className="h-1.5" />
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1 mb-3">
                    {(center.services as string[]).slice(0, 4).map((s) => (
                      <span
                        key={s}
                        className="text-[10px] rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-gray-600 dark:text-gray-400"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  {center.schedule && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                      <Clock className="h-3 w-3" />
                      {center.schedule}
                    </div>
                  )}

                  {center.contact && (
                    <a
                      href={`tel:${center.contact}`}
                      className="flex items-center gap-1.5 text-sm font-semibold text-red-600 hover:text-red-700"
                    >
                      <Phone className="h-4 w-4" />
                      {center.contact}
                    </a>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
      <Footer />
    </>
  );
}
