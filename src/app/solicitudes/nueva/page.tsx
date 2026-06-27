import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { RequestForm } from "@/components/requests/request-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const metadata: Metadata = { title: "Solicitar Ayuda" };

export default function NuevaSolicitudPage() {
  return (
    <>
      <Header />
      <main className="flex-1 mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/solicitudes">
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Link>
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Solicitar Ayuda</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Completa el formulario para registrar tu necesidad. Un coordinador te contactará pronto.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Nueva Solicitud de Ayuda</CardTitle>
            <CardDescription>
              Todos los campos con información detallada aumentan la probabilidad de recibir ayuda rápidamente.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RequestForm />
          </CardContent>
        </Card>
      </main>
      <Footer />
    </>
  );
}
