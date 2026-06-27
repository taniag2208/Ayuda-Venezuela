import Link from "next/link";
import {
  AlertTriangle,
  Heart,
  MapPin,
  Users,
  MessageCircle,
  ArrowRight,
  Phone,
  Shield,
  Zap,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import disasterConfig from "@/lib/disaster-config";

const actions = [
  {
    href: "/solicitudes/nueva",
    icon: AlertTriangle,
    title: "Necesito Ayuda",
    description: "Registra tu necesidad de agua, alimentos, refugio u otra ayuda urgente.",
    color: "bg-red-50 dark:bg-red-950",
    iconColor: "text-red-600 dark:text-red-400",
    borderColor: "border-red-200 dark:border-red-800",
    cta: "Reportar necesidad",
    ctaVariant: "default" as const,
    priority: true,
  },
  {
    href: "/ofertas/nueva",
    icon: Heart,
    title: "Quiero Ayudar",
    description: "Registra lo que puedes donar: agua, alimentos, ropa, transporte o servicios.",
    color: "bg-green-50 dark:bg-green-950",
    iconColor: "text-green-600 dark:text-green-400",
    borderColor: "border-green-200 dark:border-green-800",
    cta: "Ofrecer ayuda",
    ctaVariant: "success" as const,
  },
  {
    href: "/voluntarios",
    icon: Users,
    title: "Ser Voluntario",
    description: "Regístrate como voluntario con tus habilidades y disponibilidad.",
    color: "bg-blue-50 dark:bg-blue-950",
    iconColor: "text-blue-600 dark:text-blue-400",
    borderColor: "border-blue-200 dark:border-blue-800",
    cta: "Registrarme",
    ctaVariant: "outline" as const,
  },
  {
    href: "/centros",
    icon: MapPin,
    title: "Centros de Ayuda",
    description: "Encuentra el punto de distribución, albergue o centro médico más cercano.",
    color: "bg-purple-50 dark:bg-purple-950",
    iconColor: "text-purple-600 dark:text-purple-400",
    borderColor: "border-purple-200 dark:border-purple-800",
    cta: "Ver centros",
    ctaVariant: "outline" as const,
  },
  {
    href: "/chat",
    icon: MessageCircle,
    title: "Asistente IA",
    description: "Pregunta al asistente de inteligencia artificial sobre la emergencia.",
    color: "bg-amber-50 dark:bg-amber-950",
    iconColor: "text-amber-600 dark:text-amber-400",
    borderColor: "border-amber-200 dark:border-amber-800",
    cta: "Preguntar",
    ctaVariant: "outline" as const,
  },
  {
    href: "/mapa",
    icon: MapPin,
    title: "Mapa de Emergencia",
    description: "Visualiza en el mapa los centros de ayuda y solicitudes activas.",
    color: "bg-teal-50 dark:bg-teal-950",
    iconColor: "text-teal-600 dark:text-teal-400",
    borderColor: "border-teal-200 dark:border-teal-800",
    cta: "Ver mapa",
    ctaVariant: "outline" as const,
  },
  {
    href: "/familia",
    icon: Search,
    title: "Reunificación Familiar",
    description: "Busca a un familiar desaparecido o informa que estás a salvo. IA con protección total de datos.",
    color: "bg-indigo-50 dark:bg-indigo-950",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    borderColor: "border-indigo-200 dark:border-indigo-800",
    cta: "Buscar familiar",
    ctaVariant: "outline" as const,
  },
];

const features = [
  {
    icon: Zap,
    title: "Tiempo real",
    description: "Información actualizada al instante. Las solicitudes y ofertas aparecen en segundos.",
  },
  {
    icon: Shield,
    title: "Verificación por IA",
    description: "Cada reporte pasa por verificación automática para detectar desinformación.",
  },
  {
    icon: MessageCircle,
    title: "Asistente inteligente",
    description: "Un agente de IA responde preguntas solo con información verificada.",
  },
  {
    icon: Heart,
    title: "Matching automático",
    description: "El sistema conecta automáticamente necesidades con ofertas disponibles.",
  },
];

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-red-600 via-red-700 to-red-900 text-white">
          <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium mb-6 backdrop-blur-sm border border-white/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
              </span>
              Emergencia activa — {disasterConfig.country}
            </div>

            <div className="text-5xl sm:text-6xl mb-4">{disasterConfig.flag}</div>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-4">
              {disasterConfig.name}
            </h1>
            <p className="text-xl sm:text-2xl text-red-100 mb-2 max-w-2xl mx-auto">
              Plataforma de coordinación humanitaria
            </p>
            <p className="text-red-200 mb-10 max-w-xl mx-auto">
              Conectamos a quienes necesitan ayuda con quienes pueden darla. Simple, rápido y verificado.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="xl" className="bg-white text-red-700 hover:bg-red-50">
                <Link href="/solicitudes/nueva">
                  <AlertTriangle className="h-5 w-5" />
                  Necesito Ayuda
                </Link>
              </Button>
              <Button
                asChild
                size="xl"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                <Link href="/ofertas/nueva">
                  <Heart className="h-5 w-5" />
                  Quiero Ayudar
                </Link>
              </Button>
              <a
                href="tel:171"
                className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-3 text-sm font-semibold text-white hover:bg-white/20 border border-white/30 transition-colors"
              >
                <Phone className="h-4 w-4" />
                171 — Emergencias
              </a>
            </div>

            {/* Emergency numbers */}
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
              {disasterConfig.emergencyNumbers.slice(0, 4).map((e) => (
                <a
                  key={e.number}
                  href={`tel:${e.number.replace(/\s/g, "")}`}
                  className="rounded-lg bg-white/10 p-3 text-center hover:bg-white/20 transition-colors border border-white/20"
                >
                  <div className="text-xs text-red-200">{e.label}</div>
                  <div className="font-bold text-sm">{e.number}</div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Main action grid */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              ¿Cómo podemos ayudarte?
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Selecciona lo que necesitas hacer</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {actions.map((action) => (
              <Card
                key={action.href}
                className={`border ${action.borderColor} hover:shadow-lg transition-all duration-200 group ${action.priority ? "ring-2 ring-red-500 ring-offset-2" : ""}`}
              >
                <CardContent className="p-6">
                  <div className={`inline-flex rounded-xl p-3 mb-4 ${action.color}`}>
                    <action.icon className={`h-6 w-6 ${action.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {action.description}
                  </p>
                  <Button
                    asChild
                    variant={action.ctaVariant}
                    className="w-full"
                  >
                    <Link href={action.href}>
                      {action.cta}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="bg-gray-50 dark:bg-gray-900 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Por qué {disasterConfig.name}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Tecnología al servicio de la emergencia
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((f) => (
                <div key={f.title} className="text-center">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 dark:bg-red-950 mb-4">
                    <f.icon className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="border-t border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950 py-6">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
            <p className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-1">
              ⚠️ Aviso importante
            </p>
            <p className="text-sm text-amber-800 dark:text-amber-300">
              Esta plataforma <strong>NO reemplaza</strong> a los organismos oficiales de emergencia.
              Para rescates o situaciones de vida o muerte, llama al{" "}
              <a href="tel:171" className="font-bold underline">
                171
              </a>
              . Esta herramienta es una capa de coordinación complementaria.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
