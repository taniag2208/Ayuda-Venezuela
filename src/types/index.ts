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
