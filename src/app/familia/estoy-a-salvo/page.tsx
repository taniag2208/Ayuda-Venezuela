import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Lock, Heart } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SurvivorForm } from "@/components/family/survivor-form";

export const metadata: Metadata = {
  title: "Estoy a salvo — Reunificación Familiar",
  description:
    "Informa a tu familia que estás bien. Controla qué información compartes y cuándo.",
};

export default function EstoyASalvoPage() {
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
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <Heart className="h-5 w-5 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Estoy a salvo
              </h1>
            </div>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl">
              Si estás en un lugar seguro y tu familia puede estar buscándote, registra tu reporte
              aquí. El sistema buscará automáticamente si alguien te está buscando.
            </p>

            <div className="mt-6 flex items-start gap-3 rounded-xl bg-amber-50 dark:bg-amber-950 border border-amber-100 dark:border-amber-900 p-4 max-w-xl">
              <Lock className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-800 dark:text-amber-200">
                <strong>Tu privacidad es tuya:</strong> Tú decides exactamente qué información
                compartes. Ningún dato de contacto aparece públicamente. Solo se comparte si
                encuentran una coincidencia <em>y</em> tú lo autorizas.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
          <SurvivorForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
