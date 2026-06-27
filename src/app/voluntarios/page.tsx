"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Users, Loader2, CheckCircle } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const SKILLS = [
  "Médico / Enfermería",
  "Rescate / Bombero",
  "Psicología",
  "Logística",
  "Conducción / Transporte",
  "Cocina / Alimentación",
  "Tecnología / Comunicaciones",
  "Idiomas",
  "Trabajo Social",
  "Construcción",
  "Otro",
];

const schema = z.object({
  name: z.string().min(3, "Ingresa tu nombre completo"),
  contact: z.string().min(7, "Número de teléfono requerido"),
  location: z.string().min(3, "Indica tu ubicación"),
  skills: z.string().min(1, "Selecciona al menos una habilidad"),
  availability: z.string().min(1, "Indica tu disponibilidad"),
  organization: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function VoluntariosPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/volunteers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, skills: [data.skills], languages: ["Español"] }),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Error al registrar");
      }
      setSuccess(true);
      reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Header />
      <main className="flex-1 mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-950">
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Voluntarios</h1>
            <p className="text-sm text-gray-500">Únete al equipo de respuesta</p>
          </div>
        </div>

        {/* Impact stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { value: "240+", label: "Voluntarios activos" },
            { value: "18", label: "Organizaciones" },
            { value: "5 zonas", label: "Coordinadas" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-blue-50 dark:bg-blue-950 p-4 text-center">
              <div className="text-xl font-bold text-blue-900 dark:text-blue-100">{s.value}</div>
              <div className="text-xs text-blue-700 dark:text-blue-300">{s.label}</div>
            </div>
          ))}
        </div>

        {success ? (
          <Card>
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                ¡Gracias por unirte!
              </h2>
              <p className="text-gray-500 mb-4">
                Tu registro fue recibido. Un coordinador te contactará pronto para asignarte tareas.
              </p>
              <Button onClick={() => setSuccess(false)} variant="outline" size="sm">
                Registrar otro voluntario
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Registro de Voluntario</CardTitle>
              <CardDescription>
                Completa el formulario y un coordinador te contactará para asignarte una tarea.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="name">Nombre completo</Label>
                    <Input id="name" placeholder="Tu nombre" {...register("name")} />
                    {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact">Teléfono / WhatsApp</Label>
                    <Input id="contact" placeholder="0412-000-0000" {...register("contact")} />
                    {errors.contact && <p className="text-xs text-red-500">{errors.contact.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Ubicación</Label>
                    <Input id="location" placeholder="Ciudad / Municipio" {...register("location")} />
                    {errors.location && <p className="text-xs text-red-500">{errors.location.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>Habilidad principal</Label>
                    <Select onValueChange={(v) => setValue("skills", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona..." />
                      </SelectTrigger>
                      <SelectContent>
                        {SKILLS.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.skills && <p className="text-xs text-red-500">{errors.skills.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>Disponibilidad</Label>
                    <Select onValueChange={(v) => setValue("availability", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Inmediata — Puedo ir ahora</SelectItem>
                        <SelectItem value="today">Hoy</SelectItem>
                        <SelectItem value="this_week">Esta semana</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.availability && <p className="text-xs text-red-500">{errors.availability.message}</p>}
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="organization">Organización (opcional)</Label>
                    <Input id="organization" placeholder="ONG, empresa, institución..." {...register("organization")} />
                  </div>
                </div>

                {error && (
                  <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isSubmitting} size="lg" variant="secondary">
                  {isSubmitting ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Registrando...</>
                  ) : (
                    "Registrarme como Voluntario"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />
    </>
  );
}
