import type { Metadata } from "next";
import {
  LayoutDashboard,
  AlertTriangle,
  Heart,
  Users,
  Building2,
  BarChart3,
  Shield,
  Lock,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = { title: "Panel Administrativo" };

const adminSections = [
  {
    title: "Solicitudes",
    description: "Gestionar, verificar y actualizar estado de solicitudes",
    icon: AlertTriangle,
    href: "/solicitudes",
    color: "bg-red-100 dark:bg-red-950",
    iconColor: "text-red-600",
    stats: "47 activas",
  },
  {
    title: "Ofertas",
    description: "Revisar y aprobar ofertas de ayuda registradas",
    icon: Heart,
    href: "/ofertas",
    color: "bg-green-100 dark:bg-green-950",
    iconColor: "text-green-600",
    stats: "28 disponibles",
  },
  {
    title: "Voluntarios",
    description: "Gestionar y asignar tareas a voluntarios",
    icon: Users,
    href: "/voluntarios",
    color: "bg-blue-100 dark:bg-blue-950",
    iconColor: "text-blue-600",
    stats: "243 registrados",
  },
  {
    title: "Centros",
    description: "Administrar centros de ayuda y capacidades",
    icon: Building2,
    href: "/centros",
    color: "bg-purple-100 dark:bg-purple-950",
    iconColor: "text-purple-600",
    stats: "6 activos",
  },
  {
    title: "Analytics",
    description: "Métricas, tendencias y reportes de la emergencia",
    icon: BarChart3,
    href: "/dashboard",
    color: "bg-amber-100 dark:bg-amber-950",
    iconColor: "text-amber-600",
    stats: "En tiempo real",
  },
  {
    title: "Verificación",
    description: "Revisar reportes marcados para verificación manual",
    icon: Shield,
    href: "#",
    color: "bg-teal-100 dark:bg-teal-950",
    iconColor: "text-teal-600",
    stats: "3 pendientes",
  },
];

export default function AdminPage() {
  return (
    <>
      <Header />
      <main className="flex-1 mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 dark:bg-gray-100">
            <LayoutDashboard className="h-5 w-5 text-white dark:text-gray-900" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Panel Administrativo
            </h1>
            <p className="text-sm text-gray-500">
              Control central de la plataforma humanitaria
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Badge variant="official">
              <Lock className="h-3 w-3 mr-1" />
              Acceso restringido
            </Badge>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Solicitudes hoy", value: "12", trend: "+3", up: false },
            { label: "Ofertas hoy", value: "8", trend: "+8", up: true },
            { label: "Nuevos voluntarios", value: "24", trend: "+24", up: true },
            { label: "Personas ayudadas", value: "1,847", trend: "+203", up: true },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">
                  {s.value}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
                <div
                  className={`text-xs font-medium mt-1 ${
                    s.up ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {s.trend} últimas 24h
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Admin sections */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {adminSections.map((section) => (
            <Card key={section.title} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className={`inline-flex rounded-xl p-3 mb-4 ${section.color}`}>
                  <section.icon className={`h-5 w-5 ${section.iconColor}`} />
                </div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{section.title}</h3>
                  <span className="text-xs text-gray-400">{section.stats}</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {section.description}
                </p>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href={section.href}>Gestionar</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* System status */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Estado del Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "API", status: "operational" },
                { label: "Base de datos", status: "operational" },
                { label: "Agentes IA", status: "operational" },
                { label: "Tiempo real", status: "operational" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{s.label}</span>
                  <Badge variant="success" className="text-[10px] ml-auto">
                    {s.status === "operational" ? "OK" : "Error"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </>
  );
}
