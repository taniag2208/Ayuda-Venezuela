import type { DisasterConfig } from "@/types";

// This file is the only thing that changes between deployments.
// Swap out this config to deploy for any disaster in any country.
const config: DisasterConfig = {
  id: "venezuela-earthquake-2026",
  name: "Ayuda Venezuela",
  country: "Venezuela",
  countryCode: "VE",
  flag: "🇻🇪",
  type: "earthquake",
  description:
    "Plataforma de coordinación de ayuda humanitaria para las víctimas del terremoto en Venezuela.",
  startDate: "2026-06-20",
  affectedRegions: [
    "Caracas",
    "Miranda",
    "Vargas",
    "Anzoátegui",
    "Bolívar",
    "Carabobo",
    "Aragua",
    "Lara",
    "Zulia",
  ],
  officialSources: [
    { name: "Protección Civil Venezuela", url: "https://proteccioncivil.gob.ve" },
    { name: "MPPRIJP", url: "https://mpprijp.gob.ve" },
    { name: "Cruz Roja Venezolana", url: "https://cruzrojavenezolana.org" },
    { name: "FUNVISIS", url: "https://www.funvisis.gob.ve" },
    { name: "UNHCR Venezuela", url: "https://www.acnur.org/venezuela" },
  ],
  emergencyNumbers: [
    { label: "Protección Civil Nacional", number: "0800-PCIVIL (724845)" },
    { label: "Bomberos", number: "171" },
    { label: "Ambulancias", number: "171" },
    { label: "Cruz Roja", number: "0212-706-5555" },
    { label: "CICPC", number: "0800-2476" },
  ],
  primaryColor: "#CF2233",
  accentColor: "#FFD700",
};

export default config;

export function getEmergencyTypeLabel(type: DisasterConfig["type"]): string {
  const labels = {
    earthquake: "Terremoto",
    flood: "Inundación",
    hurricane: "Huracán",
    wildfire: "Incendio Forestal",
    conflict: "Conflicto",
    other: "Emergencia",
  };
  return labels[type];
}
