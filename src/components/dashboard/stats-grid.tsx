"use client";

import { TrendingUp, Heart, Users, Building2, UserCheck, Handshake, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Stats } from "@/types";

interface StatsGridProps {
  stats: Stats;
}

export function StatsGrid({ stats }: StatsGridProps) {
  const fulfillmentRate = stats.total_requests > 0
    ? Math.round((stats.fulfilled_requests / stats.total_requests) * 100)
    : 0;

  const items = [
    {
      label: "Solicitudes Activas",
      value: stats.total_requests - stats.fulfilled_requests,
      total: stats.total_requests,
      icon: AlertCircle,
      color: "text-red-600",
      bg: "bg-red-50 dark:bg-red-950",
      description: `${fulfillmentRate}% atendidas`,
    },
    {
      label: "Ofertas Disponibles",
      value: stats.total_offers,
      icon: Heart,
      color: "text-green-600",
      bg: "bg-green-50 dark:bg-green-950",
      description: "Listas para entregar",
    },
    {
      label: "Voluntarios Activos",
      value: stats.active_volunteers,
      icon: UserCheck,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-950",
      description: "Registrados y disponibles",
    },
    {
      label: "Centros de Ayuda",
      value: stats.active_centers,
      icon: Building2,
      color: "text-purple-600",
      bg: "bg-purple-50 dark:bg-purple-950",
      description: "Operativos",
    },
    {
      label: "Personas Ayudadas",
      value: stats.people_helped,
      icon: Users,
      color: "text-amber-600",
      bg: "bg-amber-50 dark:bg-amber-950",
      description: "Desde el inicio",
    },
    {
      label: "Conexiones Realizadas",
      value: stats.matches_made,
      icon: Handshake,
      color: "text-teal-600",
      bg: "bg-teal-50 dark:bg-teal-950",
      description: "Necesidades conectadas con ayuda",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {items.map((item) => (
        <Card key={item.label} className="overflow-hidden">
          <CardContent className="p-4">
            <div className={cn("mb-3 inline-flex rounded-lg p-2", item.bg)}>
              <item.icon className={cn("h-5 w-5", item.color)} />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">
              {item.value.toLocaleString("es-VE")}
            </div>
            <div className="mt-0.5 text-xs font-medium text-gray-700 dark:text-gray-300">
              {item.label}
            </div>
            <div className="mt-1 text-xs text-gray-400">{item.description}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
