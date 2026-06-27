"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertTriangle, CheckCircle, Loader2, ChevronRight, ChevronLeft } from "lucide-react";
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
import { cn } from "@/lib/utils";

const schema = z.object({
  full_name: z.string().min(2, "Nombre requerido"),
  alias: z.string().optional(),
  age_approx: z.string().transform(Number).pipe(z.number().int().min(0).max(120)),
  sex: z.enum(["male", "female", "other", "unknown"]),
  languages: z.string().optional(),
  country: z.string().default("Venezuela"),
  state: z.string().min(1, "Estado requerido"),
  city: z.string().min(1, "Ciudad requerida"),
  address_approx: z.string().optional(),
  last_seen_at: z.string().min(1, "Fecha requerida"),
  last_seen_place: z.string().min(2, "Lugar requerido"),
  height_cm: z.string().optional().transform((v) => (v ? Number(v) : undefined)),
  hair_color: z.string().optional(),
  eye_color: z.string().optional(),
  clothing_description: z.string().optional(),
  distinguishing_marks: z.string().optional(),
  tattoos: z.string().optional(),
  scars: z.string().optional(),
  allergies: z.string().optional(),
  disability: z.string().optional(),
  medications: z.string().optional(),
  medical_conditions: z.string().optional(),
  reporter_name: z.string().min(2, "Tu nombre es requerido"),
  reporter_relationship: z.string().min(1, "Relación requerida"),
  reporter_email: z.string().email("Email inválido"),
  reporter_phone: z.string().optional(),
  reporter_whatsapp: z.string().optional(),
});

type FormData = z.input<typeof schema>;

const STEPS = [
  { id: 1, title: "Información básica", subtitle: "¿Quién estás buscando?" },
  { id: 2, title: "Último avistamiento", subtitle: "¿Dónde y cuándo fue visto/a por última vez?" },
  { id: 3, title: "Descripción física", subtitle: "Ayúdanos a identificarle visualmente" },
  { id: 4, title: "Información médica", subtitle: "Datos de salud relevantes (privados)" },
  { id: 5, title: "Tu información", subtitle: "¿Cómo te contactamos si hay noticias?" },
];

