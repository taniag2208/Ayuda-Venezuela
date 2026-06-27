import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, Heart, ArrowRight, LayoutDashboard } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { RequestCard } from "@/components/requests/request-card";
import { OfferCard } from "@/components/offers/offer-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Stats, Request, Offer } from "@/types";

export const metadata: Metadata = { title: "Dashboard" };

// This page renders server-side. Data is fetched from our API routes.
// In production, these would call Supabase directly from the server component.
async function getStats(): Promise<Stats> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/stats`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return {
      total_requests: 0,
      fulfilled_requests: 0,
      total_offers: 0,
      active_volunteers: 0,
      active_centers: 0,
      people_helped: 0,
      matches_made: 0,
    };
  }
}

async function getRecentRequests(): Promise<Request[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/requests?limit=6`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) throw new Error();
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

async function getRecentOffers(): Promise<Offer[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/offers?limit=6`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) throw new Error();
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

export default async function DashboardPage() {
  const [stats, requests, offers] = await Promise.all([
    getStats(),
    getRecentRequests(),
    getRecentOffers(),
  ]);

  return (
    <>
      <Header />
      <main className="flex-1 mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 dark:bg-red-950">
              <LayoutDashboard className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Dashboard de Emergencia
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Actualizado en tiempo real
              </p>
            </div>
          </div>
          <Button asChild>
            <Link href="/solicitudes/nueva">
              <AlertTriangle className="h-4 w-4" />
              Nueva Solicitud
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <StatsGrid stats={stats} />

        {/* Recent activity */}
        <Tabs defaultValue="requests">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="requests">
                <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
                Solicitudes Recientes
              </TabsTrigger>
              <TabsTrigger value="offers">
                <Heart className="h-3.5 w-3.5 mr-1.5" />
                Ofertas Disponibles
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="requests">
            {requests.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {requests.map((r) => (
                    <RequestCard key={r.id} request={r} />
                  ))}
                </div>
                <div className="text-center mt-6">
                  <Button variant="outline" asChild>
                    <Link href="/solicitudes">
                      Ver todas las solicitudes
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </>
            ) : (
              <EmptyState
                icon="🎉"
                title="No hay solicitudes pendientes"
                description="Todas las necesidades han sido atendidas o aún no se han registrado."
                cta={{ href: "/solicitudes/nueva", label: "Registrar necesidad" }}
              />
            )}
          </TabsContent>

          <TabsContent value="offers">
            {offers.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {offers.map((o) => (
                    <OfferCard key={o.id} offer={o} />
                  ))}
                </div>
                <div className="text-center mt-6">
                  <Button variant="outline" asChild>
                    <Link href="/ofertas">
                      Ver todas las ofertas
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </>
            ) : (
              <EmptyState
                icon="❤️"
                title="Sé el primero en ofrecer ayuda"
                description="Aún no hay ofertas de ayuda registradas. Si puedes colaborar, regístralo aquí."
                cta={{ href: "/ofertas/nueva", label: "Ofrecer ayuda" }}
              />
            )}
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </>
  );
}

function EmptyState({
  icon,
  title,
  description,
  cta,
}: {
  icon: string;
  title: string;
  description: string;
  cta: { href: string; label: string };
}) {
  return (
    <div className="rounded-xl border border-dashed border-gray-200 dark:border-gray-800 p-12 text-center">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{description}</p>
      <Button asChild size="sm">
        <Link href={cta.href}>{cta.label}</Link>
      </Button>
    </div>
  );
}
