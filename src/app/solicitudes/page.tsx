"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Filter, Plus, Search } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { RequestCard } from "@/components/requests/request-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categoryLabels } from "@/lib/utils";
import type { Request, NeedCategory } from "@/types";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pendientes" },
  { value: "in_progress", label: "En proceso" },
  { value: "fulfilled", label: "Atendidas" },
];

export default function SolicitudesPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [status, setStatus] = useState<string>("pending");
  const [urgency, setUrgency] = useState<string>("all");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const params = new URLSearchParams({ limit: "50", status });
        if (category !== "all") params.set("category", category);
        if (urgency !== "all") params.set("urgency", urgency);
        const res = await fetch(`/api/requests?${params}`);
        const json = await res.json();
        setRequests(json.data ?? []);
      } catch {
        setRequests([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [category, status, urgency]);

  const filtered = requests.filter(
    (r) =>
      !search ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.location.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Header />
      <main className="flex-1 mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 dark:bg-red-950">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Solicitudes de Ayuda</h1>
              <p className="text-sm text-gray-500">{filtered.length} solicitudes</p>
            </div>
          </div>
          <Button asChild>
            <Link href="/solicitudes/nueva">
              <Plus className="h-4 w-4" />
              Nueva Solicitud
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por título, ubicación..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
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
          <Select value={urgency} onValueChange={setUrgency}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Urgencia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="5">Crítica</SelectItem>
              <SelectItem value="4">Urgente</SelectItem>
              <SelectItem value="3">Alta</SelectItem>
              <SelectItem value="2">Normal</SelectItem>
              <SelectItem value="1">Baja</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-48 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((r) => (
              <RequestCard key={r.id} request={r} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-200 dark:border-gray-800 p-12 text-center">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              No se encontraron solicitudes
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Intenta con otros filtros o registra una nueva solicitud
            </p>
            <Button asChild size="sm">
              <Link href="/solicitudes/nueva">Nueva solicitud</Link>
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
