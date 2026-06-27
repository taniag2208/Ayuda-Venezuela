"use client";

import { useState, useCallback, useRef } from "react";
import { Search, User, Heart, MapPin, Calendar, AlertTriangle, Loader2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn, formatRelativeTime } from "@/lib/utils";

interface SearchResult {
  score: number;
  record: {
    id: string;
    full_name: string;
    alias?: string;
    age_approx?: number;
    sex?: string;
    city?: string;
    state?: string;
    last_seen_at?: string;
    last_seen_place?: string;
    current_location?: string;
    location_type?: string;
    location_name?: string;
    health_status?: string;
    needs_help?: boolean;
    message_for_family?: string;
    status: string;
    created_at: string;
    photo_url?: string;
    email?: string;
    phone?: string;
    whatsapp?: string;
  };
}

const HEALTH_COLORS: Record<string, string> = {
  good: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  injured: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  critical: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  unknown: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

const HEALTH_LABELS: Record<string, string> = {
  good: "A salvo",
  injured: "Lesionado/a",
  critical: "Crítico",
  unknown: "Desconocido",
};

const STATUS_COLORS: Record<string, string> = {
  searching: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  possible_match: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  verified: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  reunited: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
};

export function PersonSearch() {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [age, setAge] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ missing: SearchResult[]; survivors: SearchResult[]; total: number } | null>(null);
  const [searched, setSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const doSearch = useCallback(async (q: string, c: string, a: string) => {
    if (!q && !c && !a) {
      setResults(null);
      setSearched(false);
      return;
    }
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (c) params.set("city", c);
      if (a) params.set("age", a);
      const res = await fetch(`/api/family/search?${params}`);
      const data = await res.json();
      setResults(data);
      setSearched(true);
    } catch {
      setResults(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    doSearch(query, city, age);
  };

  const handleQueryChange = (v: string) => {
    setQuery(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(v, city, age), 600);
  };

  return (
    <div className="space-y-6">
      {/* Search form */}
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Buscar por nombre, alias..."
            className="pl-10 h-12 text-base"
          />
        </div>

        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          <ChevronDown className={cn("h-4 w-4 transition-transform", showFilters && "rotate-180")} />
          {showFilters ? "Ocultar filtros" : "Más filtros"}
        </button>

        {showFilters && (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-gray-500">Ciudad</Label>
              <Input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ej: Caracas, Petare"
                className="h-9"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-gray-500">Edad aproximada</Label>
              <Input
                value={age}
                onChange={(e) => setAge(e.target.value)}
                type="number"
                placeholder="Ej: 35"
                className="h-9"
              />
            </div>
          </div>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          {loading ? "Buscando..." : "Buscar"}
        </Button>
      </form>

      {/* Results */}
      {loading && (
        <div className="flex items-center justify-center py-12 gap-3 text-gray-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          Buscando en todos los reportes...
        </div>
      )}

      {!loading && searched && results && (
        <div className="space-y-6">
          <p className="text-sm text-gray-500">
            {results.total === 0
              ? "No se encontraron resultados. Intenta con otro nombre o ciudad."
              : `${results.total} resultado${results.total !== 1 ? "s" : ""} encontrado${results.total !== 1 ? "s" : ""}`}
          </p>

          {results.missing.length > 0 && (
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-300">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                Personas desaparecidas ({results.missing.length})
              </h3>
              {results.missing.map((r) => (
                <MissingCard key={r.record.id} result={r} />
              ))}
            </div>
          )}

          {results.survivors.length > 0 && (
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-300">
                <Heart className="h-4 w-4 text-green-500" />
                Personas a salvo ({results.survivors.length})
              </h3>
              {results.survivors.map((r) => (
                <SurvivorCard key={r.record.id} result={r} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MissingCard({ result }: { result: SearchResult }) {
  const { record, score } = result;
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
            <User className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{record.full_name}</p>
            {record.alias && (
              <p className="text-xs text-gray-500">&ldquo;{record.alias}&rdquo;</p>
            )}
          </div>
        </div>
        <ScoreBadge score={score} />
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
        {record.age_approx != null && (
          <span>~ {record.age_approx} años</span>
        )}
        {record.sex && record.sex !== "unknown" && (
          <span>{record.sex === "female" ? "Femenino" : record.sex === "male" ? "Masculino" : "Otro"}</span>
        )}
        {record.city && (
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {record.city}, {record.state}
          </span>
        )}
        {record.last_seen_at && (
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatRelativeTime(record.last_seen_at)}
          </span>
        )}
      </div>

      {record.last_seen_place && (
        <p className="text-xs text-gray-600 dark:text-gray-400">
          <strong>Último avistamiento:</strong> {record.last_seen_place}
        </p>
      )}

      <div className="flex items-center gap-2">
        <span className={cn("text-xs px-2 py-0.5 rounded-full", STATUS_COLORS[record.status] || "bg-gray-100 text-gray-600")}>
          {record.status === "searching" ? "En búsqueda" :
           record.status === "possible_match" ? "Posible coincidencia" :
           record.status === "verified" ? "Verificado" : record.status}
        </span>
        <span className="text-xs text-gray-400">{formatRelativeTime(record.created_at)}</span>
      </div>
    </div>
  );
}

function SurvivorCard({ result }: { result: SearchResult }) {
  const { record, score } = result;
  return (
    <div className="rounded-xl border border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/30 p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <Heart className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{record.full_name}</p>
            {record.age_approx != null && (
              <p className="text-xs text-gray-500">~ {record.age_approx} años</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {record.health_status && (
            <span className={cn("text-xs px-2 py-0.5 rounded-full", HEALTH_COLORS[record.health_status])}>
              {HEALTH_LABELS[record.health_status]}
            </span>
          )}
          <ScoreBadge score={score} />
        </div>
      </div>

      <div className="text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {record.location_name || record.current_location}
        </span>
      </div>

      {record.message_for_family && (
        <div className="rounded-lg bg-white dark:bg-gray-800 border border-green-100 dark:border-green-900 p-3">
          <p className="text-xs text-gray-500 mb-1">Mensaje para la familia:</p>
          <p className="text-sm text-gray-700 dark:text-gray-300 italic">
            &ldquo;{record.message_for_family}&rdquo;
          </p>
        </div>
      )}

      {(record.email || record.phone || record.whatsapp) && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-500">Contacto autorizado:</p>
          {record.email && <p className="text-xs text-gray-700 dark:text-gray-300">✉ {record.email}</p>}
          {record.phone && <p className="text-xs text-gray-700 dark:text-gray-300">📞 {record.phone}</p>}
          {record.whatsapp && (
            <a
              href={`https://wa.me/${record.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-green-600 hover:underline"
            >
              💬 WhatsApp: {record.whatsapp}
            </a>
          )}
        </div>
      )}

      <span className="text-xs text-gray-400">{formatRelativeTime(record.created_at)}</span>
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 90
      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      : score >= 75
      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";

  return (
    <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", color)}>
      {Math.round(score)}% coincidencia
    </span>
  );
}
