"use client";

import { useState } from "react";
import { Users, CheckCircle, XCircle, Lock, Unlock, Loader2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MatchData {
  id: string;
  score: number;
  match_reasons: string[];
  status: string;
  missing_side_consent: boolean;
  survivor_side_consent: boolean;
  created_at: string;
  missing_person?: {
    id: string;
    full_name: string;
    alias?: string;
    age_approx: number;
    sex: string;
    city: string;
    state: string;
    last_seen_at: string;
    last_seen_place: string;
    photo_url?: string;
    status: string;
    reporter_name?: string;
    reporter_relationship?: string;
    reporter_email?: string;
    reporter_phone?: string;
    reporter_whatsapp?: string;
  } | null;
  survivor?: {
    id: string;
    full_name: string;
    age_approx?: number;
    current_location: string;
    location_type: string;
    location_name?: string;
    health_status: string;
    message_for_family?: string;
    photo_url?: string;
    status: string;
    email?: string;
    phone?: string;
    whatsapp?: string;
  } | null;
}

const SCORE_CONFIG = {
  veryHigh: { min: 90, label: "Coincidencia muy alta", color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800" },
  high: { min: 75, label: "Coincidencia alta", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800" },
  medium: { min: 60, label: "Posible coincidencia", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800" },
};

function getScoreConfig(score: number) {
  if (score >= 90) return SCORE_CONFIG.veryHigh;
  if (score >= 75) return SCORE_CONFIG.high;
  return SCORE_CONFIG.medium;
}

const HEALTH_LABELS: Record<string, string> = {
  good: "A salvo", injured: "Lesionado/a", critical: "Crítico", unknown: "Desconocido",
};

export function MatchCard({ match, side }: { match: MatchData; side: "missing" | "survivor" }) {
  const [accepting, setAccepting] = useState(false);
  const [localConsent, setLocalConsent] = useState<boolean | null>(null);
  const [expanded, setExpanded] = useState(false);

  const config = getScoreConfig(match.score);

  const myConsent = side === "missing" ? match.missing_side_consent : match.survivor_side_consent;
  const otherConsent = side === "missing" ? match.survivor_side_consent : match.missing_side_consent;
  const effectiveConsent = localConsent !== null ? localConsent : myConsent;
  const bothConsented = effectiveConsent && otherConsent;
  const contactUnlocked = match.status === "accepted" || match.status === "reunited";

  const otherPerson = side === "missing" ? match.survivor : match.missing_person;
  const otherName = side === "missing"
    ? match.survivor?.full_name
    : match.missing_person?.full_name;

  async function handleConsent(accepted: boolean) {
    setAccepting(true);
    try {
      const res = await fetch("/api/family/matches", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ match_id: match.id, side, accepted }),
      });
      if (res.ok) setLocalConsent(accepted);
    } finally {
      setAccepting(false);
    }
  }

  return (
    <div className={cn("rounded-xl border p-5 space-y-4", config.bg)}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <Users className={cn("h-5 w-5", config.color)} />
          </div>
          <div>
            <p className={cn("font-bold text-lg", config.color)}>{Math.round(match.score)}%</p>
            <p className="text-xs text-gray-500">{config.label}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{otherName}</p>
          {otherPerson && "health_status" in otherPerson && (
            <span className="text-xs text-gray-500">{HEALTH_LABELS[otherPerson.health_status || "unknown"]}</span>
          )}
        </div>
      </div>

      {/* Match reasons */}
      <div className="space-y-1.5">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", expanded && "rotate-180")} />
          Ver razones de coincidencia
        </button>
        {expanded && (
          <ul className="space-y-1 pl-2">
            {match.match_reasons.map((reason, i) => (
              <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                <span className="text-green-500 mt-0.5">✓</span>
                {reason}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Consent / Contact section */}
      <div className="rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-4 space-y-3">
        {contactUnlocked ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-green-600">
              <Unlock className="h-4 w-4" />
              <span className="text-sm font-semibold">Contacto desbloqueado</span>
            </div>
            {match.missing_person?.reporter_email && (
              <a href={`mailto:${match.missing_person.reporter_email}`} className="text-xs text-blue-600 hover:underline block">
                ✉ {match.missing_person.reporter_email}
              </a>
            )}
            {match.missing_person?.reporter_whatsapp && (
              <a
                href={`https://wa.me/${match.missing_person.reporter_whatsapp.replace(/\D/g, "")}`}
                target="_blank" rel="noopener noreferrer"
                className="text-xs text-green-600 hover:underline block"
              >
                💬 WhatsApp: {match.missing_person.reporter_whatsapp}
              </a>
            )}
            {match.survivor?.email && (
              <a href={`mailto:${match.survivor.email}`} className="text-xs text-blue-600 hover:underline block">
                ✉ {match.survivor.email}
              </a>
            )}
            {match.survivor?.whatsapp && (
              <a
                href={`https://wa.me/${match.survivor.whatsapp.replace(/\D/g, "")}`}
                target="_blank" rel="noopener noreferrer"
                className="text-xs text-green-600 hover:underline block"
              >
                💬 WhatsApp: {match.survivor.whatsapp}
              </a>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-500">
              <Lock className="h-4 w-4" />
              <span className="text-xs">El contacto se desbloqueará cuando ambas partes acepten</span>
            </div>

            {/* Consent status indicators */}
            <div className="flex gap-3 text-xs">
              <span className={cn("flex items-center gap-1", effectiveConsent ? "text-green-600" : "text-gray-400")}>
                {effectiveConsent ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                Tú
              </span>
              <span className={cn("flex items-center gap-1", otherConsent ? "text-green-600" : "text-gray-400")}>
                {otherConsent ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                {side === "missing" ? "Sobreviviente" : "Familiar"}
              </span>
            </div>

            {!effectiveConsent && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleConsent(true)}
                  disabled={accepting}
                  className="flex-1"
                >
                  {accepting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />}
                  Aceptar contacto
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleConsent(false)}
                  disabled={accepting}
                >
                  <XCircle className="h-3.5 w-3.5" />
                  No es
                </Button>
              </div>
            )}

            {effectiveConsent && !otherConsent && (
              <p className="text-xs text-amber-600 dark:text-amber-400">
                Esperando confirmación de la otra parte...
              </p>
            )}
          </div>
        )}
      </div>

      {/* Survivor message if available */}
      {match.survivor?.message_for_family && (
        <div className="rounded-lg bg-white/70 dark:bg-gray-800/70 p-3">
          <p className="text-xs text-gray-500 mb-1">Mensaje del sobreviviente:</p>
          <p className="text-sm italic text-gray-700 dark:text-gray-300">
            &ldquo;{match.survivor.message_for_family}&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}
