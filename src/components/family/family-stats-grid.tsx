"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Heart, Users, CheckCircle, Award, Search } from "lucide-react";
import type { FamilyStats } from "@/types";

const STAT_CONFIG = [
  {
    key: "total_missing" as keyof FamilyStats,
    label: "Personas buscadas",
    icon: AlertTriangle,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-950",
  },
  {
    key: "total_survivors" as keyof FamilyStats,
    label: "Reportes a salvo",
    icon: Heart,
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-950",
  },
  {
    key: "total_matches" as keyof FamilyStats,
    label: "Coincidencias IA",
    icon: Users,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950",
  },
  {
    key: "verified_matches" as keyof FamilyStats,
    label: "Coincidencias verificadas",
    icon: CheckCircle,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-950",
  },
  {
    key: "reunited_count" as keyof FamilyStats,
    label: "Familias reunidas",
    icon: Award,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950",
  },
  {
    key: "active_searches" as keyof FamilyStats,
    label: "Búsquedas activas",
    icon: Search,
    color: "text-gray-600 dark:text-gray-400",
    bg: "bg-gray-50 dark:bg-gray-800",
  },
];

export function FamilyStatsGrid() {
  const [stats, setStats] = useState<FamilyStats | null>(null);

  useEffect(() => {
    fetch("/api/family/stats")
      .then((r) => r.json())
      .then((d) => setStats(d.data))
      .catch(() => {});
  }, []);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {STAT_CONFIG.map(({ key, label, icon: Icon, color, bg }) => (
        <div
          key={key}
          className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 text-center"
        >
          <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${bg} mb-3`}>
            <Icon className={`h-5 w-5 ${color}`} />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats ? stats[key].toLocaleString("es-VE") : "—"}
          </div>
          <div className="text-xs text-gray-500 mt-0.5 leading-tight">{label}</div>
        </div>
      ))}
    </div>
  );
}
