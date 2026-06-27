"use client";

import { useEffect, useState } from "react";
import type { Center, Request } from "@/types";
import { categoryIcons } from "@/lib/utils";

interface DisasterMapProps {
  centers?: Center[];
  requests?: Request[];
  center?: [number, number];
  zoom?: number;
  height?: string;
}

// Venezuela geographic center
const VENEZUELA_CENTER: [number, number] = [8.0, -66.0];

export function DisasterMap({
  centers = [],
  requests = [],
  center = VENEZUELA_CENTER,
  zoom = 6,
  height = "400px",
}: DisasterMapProps) {
  const [MapComponents, setMapComponents] = useState<{
    MapContainer: React.ComponentType<unknown>;
    TileLayer: React.ComponentType<unknown>;
    Marker: React.ComponentType<unknown>;
    Popup: React.ComponentType<unknown>;
    useMap: () => unknown;
  } | null>(null);
  const [L, setL] = useState<typeof import("leaflet") | null>(null);

  useEffect(() => {
    // Load leaflet only on client to avoid SSR issues
    Promise.all([
      import("react-leaflet"),
      import("leaflet"),
      import("leaflet/dist/leaflet.css" as string),
    ]).then(([rl, leaflet]) => {
      // Fix default markers
      const DefaultIcon = leaflet.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });
      leaflet.Marker.prototype.options.icon = DefaultIcon;

      setL(leaflet);
      setMapComponents({
        MapContainer: rl.MapContainer as React.ComponentType<unknown>,
        TileLayer: rl.TileLayer as React.ComponentType<unknown>,
        Marker: rl.Marker as React.ComponentType<unknown>,
        Popup: rl.Popup as React.ComponentType<unknown>,
        useMap: rl.useMap,
      });
    }).catch(() => {
      // Silently fail — map is progressive enhancement
    });
  }, []);

  function createColoredIcon(color: string, emoji: string) {
    if (!L) return undefined;
    return L.divIcon({
      html: `<div style="background:${color};border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-size:16px;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3)">${emoji}</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      className: "",
    });
  }

  if (!MapComponents) {
    return (
      <div
        className="flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 text-sm"
        style={{ height }}
      >
        <div className="text-center">
          <div className="text-2xl mb-2">🗺️</div>
          <div>Cargando mapa...</div>
        </div>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup } = MapComponents;

  // We use any here because react-leaflet types are complex
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const MC = MapContainer as any;
  const TL = TileLayer as any;
  const M = Marker as any;
  const P = Popup as any;

  return (
    <div style={{ height }} className="rounded-xl overflow-hidden">
      <MC center={center} zoom={zoom} style={{ height: "100%", width: "100%" }}>
        <TL
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {centers
          .filter((c) => c.is_active && c.coordinates)
          .map((c) => (
            <M
              key={c.id}
              position={[c.coordinates.lat, c.coordinates.lng]}
              icon={createColoredIcon("#7C3AED", "🏥")}
            >
              <P>
                <div className="text-sm font-semibold">{c.name}</div>
                <div className="text-xs text-gray-500">{c.address}</div>
                {c.services.length > 0 && (
                  <div className="text-xs mt-1">{(c.services as string[]).join(", ")}</div>
                )}
                {c.contact && (
                  <a
                    href={`tel:${c.contact}`}
                    className="text-xs text-red-600 font-semibold block mt-1"
                  >
                    📞 {c.contact}
                  </a>
                )}
              </P>
            </M>
          ))}

        {requests
          .filter((r) => r.coordinates && r.status === "pending")
          .map((r) => (
            <M
              key={r.id}
              position={[r.coordinates!.lat, r.coordinates!.lng]}
              icon={createColoredIcon(
                r.urgency >= 4 ? "#DC2626" : r.urgency === 3 ? "#F59E0B" : "#6B7280",
                categoryIcons[r.category]
              )}
            >
              <P>
                <div className="text-sm font-semibold">{r.title}</div>
                <div className="text-xs text-gray-500">{r.location}</div>
                <div className="text-xs mt-1">👥 {r.people_count} personas</div>
                <div className="text-xs text-red-600 font-medium">📞 {r.contact}</div>
              </P>
            </M>
          ))}
      </MC>
    </div>
  );
}
