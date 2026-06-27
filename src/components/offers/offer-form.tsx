"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categoryLabels } from "@/lib/utils";

const schema = z.object({
  title: z.string().min(10, "Describe brevemente lo que ofreces"),
  description: z.string().min(20, "Da más detalles sobre lo que ofreces"),
  category: z.string().min(1, "Selecciona una categoría"),
  location: z.string().min(5, "Indica dónde está disponible la ayuda"),
  quantity: z.string().optional(),
  contact: z.string().min(7, "Ingresa tu número de contacto"),
  organization: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface OfferFormProps {
  onSuccess?: () => void;
}

export function OfferForm({ onSuccess }: OfferFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Error al registrar la oferta");
      }

      setSuccess(true);
      reset();
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-xl bg-green-50 dark:bg-green-950 p-6 text-center">
        <div className="text-4xl mb-3">🙌</div>
        <h3 className="font-semibold text-green-900 dark:text-green-100 mb-1">
          ¡Gracias por ofrecer ayuda!
        </h3>
        <p className="text-sm text-green-700 dark:text-green-300">
          Tu oferta fue registrada. Las personas que la necesiten podrán contactarte directamente.
        </p>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => setSuccess(false)}>
          Registrar otra oferta
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="title">¿Qué ofreces?</Label>
        <Input
          id="title"
          placeholder="Ej: Agua embotellada — 50 botellones disponibles"
          {...register("title")}
        />
        {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Categoría</Label>
          <Select onValueChange={(v) => setValue("category", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona..." />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(categoryLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">Cantidad (opcional)</Label>
          <Input
            id="quantity"
            placeholder="Ej: 50 litros, 10 cajas..."
            {...register("quantity")}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          placeholder="Describe exactamente qué tienes disponible, cuándo y cómo puede recogerse..."
          className="min-h-[100px]"
          {...register("description")}
        />
        {errors.description && (
          <p className="text-xs text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">Ubicación</Label>
          <Input id="location" placeholder="Dónde puedes entregar" {...register("location")} />
          {errors.location && <p className="text-xs text-red-500">{errors.location.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact">Contacto</Label>
          <Input id="contact" placeholder="Teléfono / WhatsApp" {...register("contact")} />
          {errors.contact && <p className="text-xs text-red-500">{errors.contact.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="organization">Organización (opcional)</Label>
        <Input
          id="organization"
          placeholder="Cruz Roja, ONG, empresa..."
          {...register("organization")}
        />
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {error}
        </div>
      )}

      <Button type="submit" variant="success" className="w-full" disabled={isSubmitting} size="lg">
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Registrando...
          </>
        ) : (
          "Registrar Oferta de Ayuda"
        )}
      </Button>
    </form>
  );
}
