/**
 * In-memory store for Family Reunification module.
 * Replace with Supabase calls in production.
 */

import type { MissingPersonReport, SurvivorReport, FamilyMatch, FamilyStats } from "@/types";

// ─── Seed Data ────────────────────────────────────────────────────────────────

const seedMissing: MissingPersonReport[] = [
  {
    id: "mp-001",
    full_name: "Carmen Beatriz Rodríguez",
    alias: "Carmencita",
    age_approx: 58,
    sex: "female",
    languages: ["Español"],
    country: "Venezuela",
    state: "Miranda",
    city: "Petare",
    last_seen_at: "2026-06-20T14:30:00Z",
    last_seen_place: "Mercado de Petare, cerca del Metro",
    hair_color: "Negro con canas",
    eye_color: "Café oscuro",
    clothing_description: "Vestido floreado azul y blanco, cartera marrón",
    height_cm: 158,
    reporter_name: "José Rodríguez",
    reporter_relationship: "Hijo",
    reporter_email: "jose.rodriguez@example.com",
    reporter_phone: "+58 412 555-0001",
    reporter_whatsapp: "+58 412 555-0001",
    status: "searching",
    created_at: "2026-06-20T16:45:00Z",
    updated_at: "2026-06-20T16:45:00Z",
  },
  {
    id: "mp-002",
    full_name: "Andrés Miguel Castillo López",
    alias: "El Chamo",
    age_approx: 17,
    sex: "male",
    languages: ["Español"],
    country: "Venezuela",
    state: "Caracas",
    city: "El Valle",
    last_seen_at: "2026-06-20T13:00:00Z",
    last_seen_place: "Colegio Simón Bolívar, El Valle",
    hair_color: "Negro",
    eye_color: "Café",
    clothing_description: "Uniforme escolar gris y azul marino, mochila negra",
    height_cm: 172,
    reporter_name: "María López de Castillo",
    reporter_relationship: "Madre",
    reporter_email: "maria.castillo@example.com",
    reporter_whatsapp: "+58 416 555-0002",
    status: "possible_match",
    created_at: "2026-06-20T15:30:00Z",
    updated_at: "2026-06-21T09:00:00Z",
  },
  {
    id: "mp-003",
    full_name: "Roberto José Pérez Guzmán",
    age_approx: 72,
    sex: "male",
    languages: ["Español"],
    country: "Venezuela",
    state: "Vargas",
    city: "La Guaira",
    last_seen_at: "2026-06-20T11:00:00Z",
    last_seen_place: "Avenida La Armada, La Guaira",
    hair_color: "Blanco",
    eye_color: "Verde",
    height_cm: 168,
    disability: "Diabetes tipo 2",
    medications: "Metformina 850mg",
    reporter_name: "Ana Guzmán de Pérez",
    reporter_relationship: "Esposa",
    reporter_email: "ana.guzman@example.com",
    reporter_phone: "+58 414 555-0003",
    status: "searching",
    created_at: "2026-06-20T14:00:00Z",
    updated_at: "2026-06-20T14:00:00Z",
  },
];

const seedSurvivors: SurvivorReport[] = [
  {
    id: "sv-001",
    full_name: "Andrés Castillo",
    age_approx: 17,
    current_location: "Albergue Poliedro de Caracas",
    location_type: "shelter",
    location_name: "Albergue Poliedro de Caracas",
    health_status: "good",
    needs_help: false,
    message_for_family: "Estoy bien, no se preocupen. Los buscaré cuando pueda comunicarme.",
    consent_to_be_found: true,
    show_whatsapp: true,
    show_email: false,
    show_phone: false,
    whatsapp: "+58 412 555-0099",
    status: "possible_match",
    created_at: "2026-06-21T08:00:00Z",
    updated_at: "2026-06-21T09:00:00Z",
  },
  {
    id: "sv-002",
    full_name: "Luisa Fernanda Torres",
    age_approx: 34,
    current_location: "Hospital Universitario de Caracas",
    location_type: "hospital",
    location_name: "Hospital Universitario de Caracas",
    health_status: "injured",
    needs_help: true,
    message_for_family: "Estoy en el HUC, cuarto piso, sala de traumatología. Vengan a buscarme.",
    consent_to_be_found: true,
    show_phone: true,
    show_whatsapp: true,
    show_email: false,
    phone: "+58 424 555-0004",
    whatsapp: "+58 424 555-0004",
    status: "searching",
    created_at: "2026-06-20T20:00:00Z",
    updated_at: "2026-06-20T20:00:00Z",
  },
];

