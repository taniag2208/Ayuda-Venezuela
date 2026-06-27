import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, AlertTriangle, Heart, Users, CheckCircle } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FamilyStatsGrid } from "@/components/family/family-stats-grid";
import { familyStore } from "@/lib/family-store";
import { formatRelativeTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Panel de Coordinación — Reunificación Familiar",
};

const STATUS_LABELS: Record<string, string> = {
  searching: "En búsqueda",
  possible_match: "Posible coincidencia",
  verified: "Verificado",
  reunited: "Reunificado",
  closed: "Cerrado",
  archived: "Archivado",
};

const STATUS_VARIANTS: Record<string, "default" | "info" | "success" | "outline" | "warning"> = {
  searching: "info",
  possible_match: "warning",
  verified: "success",
  reunited: "success",
  closed: "outline",
  archived: "outline",
};

const SEX_LABELS: Record<string, string> = {
  male: "M",
  female: "F",
  other: "O",
  unknown: "—",
};

const HEALTH_LABELS: Record<string, string> = {
  good: "A salvo",
  injured: "Lesionado/a",
  critical: "Crítico",
  unknown: "—",
};

export default function FamiliaDashboardPage() {
  const missing = familyStore.getAllMissing().slice(0, 10);
  const survivors = familyStore.getAllSurvivors().slice(0, 10);
  const matches = familyStore.getAllMatches();

  return (
    <>
      <Header />
      <main className="flex-1 bg-gray-50 dark:bg-gray-950">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
            <Link
              href="/familia"
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Reunificación Familiar
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Panel de Coordinación
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Vista general de todos los reportes activos y coincidencias detectadas
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-8">
          {/* Stats */}
          <FamilyStatsGrid />

          {/* Matches — highest priority */}
          {matches.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  Coincidencias detectadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {matches.map((match) => {
                    const mp = familyStore.getMissingById(match.missing_report_id);
                    const sv = familyStore.getSurvivorById(match.survivor_report_id);
                    return (
                      <div
                        key={match.id}
                        className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 dark:border-gray-700 p-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="text-center w-14 shrink-0">
                            <div className={`text-lg font-bold ${match.score >= 80 ? "text-green-600" : "text-amber-600"}`}>
                              {Math.round(match.score)}%
                            </div>
                            <div className="text-xs text-gray-400">coincidencia</div>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {mp?.full_name ?? "—"} → {sv?.full_name ?? "—"}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {match.match_reasons[0]}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs text-gray-500">
                            {match.missing_side_consent ? "✅" : "⏳"} Familiar
                          </span>
                          <span className="text-xs text-gray-500">
                            {match.survivor_side_consent ? "✅" : "⏳"} Sobreviviente
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Missing persons table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Personas desaparecidas ({missing.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left font-medium text-gray-500 px-6 py-3">Nombre</th>
                      <th className="text-left font-medium text-gray-500 px-6 py-3">Edad</th>
                      <th className="text-left font-medium text-gray-500 px-6 py-3">Sexo</th>
                      <th className="text-left font-medium text-gray-500 px-6 py-3">Ciudad</th>
                      <th className="text-left font-medium text-gray-500 px-6 py-3">Estado</th>
                      <th className="text-left font-medium text-gray-500 px-6 py-3">Reportado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {missing.map((r, i) => (
                      <tr
                        key={r.id}
                        className={`border-b border-gray-100 dark:border-gray-800 ${i % 2 === 0 ? "" : "bg-gray-50/50 dark:bg-gray-900/30"}`}
                      >
                        <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">
                          {r.full_name}
                          {r.alias && <span className="text-xs text-gray-400 ml-1">({r.alias})</span>}
                        </td>
                        <td className="px-6 py-3 text-gray-600 dark:text-gray-400">~{r.age_approx}</td>
                        <td className="px-6 py-3 text-gray-600 dark:text-gray-400">{SEX_LABELS[r.sex]}</td>
                        <td className="px-6 py-3 text-gray-600 dark:text-gray-400">{r.city}</td>
                        <td className="px-6 py-3">
                          <Badge variant={STATUS_VARIANTS[r.status] || "secondary"}>
                            {STATUS_LABELS[r.status] || r.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-3 text-gray-400 text-xs">{formatRelativeTime(r.created_at)}</td>
                      </tr>
                    ))}
                    {missing.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                          No hay reportes activos
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Survivors table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-green-600" />
                Personas reportadas a salvo ({survivors.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left font-medium text-gray-500 px-6 py-3">Nombre</th>
                      <th className="text-left font-medium text-gray-500 px-6 py-3">Salud</th>
                      <th className="text-left font-medium text-gray-500 px-6 py-3">Ubicación</th>
                      <th className="text-left font-medium text-gray-500 px-6 py-3">Necesita ayuda</th>
                      <th className="text-left font-medium text-gray-500 px-6 py-3">Estado</th>
                      <th className="text-left font-medium text-gray-500 px-6 py-3">Reportado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {survivors.map((r, i) => (
                      <tr
                        key={r.id}
                        className={`border-b border-gray-100 dark:border-gray-800 ${i % 2 === 0 ? "" : "bg-gray-50/50 dark:bg-gray-900/30"}`}
                      >
                        <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">{r.full_name}</td>
                        <td className="px-6 py-3 text-gray-600 dark:text-gray-400">{HEALTH_LABELS[r.health_status]}</td>
                        <td className="px-6 py-3 text-gray-600 dark:text-gray-400 truncate max-w-[160px]">
                          {r.location_name || r.current_location}
                        </td>
                        <td className="px-6 py-3">
                          {r.needs_help ? (
                            <span className="text-xs text-red-600 font-medium">Sí</span>
                          ) : (
                            <span className="text-xs text-green-600">No</span>
                          )}
                        </td>
                        <td className="px-6 py-3">
                          <Badge variant={STATUS_VARIANTS[r.status] || "secondary"}>
                            {STATUS_LABELS[r.status] || r.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-3 text-gray-400 text-xs">{formatRelativeTime(r.created_at)}</td>
                      </tr>
                    ))}
                    {survivors.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                          No hay reportes activos
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pb-4">
            <Link
              href="/familia/reportar-desaparecido"
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
            >
              <AlertTriangle className="h-4 w-4" />
              Nuevo reporte desaparecido
            </Link>
            <Link
              href="/familia/estoy-a-salvo"
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
            >
              <CheckCircle className="h-4 w-4" />
              Nuevo reporte a salvo
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
