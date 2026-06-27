import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { OfferForm } from "@/components/offers/offer-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const metadata: Metadata = { title: "Ofrecer Ayuda" };

export default function NuevaOfertaPage() {
  return (
    <>
      <Header />
      <main className="flex-1 mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/ofertas">
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Link>
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Ofrecer Ayuda</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Registra lo que puedes aportar. Las personas que lo necesiten podrán contactarte directamente.
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Nueva Oferta de Ayuda</CardTitle>
            <CardDescription>
              Mientras más detallada sea la información, más rápido llegarás a quien lo necesita.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OfferForm />
          </CardContent>
        </Card>
      </main>
      <Footer />
    </>
  );
}
