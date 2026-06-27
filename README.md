# 🇻🇪 Ayuda Venezuela — Plataforma de Respuesta Humanitaria

Plataforma open source para coordinación de ayuda humanitaria durante emergencias. Diseñada para desplegarse en 72 horas ante cualquier desastre en cualquier país con solo cambiar el archivo de configuración.

---

## Características

- **Registro de necesidades** — Formulario simple para reportar qué se necesita, con verificación automática por IA
- **Ofertas de ayuda** — Sistema para registrar donaciones de agua, alimentos, transporte, etc.
- **Mapa de emergencia** — Visualización geográfica de centros de ayuda y solicitudes activas
- **Agentes de IA** — 4 agentes especializados: Información, Verificación, Matching, Analytics
- **Matching automático** — La IA conecta necesidades con ofertas automáticamente
- **Centro de voluntarios** — Registro y gestión de voluntarios por habilidad
- **Chat IA** — Asistente conversacional con información verificada de la emergencia
- **Dashboard en tiempo real** — Métricas y actividad reciente
- **Panel administrativo** — Control centralizado para coordinadores
- **Multi-país** — Un archivo de configuración para cualquier emergencia en cualquier país

---

## Stack Tecnológico

| Capa | Tecnología | Razón |
|---|---|---|
| Frontend | Next.js 16 + TypeScript | SSR + App Router + velocidad de compilación |
| UI | Tailwind v4 + Radix UI | Sistema de diseño sin dependencia de librería externa |
| Estado | React Hook Form + Zustand | Formularios robustos, estado global ligero |
| Backend | Next.js API Routes | Colocación con frontend, serverless nativo |
| Base de datos | Supabase (PostgreSQL + PostGIS) | Auth + DB + Realtime + Storage en uno |
| IA | Anthropic Claude | Agentes verificados, streaming nativo, sin alucinaciones en contexto |
| Mapas | Leaflet + OpenStreetMap | Open source, funciona offline, sin costos de API |
| Deployment | Vercel | Edge deployment, CI/CD automático |

---

## Estructura del Proyecto

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── dashboard/            # Dashboard con métricas en tiempo real
│   ├── solicitudes/          # Listado y formulario de necesidades
│   ├── ofertas/              # Listado y formulario de ofertas
│   ├── centros/              # Directorio de centros de ayuda
│   ├── mapa/                 # Mapa interactivo de emergencia
│   ├── voluntarios/          # Registro de voluntarios
│   ├── chat/                 # Asistente IA conversacional
│   ├── admin/                # Panel administrativo
│   └── api/                  # API Routes
│       ├── chat/             # Streaming del agente de información
│       ├── requests/         # CRUD solicitudes + verificación IA
│       ├── offers/           # CRUD ofertas
│       ├── volunteers/       # CRUD voluntarios
│       ├── stats/            # Métricas del sistema
│       └── agents/           # Endpoints de agentes IA
├── components/
│   ├── ui/                   # Sistema de diseño (Button, Card, Badge, etc.)
│   ├── layout/               # Header, Footer
│   ├── map/                  # Componente Leaflet (client-only)
│   ├── chat/                 # Chat con streaming SSE
│   ├── dashboard/            # Stats grid
│   ├── requests/             # RequestCard + RequestForm
│   └── offers/               # OfferCard + OfferForm
├── lib/
│   ├── agents/               # 4 agentes de IA (information, verification, matching, analytics)
│   ├── supabase/             # Cliente browser/server/middleware
│   ├── disaster-config.ts    # ← ÚNICO ARCHIVO A CAMBIAR PARA OTRO DESASTRE
│   └── utils.ts              # Utilidades compartidas
└── types/                    # TypeScript types + Supabase types

supabase/migrations/
└── 001_initial.sql           # Schema completo con RLS, índices, PostGIS, triggers
```

---

## Agentes de IA

### Information Agent
Responde preguntas sobre la emergencia usando solo información verificada. Nunca inventa datos. Cita fuentes oficiales. Gestiona el chat con streaming en tiempo real.

### Verification Agent
Analiza cada reporte antes de publicarlo. Asigna un nivel de confianza (unverified → official), detecta spam y banderas de alerta. Usa Claude Haiku para minimizar latencia.

### Matching Agent
Analiza solicitudes y ofertas disponibles y calcula automáticamente las mejores coincidencias por categoría, proximidad geográfica y urgencia.

### Analytics Agent
Genera insights sobre tendencias, cuellos de botella y acciones prioritarias basándose en las métricas del sistema.

---

## Configuración Rápida

### 1. Variables de entorno

```bash
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales de Supabase y Anthropic.

### 2. Base de datos

Ejecuta el archivo `supabase/migrations/001_initial.sql` en el SQL Editor de tu proyecto Supabase.

### 3. Desarrollo local

```bash
npm install
npm run dev
```

### 4. Deploy en Vercel

```bash
vercel deploy --prod
```

---

## Para desplegar en otro país

1. Edita **solo** `src/lib/disaster-config.ts`:

```typescript
const config: DisasterConfig = {
  id: "turkey-earthquake-2026",
  name: "Yardım Türkiye",
  country: "Türkiye",
  countryCode: "TR",
  flag: "🇹🇷",
  type: "earthquake",
  // ...fuentes oficiales, números de emergencia, regiones
};
```

2. Redeploy. El sistema completo se adapta automáticamente.

---

## Seguridad

- **Row Level Security** en Supabase — lectura pública, escritura controlada
- **Verificación por IA** — cada reporte es evaluado antes de publicarse
- **Rate limiting** — recomendado agregar Upstash Redis en producción
- **Sin datos sensibles en cliente** — service role key solo en servidor

---

## Fases del Roadmap

### Fase 1 — MVP (72h) ✅
- Landing, Dashboard, Mapa, Solicitudes, Ofertas, Voluntarios, Chat IA, Admin
- 4 agentes de IA (Información, Verificación, Matching, Analytics)
- API REST completa con datos demo
- Deploy en Vercel

### Fase 2 — Supabase Integration (Semana 1)
- Conectar DB real con Supabase
- Auth con Supabase (Google, email)
- Realtime subscriptions para actualizaciones en vivo
- Subida de fotos a Supabase Storage

### Fase 3 — Scale (Mes 1)
- WhatsApp Business API para reportes por WhatsApp
- PWA con Service Workers para modo offline
- Notificaciones push
- Mapa con clustering para zonas de alta densidad

### Fase 4 — Open Source (Mes 2)
- Documentación completa para contribuidores
- CLI para desplegar en nuevo país en < 5 minutos
- Integración con GDACS y otras APIs de desastres

---

## Números de Emergencia Venezuela

| Servicio | Número |
|---|---|
| Protección Civil Nacional | 0800-PCIVIL |
| Bomberos / Ambulancias | 171 |
| Cruz Roja | 0212-706-5555 |
| CICPC | 0800-2476 |

---

## Licencia

MIT — Código abierto para uso humanitario. Si lo usas en una emergencia real, menciona el proyecto.
