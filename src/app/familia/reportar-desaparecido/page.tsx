import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Lock, Users } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MissingPersonForm } from "@/components/family/missing-person-form";

export const metadata: Metadata = {
  title: "Reportar persona desaparecida",
  description:
    "Registra los datos de un familiar desaparecido. El sistema buscará automáticamente coincidencias.",
};

export default function ReportarDesaparecidoPage() {
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
              Reportar persona desaparecida
            </h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl">
              Completa el formulario con la mayor cantidad de información posible. Cuantos más datos
              proporciones, más precisa será la búsqueda automática por IA.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-xl bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-900 p-3">
                <Users className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                <p className="text-xs text-blue-800 dark:text-blue-200">
                  <strong>Búsqueda automática:</strong> El sistema comparará este reporte con todos
                  los sobrevivientes registrados y te notificará si hay coincidencias.
                </p>
              </div>
              <div className="flex items-start gap-3 rounded-xl bg-green-50 dark:bg-green-950 border border-green-100 dark:border-green-900 p-3">
                <Lock className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                <p className="text-xs text-green-800 dark:text-green-200">
                  <strong>Datos protegidos:</strong> La información médica y tu contacto solo se
                  revelan cuando ambas partes aceptan explícitamente el intercambio.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
          <MissingPersonForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
