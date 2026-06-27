"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, MapPin, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categoryLabels } from "@/lib/utils";
import type { NeedCategory } from "@/types";

const schema = z.object({
  title: z.string().min(10, "Describe brevemente tu necesidad (mínimo 10 caracteres)"),
  description: z.string().min(20, "Por favor da más detalles (mínimo 20 caracteres)"),
  category: z.string().min(1, "Selecciona una categoría"),
  location: z.string().min(5, "Indica tu ubicación"),
  people_count: z.string().transform(Number),
  urgency: z.string().transform(Number),
  contact: z.string().min(7, "Ingresa un número de teléfono o forma de contacto"),
});

type FormData = {
  title: string;
  description: string;
  category: string;
  location: string;
  people_count: number;
  urgency: number;
  contact: string;
};

interface RequestFormProps {
  onSuccess?: () => void;
}

export function RequestForm({ onSuccess }: RequestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<FormData>({ resolver: zodResolver(schema) as any, defaultValues: { people_count: 1 as unknown as number, urgency: 3 as unknown as number } });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function onSubmit(data: any) {
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Error al enviar la solicitud");
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
        <div className="text-4xl mb-3">✅</div>
        <h3 className="font-semibold text-green-900 dark:text-green-100 mb-1">
          Solicitud enviada
        </h3>
        <p className="text-sm text-green-700 dark:text-green-300">
          Tu solicitud fue registrada. Un coordinador se pondrá en contacto contigo pronto.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => setSuccess(false)}
        >
          Enviar otra solicitud
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 p-3 text-sm text-red-700 dark:text-red-300 flex items-start gap-2">
        <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
        <span>
          Si estás en peligro inmediato, llama al <strong>171</strong> primero.
        </span>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">¿Qué necesitas?</Label>
        <Input
          id="title"
          placeholder="Ej: Necesito agua potable para familia de 4 personas"
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
          <Label>Urgencia</Label>
          <Select
            defaultValue="3"
            onValueChange={(v) => setValue("urgency", Number(v))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Baja</SelectItem>
              <SelectItem value="2">Normal</SelectItem>
              <SelectItem value="3">Alta</SelectItem>
              <SelectItem value="4">Urgente</SelectItem>
              <SelectItem value="5">Crítica — vida en riesgo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción detallada</Label>
        <Textarea
          id="description"
          placeholder="Describe la situación con el mayor detalle posible: cuántas personas, condición de salud, qué tan urgente, qué tienes y qué te falta..."
          className="min-h-[100px]"
          {...register("description")}
        />
        {errors.description && (
          <p className="text-xs text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">
            <MapPin className="inline h-3.5 w-3.5 mr-1" />
            Ubicación
          </Label>
          <Input
            id="location"
            placeholder="Barrio, calle, municipio..."
            {...register("location")}
          />
          {errors.location && <p className="text-xs text-red-500">{errors.location.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="people_count">Número de personas</Label>
          <Input
            id="people_count"
            type="number"
            min={1}
            max={10000}
            {...register("people_count")}
          />
          {errors.people_count && (
            <p className="text-xs text-red-500">{errors.people_count.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact">Contacto</Label>
        <Input
          id="contact"
          placeholder="Número de teléfono o WhatsApp"
          {...register("contact")}
        />
        {errors.contact && <p className="text-xs text-red-500">{errors.contact.message}</p>}
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting} size="lg">
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Enviando...
          </>
        ) : (
          "Enviar Solicitud de Ayuda"
        )}
      </Button>

      <p className="text-center text-xs text-gray-400">
        Tu información será compartida con coordinadores y voluntarios para facilitar la ayuda.
      </p>
    </form>
  );
}
