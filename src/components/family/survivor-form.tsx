"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle, Loader2, Heart, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const schema = z.object({
  full_name: z.string().min(2, "Nombre requerido"),
  age_approx: z.string().optional().transform((v) => (v ? Number(v) : undefined)),
  current_location: z.string().min(2, "Ubicación requerida"),
  location_type: z.enum(["hospital", "shelter", "care_center", "home", "other"]),
  location_name: z.string().optional(),
  health_status: z.enum(["good", "injured", "critical", "unknown"]),
  needs_help: z.boolean().default(false),
  message_for_family: z.string().max(1000).optional(),
  consent_to_be_found: z.boolean().default(true),
  show_email: z.boolean().default(false),
  show_phone: z.boolean().default(false),
  show_whatsapp: z.boolean().default(false),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
});

type FormData = z.input<typeof schema>;

export function SurvivorForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      location_type: "shelter",
      health_status: "good",
      needs_help: false,
      consent_to_be_found: true,
      show_email: false,
      show_phone: false,
      show_whatsapp: false,
    },
  });

  const consentToBeFound = watch("consent_to_be_found");
  const showEmail = watch("show_email");
  const showPhone = watch("show_phone");
  const showWhatsapp = watch("show_whatsapp");

  async function onSubmit(data: FormData) {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/family/survivors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          age_approx: data.age_approx ? Number(data.age_approx) : undefined,
          email: data.email || undefined,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Error al enviar");
      setSubmitted(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center gap-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Tu reporte fue registrado
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-md">
            Tu familia puede estar buscándote. Hemos activado la búsqueda automática. Si alguien
            te busca y coincides, ambas partes serán notificadas para autorizar el contacto.
          </p>
        </div>
        <div className="rounded-xl bg-green-50 border border-green-200 dark:bg-green-950 dark:border-green-800 p-4 max-w-md text-sm text-green-800 dark:text-green-200 text-left">
          <strong>¿Qué pasa ahora?</strong>
          <ul className="mt-2 space-y-1 list-disc pl-4">
            <li>El sistema comparará tu reporte con los reportes de búsqueda activos</li>
            <li>Si hay una coincidencia de más del 80%, ambas partes serán notificadas</li>
            <li>Tu información de contacto solo se compartirá si tú lo autorizas</li>
          </ul>
        </div>
        <Button onClick={() => setSubmitted(false)} variant="outline">
          Registrar otro reporte
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto space-y-6">
      <div className="rounded-xl bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 p-4 flex items-start gap-3">
        <Heart className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
        <p className="text-sm text-green-800 dark:text-green-200">
          Este formulario es para personas que <strong>están a salvo</strong> y desean que su
          familia lo sepa. Tu privacidad está protegida en todo momento.
        </p>
      </div>

      {/* Basic info */}
      <section className="space-y-4">
        <h3 className="font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
          Tu información
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Tu nombre completo *" error={errors.full_name?.message}>
            <Input {...register("full_name")} placeholder="Nombre y apellido" />
          </Field>
          <Field label="Edad aproximada" error={undefined}>
            <Input {...register("age_approx")} type="number" min={0} max={120} placeholder="Ej: 34" />
          </Field>
        </div>
      </section>

      {/* Current location */}
      <section className="space-y-4">
        <h3 className="font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
          Dónde estás ahora
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Tipo de lugar *" error={errors.location_type?.message}>
            <Select onValueChange={(v) => setValue("location_type", v as any)} defaultValue="shelter">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="hospital">Hospital</SelectItem>
                <SelectItem value="shelter">Albergue / Refugio</SelectItem>
                <SelectItem value="care_center">Centro de atención</SelectItem>
                <SelectItem value="home">Casa / Domicilio</SelectItem>
                <SelectItem value="other">Otro</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Estado de salud *" error={errors.health_status?.message}>
            <Select onValueChange={(v) => setValue("health_status", v as any)} defaultValue="good">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="good">Bien</SelectItem>
                <SelectItem value="injured">Lesionado/a</SelectItem>
                <SelectItem value="critical">Crítico</SelectItem>
                <SelectItem value="unknown">No sé</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>
        <Field label="Nombre del lugar (hospital, albergue, etc.)" error={undefined}>
          <Input {...register("location_name")} placeholder="Ej: Hospital Universitario de Caracas" />
        </Field>
        <Field label="Dirección o referencia *" error={errors.current_location?.message}>
          <Input {...register("current_location")} placeholder="Ej: HUC, piso 4, sala de traumatología, Caracas" />
        </Field>

        {/* Needs help checkbox */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            {...register("needs_help")}
            className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Necesito ayuda adicional
          </span>
        </label>
      </section>

      {/* Message */}
      <section className="space-y-4">
        <h3 className="font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
          Mensaje para tu familia
        </h3>
        <Field label="Escribe algo para tus seres queridos" error={undefined}>
          <Textarea
            {...register("message_for_family")}
            rows={4}
            placeholder="Ej: Estoy bien, no se preocupen. Estoy en el Hospital Central, cuarto piso. Vengan cuando puedan."
          />
        </Field>
      </section>

      {/* Privacy & Contact */}
      <section className="space-y-4">
        <h3 className="font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
          Privacidad y contacto
        </h3>

        <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <input
            type="checkbox"
            {...register("consent_to_be_found")}
            className="h-4 w-4 mt-0.5 rounded border-gray-300 text-green-600 focus:ring-green-500"
          />
          <div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Acepto que mi familia pueda encontrarme a través de esta plataforma
            </span>
            <p className="text-xs text-gray-500 mt-0.5">
              Requerido para aparecer en las búsquedas
            </p>
          </div>
        </label>

        {consentToBeFound && (
          <div className="space-y-3 pl-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              ¿Qué información de contacto puedes compartir? (opcional)
            </p>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register("show_email")}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">Mostrar correo electrónico</span>
            </label>
            {showEmail && (
              <Field label="" error={errors.email?.message}>
                <Input {...register("email")} type="email" placeholder="tu@correo.com" />
              </Field>
            )}

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register("show_phone")}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">Mostrar teléfono</span>
            </label>
            {showPhone && (
              <Field label="" error={undefined}>
                <Input {...register("phone")} placeholder="+58 412 000-0000" />
              </Field>
            )}

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register("show_whatsapp")}
                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">Mostrar WhatsApp</span>
            </label>
            {showWhatsapp && (
              <Field label="" error={undefined}>
                <Input {...register("whatsapp")} placeholder="+58 412 000-0000" />
              </Field>
            )}
          </div>
        )}
      </section>

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700 dark:bg-red-950 dark:border-red-800 dark:text-red-300">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <Button type="submit" disabled={submitting} size="lg" variant="success" className="w-full">
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            <CheckCircle className="h-4 w-4" />
            Estoy a salvo — Registrar
          </>
        )}
      </Button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      {label && (
        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</Label>
      )}
      {children}
      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
