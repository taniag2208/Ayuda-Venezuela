// Auto-generated Supabase types — regenerate with: npm run db:types
// Manual baseline for MVP

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      requests: {
        Row: {
          id: string;
          title: string;
          description: string;
          category: string;
          status: string;
          urgency: number;
          location: string;
          lat: number | null;
          lng: number | null;
          people_count: number;
          contact: string;
          verification_level: string;
          user_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["requests"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["requests"]["Insert"]>;
      };
      offers: {
        Row: {
          id: string;
          title: string;
          description: string;
          category: string;
          status: string;
          location: string;
          lat: number | null;
          lng: number | null;
          quantity: string | null;
          contact: string;
          organization: string | null;
          verification_level: string;
          user_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["offers"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["offers"]["Insert"]>;
      };
      centers: {
        Row: {
          id: string;
          name: string;
          type: string;
          address: string;
          lat: number;
          lng: number;
          capacity: number | null;
          current_occupancy: number | null;
          contact: string | null;
          services: Json;
          schedule: string | null;
          verification_level: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["centers"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["centers"]["Insert"]>;
      };
      volunteers: {
        Row: {
          id: string;
          name: string;
          skills: Json;
          availability: string;
          location: string;
          lat: number | null;
          lng: number | null;
          contact: string;
          organization: string | null;
          languages: Json;
          verified: boolean;
          assigned_task: string | null;
          user_id: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["volunteers"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["volunteers"]["Insert"]>;
      };
      matches: {
        Row: {
          id: string;
          request_id: string;
          offer_id: string;
          score: number;
          reason: string;
          status: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["matches"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["matches"]["Insert"]>;
      };
      audit_logs: {
        Row: {
          id: string;
          action: string;
          table_name: string;
          record_id: string;
          user_id: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["audit_logs"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: never;
      };
    };
    Views: Record<never, never>;
    Functions: Record<never, never>;
    Enums: Record<never, never>;
  };
}
