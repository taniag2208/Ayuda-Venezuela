"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Filter, Plus, Search } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { OfferCard } from "@/components/offers/offer-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categoryLabels } from "@/lib/utils";
import type { Offer } from "@/types";

export default function OfertasPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const params = new URLSearchParams({ limit: "50", status: "available" });
        if (category !== "all") params.set("category", category);
        const res = await fetch(`/api/offers?${params}`);
        const json = await res.json();
        setOffers(json.data ?? []);
      } catch {
        setOffers([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [category]);

  const filtered = offers.filter(
    (o) =>
      !search ||
      o.title.toLowerCase().includes(search.toLowerCase()) ||
      o.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Header />
      <main className="flex-1 mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 dark:bg-green-950">
              <Heart className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Ofertas de Ayuda</h1>
              <p className="text-sm text-gray-500">{filtered.length} ofertas disponibles</p>
            </div>
          </div>
          <Button asChild variant="success">
            <Link href="/ofertas/nueva">
              <Plus className="h-4 w-4" />
              Ofrecer Ayuda
            </Link>
          </Button>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar ofertas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[160px]">
              <Filter className="h-3.5 w-3.5 mr-1.5" />
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {Object.entries(categoryLabels).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((o) => (
              <OfferCard key={o.id} offer={o} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-200 dark:border-gray-800 p-12 text-center">
            <div className="text-4xl mb-3">❤️</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              Sé el primero en ofrecer ayuda
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Si tienes algo que puedas aportar, regístralo aquí.
            </p>
            <Button asChild variant="success" size="sm">
              <Link href="/ofertas/nueva">Ofrecer ayuda</Link>
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
