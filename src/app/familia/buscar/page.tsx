import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Info } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PersonSearch } from "@/components/family/person-search";

export const metadata: Metadata = {
  title: "Buscar personas — Reunificación Familiar",
  description:
    "Busca entre todos los reportes activos de personas desaparecidas y sobrevivientes.",
};

export default function BuscarPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Page header */}
        <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
            <Link
              href="/familia"
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a Reunificación Familiar
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Buscar personas
            </h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl">
              Busca entre todos los reportes activos. El sistema usa búsqueda difusa (fuzzy search)
              para encontrar coincidencias aunque el nombre esté escrito con errores.
            </p>

            <div className="mt-4 flex items-start gap-3 rounded-xl bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-900 p-3 max-w-xl">
              <Info className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
              <p className="text-xs text-blue-800 dark:text-blue-200">
                La información de contacto de los sobrevivientes solo aparece si ellos mismos
                autorizaron compartirla. Los datos sensibles siempre están protegidos.
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
          <PersonSearch />
        </div>
      </main>
      <Footer />
    </>
  );
}