export function MissingPersonForm() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      sex: "unknown",
      country: "Venezuela",
    },
  });

  const { register, handleSubmit, formState: { errors }, setValue, watch } = form;

  async function onSubmit(data: FormData) {
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        ...data,
        age_approx: Number(data.age_approx),
        height_cm: data.height_cm ? Number(data.height_cm) : undefined,
        languages: data.languages ? data.languages.split(",").map((l) => l.trim()).filter(Boolean) : ["Español"],
      };
      const res = await fetch("/api/family/missing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
            Búsqueda registrada
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-md">
            Hemos registrado la búsqueda. Te notificaremos por correo si encontramos una posible
            coincidencia. Nuestro sistema de IA revisará automáticamente todos los reportes de
            sobrevivientes.
          </p>
        </div>
        <div className="rounded-xl bg-amber-50 border border-amber-200 dark:bg-amber-950 dark:border-amber-800 p-4 max-w-md text-sm text-amber-800 dark:text-amber-200">
          <strong>Importante:</strong> La información de contacto del familiar solo será compartida
          cuando ambas partes lo acepten explícitamente.
        </div>
        <Button onClick={() => { setSubmitted(false); setStep(1); form.reset(); }}>
          Registrar otra búsqueda
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Step indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                  step > s.id
                    ? "bg-green-600 text-white"
                    : step === s.id
                    ? "bg-red-600 text-white"
                    : "bg-gray-200 text-gray-500 dark:bg-gray-700"
                )}
              >
                {step > s.id ? "✓" : s.id}
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 flex-1 mx-1 transition-colors",
                    step > s.id ? "bg-green-600" : "bg-gray-200 dark:bg-gray-700"
                  )}
                  style={{ width: "2rem" }}
                />
              )}
            </div>
          ))}
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {STEPS[step - 1].title}
          </h2>
          <p className="text-sm text-gray-500">{STEPS[step - 1].subtitle}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* ─── Step 1: Basic Info ─── */}
        {step === 1 && (
          <div className="space-y-4">
            <Field label="Nombre completo *" error={errors.full_name?.message}>
              <Input {...register("full_name")} placeholder="Ej: Carmen Beatriz Rodríguez" />
            </Field>
            <Field label="Alias o apodo" error={errors.alias?.message}>
              <Input {...register("alias")} placeholder="Ej: Carmencita, El Chamo" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Edad aproximada *" error={errors.age_approx?.message}>
                <Input {...register("age_approx")} type="number" min={0} max={120} placeholder="Ej: 58" />
              </Field>
              <Field label="Sexo *" error={errors.sex?.message}>
                <Select onValueChange={(v) => setValue("sex", v as any)} defaultValue="unknown">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">Femenino</SelectItem>
                    <SelectItem value="male">Masculino</SelectItem>
                    <SelectItem value="other">Otro</SelectItem>
                    <SelectItem value="unknown">No especificado</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <Field label="Idiomas" error={undefined}>
              <Input {...register("languages")} placeholder="Español, Inglés (separados por comas)" />
            </Field>
          </div>
        )}

        {/* ─── Step 2: Last Known Location ─── */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Estado *" error={errors.state?.message}>
                <Input {...register("state")} placeholder="Ej: Miranda" />
              </Field>
              <Field label="Ciudad *" error={errors.city?.message}>
                <Input {...register("city")} placeholder="Ej: Petare" />
              </Field>
            </div>
            <Field label="Dirección aproximada" error={undefined}>
              <Input {...register("address_approx")} placeholder="Ej: Cerca del Metro de Petare (no se mostrará públicamente)" />
            </Field>
            <Field label="Fecha y hora aproximada *" error={errors.last_seen_at?.message}>
              <Input {...register("last_seen_at")} type="datetime-local" />
            </Field>
            <Field label="Lugar exacto donde fue visto/a *" error={errors.last_seen_place?.message}>
              <Textarea
                {...register("last_seen_place")}
                rows={3}
                placeholder="Ej: Mercado de Petare, esquina con Av. Francisco de Miranda, cerca del Metro"
              />
            </Field>
          </div>
        )}

        {/* ─── Step 3: Physical Description ─── */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Field label="Estatura (cm)" error={undefined}>
                <Input {...register("height_cm")} type="number" min={50} max={250} placeholder="Ej: 165" />
              </Field>
              <Field label="Color de cabello" error={undefined}>
                <Input {...register("hair_color")} placeholder="Ej: Negro" />
              </Field>
              <Field label="Color de ojos" error={undefined}>
                <Input {...register("eye_color")} placeholder="Ej: Café" />
              </Field>
            </div>
            <Field label="Ropa que llevaba" error={undefined}>
              <Textarea
                {...register("clothing_description")}
                rows={2}
                placeholder="Ej: Vestido floreado azul y blanco, cartera marrón de cuero"
              />
            </Field>
            <Field label="Señales particulares / marcas de nacimiento" error={undefined}>
              <Input {...register("distinguishing_marks")} placeholder="Ej: Lunar en mejilla derecha" />
            </Field>
            <Field label="Tatuajes" error={undefined}>
              <Input {...register("tattoos")} placeholder="Ej: Rosa en antebrazo izquierdo" />
            </Field>
            <Field label="Cicatrices" error={undefined}>
              <Input {...register("scars")} placeholder="Ej: Cicatriz de operación en rodilla derecha" />
            </Field>
          </div>
        )}

        {/* ─── Step 4: Medical Info (Private) ─── */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="rounded-xl bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-4 text-sm text-blue-800 dark:text-blue-200">
              🔒 Esta información es <strong>estrictamente confidencial</strong>. Solo la verán
              los coordinadores de emergencia y las autoridades médicas. Nunca se mostrará
              públicamente.
            </div>
            <Field label="Alergias" error={undefined}>
              <Input {...register("allergies")} placeholder="Ej: Penicilina, Mariscos" />
            </Field>
            <Field label="Discapacidad" error={undefined}>
              <Input {...register("disability")} placeholder="Ej: Movilidad reducida, no puede caminar sin apoyo" />
            </Field>
            <Field label="Medicamentos importantes" error={undefined}>
              <Input {...register("medications")} placeholder="Ej: Metformina 850mg, Atenolol 50mg" />
            </Field>
            <Field label="Condiciones médicas" error={undefined}>
              <Textarea
                {...register("medical_conditions")}
                rows={2}
                placeholder="Ej: Diabetes tipo 2, Hipertensión"
              />
            </Field>
          </div>
        )}

        {/* ─── Step 5: Reporter Contact ─── */}
        {step === 5 && (
          <div className="space-y-4">
            <div className="rounded-xl bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-4 text-sm text-amber-800 dark:text-amber-200">
              Tu información de contacto solo se compartirá cuando encuentres una coincidencia
              confirmada y <strong>ambas partes acepten</strong> el intercambio de datos.
            </div>
            <Field label="Tu nombre completo *" error={errors.reporter_name?.message}>
              <Input {...register("reporter_name")} placeholder="Ej: José Luis Rodríguez" />
            </Field>
            <Field label="Tu relación con la persona *" error={errors.reporter_relationship?.message}>
              <Input {...register("reporter_relationship")} placeholder="Ej: Hijo/a, Madre, Hermano/a, Esposo/a" />
            </Field>
            <Field label="Tu correo electrónico *" error={errors.reporter_email?.message}>
              <Input {...register("reporter_email")} type="email" placeholder="tu@correo.com" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Teléfono" error={undefined}>
                <Input {...register("reporter_phone")} placeholder="+58 412 000-0000" />
              </Field>
              <Field label="WhatsApp" error={undefined}>
                <Input {...register("reporter_whatsapp")} placeholder="+58 412 000-0000" />
              </Field>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700 dark:bg-red-950 dark:border-red-800 dark:text-red-300">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>

          {step < STEPS.length ? (
            <Button type="button" onClick={() => setStep((s) => s + 1)}>
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" disabled={submitting} size="lg">
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Registrando...
                </>
              ) : (
                "Registrar búsqueda"
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
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
      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</Label>
      {children}
      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
