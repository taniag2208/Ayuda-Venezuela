import type { Metadata } from "next";
import { MapPin, Info } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { DisasterMap } from "@/components/map/disaster-map";
import { Card, CardContent } from "@/components/ui/card";
import type { Center } from "@/types";

export const metadata: Metadata = { title: "Mapa de Emergencia" };

// Sample seed data for centers when DB is not connected
const SAMPLE_CENTERS: Center[] = [
  {
    id: "1",
    name: "Albergue Poliedro de Caracas",
    type: "shelter",
    address: "Poliedro de Caracas, El Valle, Caracas",
    coordinates: { lat: 10.4534, lng: -66.9225 },
    capacity: 2000,
    current_occupancy: 850,
    contact: "0212-555-0001",
    services: ["Alojamiento", "Alimentación", "Asistencia médica"],
    schedule: "24 horas",
    verification_level: "official",
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Centro de Distribución Cruz Roja — La Candelaria",
    type: "distribution",
    address: "Av. Lecuna, La Candelaria, Caracas",
    coordinates: { lat: 10.499, lng: -66.9167 },
    capacity: undefined,
    current_occupancy: undefined,
    contact: "0212-706-5555",
    services: ["Agua", "Alimentos", "Medicamentos", "Ropa"],
    schedule: "L-V 8am-5pm, S 8am-2pm",
    verification_level: "official",
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Puesto Médico de Avanzada — Petare",
    type: "medical",
    address: "Sector José Félix Ribas, Petare, Miranda",
    coordinates: { lat: 10.4775, lng: -66.8125 },
    capacity: undefined,
    current_occupancy: undefined,
    contact: "0212-555-0003",
    services: ["Atención médica de emergencia", "Primeros auxilios", "Medicamentos"],
    schedule: "24 horas",
    verification_level: "high",
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Centro de Coordinación de Voluntarios — Chacao",
    type: "coordination",
    address: "Alcaldía de Chacao, Caracas",
    coordinates: { lat: 10.4946, lng: -66.8503 },
    capacity: undefined,
    current_occupancy: undefined,
    contact: "0212-555-0004",
    services: ["Registro de voluntarios", "Coordinación de tareas", "Información"],
    schedule: "L-D 7am-8pm",
    verification_level: "official",
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

const typeColors: Record<Center["type"], string> = {
  shelter: "🏠 Albergue",
  medical: "🏥 Médico",
  food: "🥫 Alimentos",
  distribution: "📦 Distribución",
  coordination: "🤝 Coordinación",
};

export default function MapaPage() {
  return (
    <>
      <Header />
      <main className="flex-1 mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 dark:bg-teal-950">
            <MapPin className="h-5 w-5 text-teal-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mapa de Emergencia</h1>
            <p className="text-sm text-gray-500">Centros de ayuda y solicitudes activas</p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mb-4">
          {Object.entries(typeColors).map(([type, label]) => (
            <div
              key={type}
              className="flex items-center gap-1.5 rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-xs font-medium"
            >
              {label}
            </div>
          ))}
          <div className="flex items-center gap-1.5 rounded-full bg-red-100 dark:bg-red-950 px-3 py-1 text-xs font-medium text-red-700 dark:text-red-300">
            🆘 Solicitud urgente
          </div>
        </div>

        {/* Map */}
        <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 mb-6">
          <DisasterMap centers={SAMPLE_CENTERS} height="500px" zoom={10} center={[10.48, -66.9]} />
        </div>

        {/* Centers list */}
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Centros activos ({SAMPLE_CENTERS.length})
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SAMPLE_CENTERS.map((center) => (
            <Card key={center.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                    {center.name}
                  </h3>
                  <span className="text-xs bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full whitespace-nowrap">
                    {typeColors[center.type]}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-2">{center.address}</p>
                {center.schedule && (
                  <p className="text-xs text-gray-500 mb-2">🕐 {center.schedule}</p>
                )}
                {center.capacity && center.current_occupancy !== undefined && (
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Ocupación</span>
                      <span>
                        {center.current_occupancy}/{center.capacity}
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{
                          width: `${Math.min(100, (center.current_occupancy / center.capacity) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
                <div className="flex flex-wrap gap-1 mb-2">
                  {(center.services as string[]).slice(0, 3).map((s) => (
                    <span
                      key={s}
                      className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-1.5 py-0.5 rounded"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                {center.contact && (
                  <a
                    href={`tel:${center.contact}`}
                    className="text-xs font-semibold text-red-600 hover:text-red-700"
                  >
                    📞 {center.contact}
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 rounded-xl bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-4 flex items-start gap-3">
          <Info className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
          <p className="text-sm text-blue-800 dark:text-blue-200">
            La información de los centros es actualizada por coordinadores verificados.
            Para agregar o actualizar un centro, contacta al equipo de administración.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
