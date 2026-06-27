import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { NeedCategory } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Ahora mismo";
  if (diffMins < 60) return `Hace ${diffMins} min`;
  if (diffHours < 24) return `Hace ${diffHours}h`;
  if (diffDays < 7) return `Hace ${diffDays}d`;
  return date.toLocaleDateString("es-VE");
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("es-VE", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const categoryLabels: Record<NeedCategory, string> = {
  water: "Agua",
  food: "Alimentos",
  shelter: "Refugio",
  medical: "Atención Médica",
  transport: "Transporte",
  rescue: "Rescate",
  clothing: "Ropa",
  energy: "Electricidad / Gas",
  communication: "Comunicación",
  psychological: "Apoyo Psicológico",
  other: "Otro",
};

export const categoryIcons: Record<NeedCategory, string> = {
  water: "💧",
  food: "🥫",
  shelter: "🏠",
  medical: "🏥",
  transport: "🚗",
  rescue: "🆘",
  clothing: "👕",
  energy: "⚡",
  communication: "📡",
  psychological: "🧠",
  other: "📦",
};

export const urgencyLabels: Record<number, string> = {
  1: "Baja",
  2: "Normal",
  3: "Alta",
  4: "Urgente",
  5: "Crítica",
};

export const urgencyColors: Record<number, string> = {
  1: "text-green-600 bg-green-50",
  2: "text-blue-600 bg-blue-50",
  3: "text-yellow-600 bg-yellow-50",
  4: "text-orange-600 bg-orange-50",
  5: "text-red-600 bg-red-50",
};

export function buildWhatsAppShareUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "...";
}
