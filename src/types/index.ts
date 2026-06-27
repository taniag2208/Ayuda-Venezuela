export type RequestStatus = "pending" | "in_progress" | "fulfilled" | "cancelled";
export type OfferStatus = "available" | "reserved" | "delivered" | "expired";
export type VerificationLevel = "unverified" | "low" | "medium" | "high" | "official";
export type UserRole = "citizen" | "volunteer" | "coordinator" | "admin" | "organization";
export type EmergencyType = "earthquake" | "flood" | "hurricane" | "wildfire" | "conflict" | "other";
export type NeedCategory =
  | "water"
  | "food"
  | "shelter"
  | "medical"
  | "transport"
  | "rescue"
  | "clothing"
  | "energy"
  | "communication"
  | "psychological"
  | "other";

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface Request {
  id: string;
  title: string;
  description: string;
  category: NeedCategory;
  status: RequestStatus;
  urgency: 1 | 2 | 3 | 4 | 5;
  location: string;
  coordinates?: GeoPoint;
  people_count: number;
  contact: string;
  verification_level: VerificationLevel;
  created_at: string;
  updated_at: string;
  user_id?: string;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  category: NeedCategory;
  status: OfferStatus;
  location: string;
  coordinates?: GeoPoint;
  quantity?: string;
  contact: string;
  organization?: string;
  verification_level: VerificationLevel;
  created_at: string;
  updated_at: string;
  user_id?: string;
}

export interface Center {
  id: string;
  name: string;
  type: "shelter" | "medical" | "food" | "distribution" | "coordination";
  address: string;
  coordinates: GeoPoint;
  capacity?: number;
  current_occupancy?: number;
  contact?: string;
  services: string[];
  schedule?: string;
  verification_level: VerificationLevel;
  is_active: boolean;
  created_at: string;
}

export interface Volunteer {
  id: string;
  name: string;
  skills: string[];
  availability: "immediate" | "today" | "this_week" | "flexible";
  location: string;
  coordinates?: GeoPoint;
  contact: string;
  organization?: string;
  languages: string[];
  verified: boolean;
  assigned_task?: string;
  created_at: string;
}

export interface Match {
  request_id: string;
  offer_id: string;
  score: number;
  reason: string;
  created_at: string;
}

export interface Stats {
  total_requests: number;
  fulfilled_requests: number;
  total_offers: number;
  active_volunteers: number;
  active_centers: number;
  people_helped: number;
  matches_made: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: string[];
  timestamp: Date;
}

// ─── FAMILY REUNIFICATION ────────────────────────────────────────────────────

export type FamilyReportStatus =
  | "searching"
  | "possible_match"
  | "verified"
  | "reunited"
  | "closed"
  | "archived";

export type SexType = "male" | "female" | "other" | "unknown";
export type HealthStatus = "good" | "injured" | "critical" | "unknown";
export type LocationType = "hospital" | "shelter" | "care_center" | "home" | "other";
export type MatchStatus = "suggested" | "pending_consent" | "accepted" | "rejected" | "reunited";

export interface MissingPersonReport {
  id: string;
  full_name: string;
  alias?: string;
  age_approx: number;
  sex: SexType;
  photo_url?: string;
  languages: string[];
  country: string;
  state: string;
  city: string;
  address_approx?: string;
  lat?: number;
  lng?: number;
  last_seen_at: string;
  last_seen_place: string;
  height_cm?: number;
  hair_color?: string;
  eye_color?: string;
  clothing_description?: string;
  distinguishing_marks?: string;
  tattoos?: string;
  scars?: string;
  // Medical info — never exposed publicly
  allergies?: string;
  disability?: string;
  medications?: string;
  medical_conditions?: string;
  // Reporter info — revealed only after mutual consent
  reporter_name: string;
  reporter_relationship: string;
  reporter_email: string;
  reporter_phone?: string;
  reporter_whatsapp?: string;
  status: FamilyReportStatus;
  created_at: string;
  updated_at: string;
}

export interface SurvivorReport {
  id: string;
  full_name: string;
  age_approx?: number;
  photo_url?: string;
  current_location: string;
  location_type: LocationType;
  location_name?: string;
  lat?: number;
  lng?: number;
  health_status: HealthStatus;
  needs_help: boolean;
  message_for_family?: string;
  consent_to_be_found: boolean;
  show_email: boolean;
  show_phone: boolean;
  show_whatsapp: boolean;
  // Contact — only shared after consent
  email?: string;
  phone?: string;
  whatsapp?: string;
  status: FamilyReportStatus;
  created_at: string;
  updated_at: string;
}

export interface FamilyMatch {
  id: string;
  missing_report_id: string;
  survivor_report_id: string;
  score: number;
  match_reasons: string[];
  status: MatchStatus;
  missing_side_consent: boolean;
  survivor_side_consent: boolean;
  created_at: string;
  updated_at: string;
}

export interface FamilyStats {
  total_missing: number;
  total_survivors: number;
  total_matches: number;
  verified_matches: number;
  reunited_count: number;
  active_searches: number;
}

export type MissingPersonPublic = Omit<
  MissingPersonReport,
  | "allergies"
  | "disability"
  | "medications"
  | "medical_conditions"
  | "reporter_email"
  | "reporter_phone"
  | "reporter_whatsapp"
  | "lat"
  | "lng"
  | "address_approx"
>;

export type SurvivorPublic = Omit<SurvivorReport, "email" | "phone" | "whatsapp" | "lat" | "lng">;

// ─────────────────────────────────────────────────────────────────────────────

export interface DisasterConfig {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  flag: string;
  type: EmergencyType;
  description: string;
  startDate: string;
  affectedRegions: string[];
  officialSources: { name: string; url: string }[];
  emergencyNumbers: { label: string; number: string }[];
  primaryColor: string;
  accentColor: string;
}
