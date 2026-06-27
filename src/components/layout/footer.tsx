import Link from "next/link";
import { Phone, ExternalLink } from "lucide-react";
import disasterConfig from "@/lib/disaster-config";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white">
              <span className="text-xl">{disasterConfig.flag}</span>
              {disasterConfig.name}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Plataforma de coordinación humanitaria para el {disasterConfig.country}.
            </p>
            <div className="text-xs text-gray-400">
              Código abierto · Construido en emergencia
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Plataforma</h4>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              {[
                { href: "/solicitudes/nueva", label: "Reportar Necesidad" },
                { href: "/ofertas/nueva", label: "Ofrecer Ayuda" },
                { href: "/voluntarios", label: "Ser Voluntario" },
                { href: "/centros", label: "Centros de Ayuda" },
                { href: "/mapa", label: "Mapa de Emergencia" },
                { href: "/chat", label: "Asistente IA" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="hover:text-red-600 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Emergency numbers */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
              Números de Emergencia
            </h4>
            <ul className="space-y-2">
              {disasterConfig.emergencyNumbers.slice(0, 4).map((e) => (
                <li key={e.number} className="text-sm">
                  <div className="text-gray-400 text-xs">{e.label}</div>
                  <a
                    href={`tel:${e.number.replace(/\s/g, "")}`}
                    className="flex items-center gap-1.5 font-semibold text-red-600 hover:text-red-700"
                  >
                    <Phone className="h-3 w-3" />
                    {e.number}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Official sources */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
              Fuentes Oficiales
            </h4>
            <ul className="space-y-2 text-sm">
              {disasterConfig.officialSources.slice(0, 4).map((s) => (
                <li key={s.url}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-gray-500 hover:text-red-600 transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" />
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs text-gray-400">
          <p>
            © {new Date().getFullYear()} {disasterConfig.name}. Plataforma de código abierto.
          </p>
          <p>
            Esta plataforma NO reemplaza a los organismos oficiales de emergencia.
          </p>
        </div>
      </div>
    </footer>
  );
}
