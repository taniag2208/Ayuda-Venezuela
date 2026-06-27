"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Menu,
  X,
  AlertTriangle,
  MapPin,
  Heart,
  Users,
  MessageCircle,
  LayoutDashboard,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import disasterConfig from "@/lib/disaster-config";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/mapa", label: "Mapa", icon: MapPin },
  { href: "/solicitudes", label: "Necesito Ayuda", icon: AlertTriangle },
  { href: "/ofertas", label: "Quiero Ayudar", icon: Heart },
  { href: "/voluntarios", label: "Voluntarios", icon: Users },
  { href: "/centros", label: "Centros", icon: MapPin },
  { href: "/chat", label: "Asistente IA", icon: MessageCircle },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-gray-800 dark:bg-gray-950/95">
      {/* Emergency banner */}
      <div className="bg-red-600 px-4 py-1.5 text-center text-xs font-medium text-white">
        🆘 Emergencia activa en {disasterConfig.country} — Llama al{" "}
        <a href="tel:171" className="font-bold underline">
          171
        </a>{" "}
        si estás en peligro inmediato
      </div>

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-bold">
          <span className="text-2xl">{disasterConfig.flag}</span>
          <div className="leading-tight">
            <div className="text-base font-bold text-gray-900 dark:text-white">
              {disasterConfig.name}
            </div>
            <div className="text-[10px] text-gray-500 font-normal">Plataforma humanitaria</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </Link>
          ))}
        </nav>

        {/* CTA + Mobile toggle */}
        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="hidden sm:flex">
            <Link href="/solicitudes/nueva">
              <AlertTriangle className="h-3.5 w-3.5" />
              Pedir Ayuda
            </Link>
          </Button>

          <a
            href="tel:171"
            className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 dark:bg-red-950 dark:text-red-400"
          >
            <Phone className="h-3.5 w-3.5" />
            171
          </a>

          <button
            className="flex lg:hidden items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menú"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
          <nav className="flex flex-col p-4 gap-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
            <div className="pt-2 mt-2 border-t border-gray-100 dark:border-gray-800">
              <Button asChild className="w-full">
                <Link href="/solicitudes/nueva" onClick={() => setMobileOpen(false)}>
                  <AlertTriangle className="h-4 w-4" />
                  Pedir Ayuda Ahora
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
