# Sentinel – Resume Analytics SaaS

Real-time analytics for shared resumes. Know **who** viewed your resume, from **where**, on **what device**, and for **how long**.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS |
| Auth + DB | Supabase (Auth + Postgres) |
| Hosting | Vercel Free Tier |
| Database | Supabase Free Tier |

## Project Structure

```
sentinel/
├── src/
│   ├── app/              # Next.js App Router pages & layouts
│   ├── lib/
│   │   ├── supabase.ts          # Browser (client component) Supabase client
│   │   ├── supabase-server.ts   # Server component / route handler client
│   │   └── supabase-admin.ts    # Service-role client (server only)
│   └── types/
│       ├── database.types.ts    # Supabase generated types (placeholder)
│       └── index.ts             # Convenience type aliases
├── supabase/
│   └── schema.sql               # Full DB schema + RLS policies
├── .env.local.example           # Required env vars template
└── ...
```

## Getting Started

### 1. Clone & Install

```bash
git clone <repo-url>
cd sentinel
npm install
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com).
2. Copy `.env.local.example` → `.env.local` and fill in your keys from **Settings → API**.
3. Open the **SQL Editor** in the Supabase Dashboard and run `supabase/schema.sql`.

### 3. Run Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database Schema

### `resumes`

| Column | Type | Notes |
|--------|------|-------|
| id | UUID (PK) | Auto-generated |
| user_id | UUID (FK → auth.users) | Owner |
| file_url | TEXT | Uploaded resume URL |
| title | TEXT | Default: "Untitled Resume" |
| created_at | TIMESTAMPTZ | Auto-set |

### `analytics_events`

| Column | Type | Notes |
|--------|------|-------|
| id | UUID (PK) | Auto-generated |
| resume_id | UUID (FK → resumes) | Links to resume |
| event_type | TEXT | `view` / `scroll` / `exit` |
| ip_address | INET | Viewer IP |
| city | TEXT | Geo-resolved city |
| country | TEXT | Geo-resolved country |
| device_type | TEXT | `mobile` / `desktop` / `tablet` |
| duration_seconds | INTEGER | Time on page |
| timestamp | TIMESTAMPTZ | Auto-set |

### Row Level Security

- **resumes**: Full CRUD restricted to the owning user (`auth.uid() = user_id`).
- **analytics_events SELECT/DELETE**: Only the resume owner can read or delete events (verified via join to `resumes`).
- **analytics_events INSERT**: Open – the tracking API endpoint uses the service-role key to write events on behalf of anonymous viewers.

## Free Tier Constraints

| Resource | Vercel Free | Supabase Free |
|----------|-------------|---------------|
| Bandwidth | 100 GB/mo | — |
| Serverless Fn | 100 GB-hrs | — |
| DB Size | — | 500 MB |
| Auth MAU | — | 50,000 |
| Edge Functions | — | 500K invocations |
| Storage | — | 1 GB |

The schema and architecture are designed to stay within these limits.

## License

MIT
