import Link from "next/link";
import type { Metadata } from "next";
import {
  AlertTriangle,
  Heart,
  Search,
  Users,
  Shield,
  Lock,
  ArrowRight,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FamilyStatsGrid } from "@/components/family/family-stats-grid";

export const metadata: Metadata = {
  title: "Reunificación Familiar",
  description:
    "Reporta un familiar desaparecido, informa que estás a salvo, o busca a tu familia tras el desastre.",
};

const flows = [
  {
    href: "/familia/reportar-desaparecido",
    icon: AlertTriangle,
    title: "Busco a un familiar",
    description:
      "Registra los datos de una persona desaparecida. El sistema buscará automáticamente coincidencias entre los reportes de sobrevivientes.",
    color: "bg-red-50 dark:bg-red-950",
    iconColor: "text-red-600 dark:text-red-400",
    border: "border-red-200 dark:border-red-800",
    ring: "ring-2 ring-red-500 ring-offset-2",
    cta: "Reportar desaparecido",
    ctaVariant: "default" as const,
    priority: true,
  },
  {
    href: "/familia/estoy-a-salvo",
    icon: Heart,
    title: "Estoy a salvo",
    description:
      "Informa a tu familia que estás bien. Elige cuánta información personal deseas compartir. Tú controlas tu privacidad.",
    color: "bg-green-50 dark:bg-green-950",
    iconColor: "text-green-600 dark:text-green-400",
    border: "border-green-200 dark:border-green-800",
    ring: "",
    cta: "Reportar que estoy bien",
    ctaVariant: "success" as const,
    priority: false,
  },
  {
    href: "/familia/buscar",
    icon: Search,
    title: "Buscar personas",
    description:
      "Busca entre todos los reportes activos usando el nombre, alias, ciudad o edad. La búsqueda usa IA para tolerar errores de escritura.",
    color: "bg-blue-50 dark:bg-blue-950",
    iconColor: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
    ring: "",
    cta: "Iniciar búsqueda",
    ctaVariant: "outline" as const,
    priority: false,
  },
];

const principles = [
  {
    icon: Lock,
    title: "Privacidad por diseño",
    description:
      "La información médica y de contacto jamás se expone públicamente. Solo se comparte tras consentimiento explícito de ambas partes.",
  },
  {
    icon: Users,
    title: "Coincidencias inteligentes",
    description:
      "El agente de IA compara automáticamente cada nuevo reporte contra todos los existentes y calcula un porcentaje de coincidencia.",
  },
  {
    icon: Shield,
    title: "Control total",
    description:
      "Tú decides qué información compartes y cuándo. Ningún dato de contacto se revela sin tu autorización expresa.",
  },
  {
    icon: Heart,
    title: "Confidencialidad doble",
    description:
      "Para desbloquear el contacto, ambas partes deben aceptar. Una sola autorización no es suficiente.",
  },
];

export default function FamiliaHubPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16 sm:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium mb-6 backdrop-blur-sm border border-white/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-400" />
              </span>
              Módulo activo — Reunificación Familiar
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Reunificación Familiar
            </h1>
            <p className="text-xl text-gray-300 mb-3 max-w-2xl mx-auto">
              Encontremos a tu familia después del desastre.
            </p>
            <p className="text-gray-400 max-w-xl mx-auto">
              Sistema de búsqueda con inteligencia artificial, protección total de datos personales
              y notificación automática cuando encontramos una posible coincidencia.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <FamilyStatsGrid />
          </div>
        </section>

        {/* Main flows */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">¿Qué necesitas hacer?</h2>
            <p className="text-gray-500 mt-1">Selecciona la opción que corresponde a tu situación</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {flows.map((flow) => (
              <Card
                key={flow.href}
                className={`border ${flow.border} hover:shadow-xl transition-all duration-200 group ${flow.ring}`}
              >
                <CardContent className="p-7">
                  <div className={`inline-flex rounded-2xl p-4 mb-5 ${flow.color}`}>
                    <flow.icon className={`h-7 w-7 ${flow.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {flow.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                    {flow.description}
                  </p>
                  <Button asChild variant={flow.ctaVariant} className="w-full">
                    <Link href={flow.href}>
                      {flow.cta}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Privacy principles */}
        <section className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Tu privacidad es nuestra prioridad
              </h2>
              <p className="text-gray-500 mt-1 max-w-xl mx-auto">
                Este módulo fue diseñado siguiendo los más altos estándares de protección de datos
                para contextos de emergencia humanitaria.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {principles.map((p) => (
                <div key={p.title} className="text-center">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gray-900 dark:bg-white mb-4">
                    <p.icon className="h-5 w-5 text-white dark:text-gray-900" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{p.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {p.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dashboard link */}
        <section className="py-8 border-t border-gray-200 dark:border-gray-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                ¿Eres coordinador/a humanitario?
              </p>
              <p className="text-xs text-gray-500">Accede al panel de administración y métricas del módulo</p>
            </div>
            <Button asChild variant="outline">
              <Link href="/familia/dashboard">
                <BarChart3 className="h-4 w-4" />
                Panel de coordinación
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
