"use client";

import { MapPin, Clock, Users, Shield, Share2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  categoryLabels,
  categoryIcons,
  urgencyLabels,
  urgencyColors,
  formatRelativeTime,
  buildWhatsAppShareUrl,
} from "@/lib/utils";
import type { Request, VerificationLevel } from "@/types";

function verificationBadge(level: VerificationLevel) {
  const map: Record<VerificationLevel, { label: string; variant: "default" | "success" | "warning" | "danger" | "info" | "official" | "outline" }> = {
    unverified: { label: "Sin verificar", variant: "outline" },
    low: { label: "Baja confianza", variant: "warning" },
    medium: { label: "Verificado", variant: "info" },
    high: { label: "Alta confianza", variant: "success" },
    official: { label: "Oficial", variant: "official" },
  };
  return map[level] ?? map.unverified;
}

interface RequestCardProps {
  request: Request;
  onRespond?: (id: string) => void;
}

export function RequestCard({ request, onRespond }: RequestCardProps) {
  const urgencyClass = urgencyColors[request.urgency] ?? urgencyColors[1];
  const verif = verificationBadge(request.verification_level);

  function handleShare() {
    const text = `🆘 *${request.title}*\n📍 ${request.location}\n👥 ${request.people_count} personas\n📞 ${request.contact}\n\nReportar en AyudaVenezuela`;
    window.open(buildWhatsAppShareUrl(text), "_blank");
  }

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl" aria-hidden>
              {categoryIcons[request.category]}
            </span>
            <Badge variant="default" className="text-xs">
              {categoryLabels[request.category]}
            </Badge>
          </div>
          <div className={`text-xs font-semibold px-2 py-0.5 rounded-full ${urgencyClass}`}>
            {urgencyLabels[request.urgency]}
          </div>
        </div>

        <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
          {request.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
          {request.description}
        </p>

        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400 mb-3">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {request.location}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {request.people_count} {request.people_count === 1 ? "persona" : "personas"}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatRelativeTime(request.created_at)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Shield className="h-3 w-3 text-gray-400" />
            <Badge variant={verif.variant} className="text-xs">
              {verif.label}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="h-7 px-2 text-xs"
              title="Compartir por WhatsApp"
            >
              <Share2 className="h-3.5 w-3.5" />
            </Button>
            {onRespond && (
              <Button
                size="sm"
                onClick={() => onRespond(request.id)}
                className="h-7 px-3 text-xs"
              >
                Ayudar
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