const seedMatches: FamilyMatch[] = [
  {
    id: "fm-001",
    missing_report_id: "mp-002",
    survivor_report_id: "sv-001",
    score: 91.5,
    match_reasons: [
      "Mismo nombre: Andrés Castillo (alta coincidencia)",
      "Edad compatible: 17 años",
      "Misma ciudad de referencia: Caracas",
      "Último avistamiento compatible con ruta al albergue",
    ],
    status: "pending_consent",
    missing_side_consent: false,
    survivor_side_consent: true,
    created_at: "2026-06-21T09:00:00Z",
    updated_at: "2026-06-21T09:00:00Z",
  },
];

// ─── Store ────────────────────────────────────────────────────────────────────

const missingStore: MissingPersonReport[] = [...seedMissing];
const survivorStore: SurvivorReport[] = [...seedSurvivors];
const matchStore: FamilyMatch[] = [...seedMatches];

export const familyStore = {
  // Missing persons
  getAllMissing: (): MissingPersonReport[] => [...missingStore],

  getMissingById: (id: string): MissingPersonReport | undefined =>
    missingStore.find((r) => r.id === id),

  addMissing: (report: MissingPersonReport): MissingPersonReport => {
    missingStore.push(report);
    return report;
  },

  updateMissing: (id: string, update: Partial<MissingPersonReport>): MissingPersonReport | null => {
    const idx = missingStore.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    missingStore[idx] = { ...missingStore[idx], ...update, updated_at: new Date().toISOString() };
    return missingStore[idx];
  },

  // Survivors
  getAllSurvivors: (): SurvivorReport[] => [...survivorStore],

  getSurvivorById: (id: string): SurvivorReport | undefined =>
    survivorStore.find((r) => r.id === id),

  addSurvivor: (report: SurvivorReport): SurvivorReport => {
    survivorStore.push(report);
    return report;
  },

  updateSurvivor: (id: string, update: Partial<SurvivorReport>): SurvivorReport | null => {
    const idx = survivorStore.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    survivorStore[idx] = { ...survivorStore[idx], ...update, updated_at: new Date().toISOString() };
    return survivorStore[idx];
  },

  // Matches
  getAllMatches: (): FamilyMatch[] => [...matchStore],

  getMatchById: (id: string): FamilyMatch | undefined => matchStore.find((m) => m.id === id),

  getMatchesForMissing: (missingId: string): FamilyMatch[] =>
    matchStore.filter((m) => m.missing_report_id === missingId),

  getMatchesForSurvivor: (survivorId: string): FamilyMatch[] =>
    matchStore.filter((m) => m.survivor_report_id === survivorId),

  addMatch: (match: FamilyMatch): FamilyMatch => {
    const exists = matchStore.find(
      (m) =>
        m.missing_report_id === match.missing_report_id &&
        m.survivor_report_id === match.survivor_report_id
    );
    if (exists) return exists;
    matchStore.push(match);
    return match;
  },

  updateMatch: (id: string, update: Partial<FamilyMatch>): FamilyMatch | null => {
    const idx = matchStore.findIndex((m) => m.id === id);
    if (idx === -1) return null;
    matchStore[idx] = { ...matchStore[idx], ...update, updated_at: new Date().toISOString() };
    return matchStore[idx];
  },

  // Stats
  getStats: (): FamilyStats => ({
    total_missing: missingStore.filter((r) => !["closed", "archived"].includes(r.status)).length,
    total_survivors: survivorStore.filter((r) => !["closed", "archived"].includes(r.status)).length,
    total_matches: matchStore.length,
    verified_matches: matchStore.filter((m) => ["accepted", "reunited"].includes(m.status)).length,
    reunited_count: matchStore.filter((m) => m.status === "reunited").length,
    active_searches: missingStore.filter((r) => r.status === "searching").length,
  }),
};
