import { Database } from "./database.types";

// Convenience aliases so components don't import the generated file directly
export type Resume = Database["public"]["Tables"]["resumes"]["Row"];
export type ResumeInsert = Database["public"]["Tables"]["resumes"]["Insert"];
export type ResumeUpdate = Database["public"]["Tables"]["resumes"]["Update"];

export type AnalyticsEvent = Database["public"]["Tables"]["analytics_events"]["Row"];
export type AnalyticsEventInsert = Database["public"]["Tables"]["analytics_events"]["Insert"];

export type EventType = "view" | "scroll" | "exit";
