"use client";

import { MapPin, Clock, Package, Share2, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  categoryLabels,
  categoryIcons,
  formatRelativeTime,
  buildWhatsAppShareUrl,
} from "@/lib/utils";
import type { Offer } from "@/types";

interface OfferCardProps {
  offer: Offer;
  onContact?: (id: string) => void;
}

export function OfferCard({ offer, onContact }: OfferCardProps) {
  function handleShare() {
    const text = `✅ *${offer.title}*\n📍 ${offer.location}\n📦 ${offer.description}\n📞 ${offer.contact}\n\nOfertas en AyudaVenezuela`;
    window.open(buildWhatsAppShareUrl(text), "_blank");
  }

  return (
    <Card className="group hover:shadow-md transition-shadow border-l-4 border-l-green-500">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{categoryIcons[offer.category]}</span>
            <Badge variant="success" className="text-xs">
              {categoryLabels[offer.category]}
            </Badge>
          </div>
          <Badge
            variant={offer.status === "available" ? "success" : "default"}
            className="text-xs"
          >
            {offer.status === "available" ? "Disponible" : offer.status === "reserved" ? "Reservado" : "Entregado"}
          </Badge>
        </div>

        <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
          {offer.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
          {offer.description}
        </p>

        {offer.organization && (
          <div className="text-xs font-medium text-purple-700 dark:text-purple-400 mb-2">
            🏢 {offer.organization}
          </div>
        )}

        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400 mb-3">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {offer.location}
          </span>
          {offer.quantity && (
            <span className="flex items-center gap-1">
              <Package className="h-3 w-3" />
              {offer.quantity}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatRelativeTime(offer.created_at)}
          </span>
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="h-7 px-2 text-xs"
            title="Compartir por WhatsApp"
          >
            <Share2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="sm"
            variant="success"
            className="h-7 px-3 text-xs"
            onClick={() => {
              window.open(`https://wa.me/${offer.contact.replace(/\D/g, "")}`, "_blank");
            }}
          >
            <Phone className="h-3.5 w-3.5" />
            Contactar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
