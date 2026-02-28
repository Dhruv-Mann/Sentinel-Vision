/**
 * Auto-generated Supabase types placeholder.
 *
 * Replace this file with the real generated types by running:
 *   npx supabase gen types typescript --project-id <your-project-ref> > src/types/database.types.ts
 *
 * Or use the Supabase CLI:
 *   supabase gen types typescript --local > src/types/database.types.ts
 */

export interface Database {
  public: {
    Tables: {
      resumes: {
        Row: {
          id: string;
          user_id: string;
          file_url: string;
          title: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          file_url: string;
          title?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          file_url?: string;
          title?: string;
          created_at?: string;
        };
      };
      analytics_events: {
        Row: {
          id: string;
          resume_id: string;
          event_type: "view" | "scroll" | "exit";
          ip_address: string | null;
          city: string | null;
          country: string | null;
          device_type: string | null;
          duration_seconds: number;
          timestamp: string;
        };
        Insert: {
          id?: string;
          resume_id: string;
          event_type: "view" | "scroll" | "exit";
          ip_address?: string | null;
          city?: string | null;
          country?: string | null;
          device_type?: string | null;
          duration_seconds?: number;
          timestamp?: string;
        };
        Update: {
          id?: string;
          resume_id?: string;
          event_type?: "view" | "scroll" | "exit";
          ip_address?: string | null;
          city?: string | null;
          country?: string | null;
          device_type?: string | null;
          duration_seconds?: number;
          timestamp?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
