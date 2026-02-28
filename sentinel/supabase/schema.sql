-- ============================================================
-- Sentinel – Resume Analytics SaaS
-- Supabase SQL Schema (Postgres + Row Level Security)
-- ============================================================
-- Run this in Supabase SQL Editor (Dashboard → SQL → New Query)
-- ============================================================

-- Enable the uuid-ossp extension (already enabled on most Supabase projects)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. RESUMES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.resumes (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_url    TEXT NOT NULL,
  title       TEXT NOT NULL DEFAULT 'Untitled Resume',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast lookups by owner
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON public.resumes(user_id);

-- ============================================================
-- 2. ANALYTICS_EVENTS TABLE
-- ============================================================
-- Allowed event types are enforced via a CHECK constraint to
-- keep things simple without a separate enum migration.
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resume_id         UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
  event_type        TEXT NOT NULL CHECK (event_type IN ('view', 'scroll', 'exit')),
  ip_address        INET,                        -- stored as Postgres INET type
  city              TEXT,
  country           TEXT,
  device_type       TEXT,                         -- e.g. 'mobile', 'desktop', 'tablet'
  duration_seconds  INTEGER DEFAULT 0 CHECK (duration_seconds >= 0),
  timestamp         TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Composite index for querying events by resume + time
CREATE INDEX IF NOT EXISTS idx_analytics_resume_ts
  ON public.analytics_events(resume_id, timestamp DESC);

-- ============================================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- ---------- resumes ----------

ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

-- Owner can SELECT their own resumes
CREATE POLICY "Users can view own resumes"
  ON public.resumes
  FOR SELECT
  USING (auth.uid() = user_id);

-- Owner can INSERT resumes (user_id must match their auth id)
CREATE POLICY "Users can insert own resumes"
  ON public.resumes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Owner can UPDATE their own resumes
CREATE POLICY "Users can update own resumes"
  ON public.resumes
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Owner can DELETE their own resumes
CREATE POLICY "Users can delete own resumes"
  ON public.resumes
  FOR DELETE
  USING (auth.uid() = user_id);

-- ---------- analytics_events ----------

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Users can read analytics for resumes they own (via a sub-select)
CREATE POLICY "Users can view analytics for own resumes"
  ON public.analytics_events
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.resumes
      WHERE resumes.id = analytics_events.resume_id
        AND resumes.user_id = auth.uid()
    )
  );

-- INSERT is allowed for everyone (anonymous viewers trigger events).
-- The tracking endpoint will use the Supabase service-role key,
-- so this policy is intentionally permissive for inserts.
CREATE POLICY "Anyone can insert analytics events"
  ON public.analytics_events
  FOR INSERT
  WITH CHECK (true);

-- Only the resume owner can delete analytics events
CREATE POLICY "Users can delete analytics for own resumes"
  ON public.analytics_events
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.resumes
      WHERE resumes.id = analytics_events.resume_id
        AND resumes.user_id = auth.uid()
    )
  );

-- ============================================================
-- 4. STORAGE – "resumes" bucket
-- ============================================================
-- Create the bucket (run via Dashboard or Supabase CLI; SQL shown
-- for completeness – the storage schema may not be available in
-- all SQL editors, but this is the canonical command).
INSERT INTO storage.buckets (id, name, public)
  VALUES ('resumes', 'resumes', true)
  ON CONFLICT (id) DO NOTHING;

-- Authenticated users can upload to their own folder
CREATE POLICY "Users can upload own resumes"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'resumes'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Anyone can read (resumes are shared publicly via link)
CREATE POLICY "Public read access for resumes"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'resumes');

-- Owners can delete their own uploads
CREATE POLICY "Users can delete own resume files"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'resumes'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
