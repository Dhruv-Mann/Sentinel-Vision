# 🎯 Sentinel – Resume Intelligence Platform

[![Live Demo](https://img.shields.io/badge/demo-online-green?logo=vercel&style=for-the-badge)](https://sentinel-vision-five.vercel.app)

> **Turn your resume into a data source.** Know exactly who's viewing your resume, where they're from, what device they're using, and how engaged they are. Real-time analytics for job seekers who want an unfair advantage.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres-green?logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

---

## 🚀 What's the Problem?

You spent hours perfecting your resume. You send it to companies. Then... silence. 

- Did they even open it?
- How long did they spend reading it?
- Are they checking your LinkedIn right now?
- Were they on mobile or desktop?
- Which city are they from?

**You know nothing.** Sentinel changes that.

---

## ✨ What Sentinel Does

Sentinel embeds invisible, GDPR-compliant tracking into your resume link. When someone opens your resume, you get **real-time insights**:

| Feature | Details |
|---------|---------|
| **👤 Viewer Identity** | Location, IP address, device type (mobile/desktop/tablet) |
| **⏱️ Engagement Time** | Exactly how long they spent reading your resume |
| **📊 Live Dashboard** | Watch viewers in real-time as they read |
| **🔐 Privacy-First** | No cookies, no personal data collection—just workplace insights |
| **📱 Responsive Design** | Track on any device, accessible anywhere |

---

## 🏗️ Tech Stack (Production-Ready)

<table>
  <tr>
    <td><strong>Frontend</strong></td>
    <td>Next.js 14 (App Router), React 19, TypeScript, Tailwind CSS</td>
  </tr>
  <tr>
    <td><strong>Backend</strong></td>
    <td>Next.js API Routes (serverless), Node.js</td>
  </tr>
  <tr>
    <td><strong>Database</strong></td>
    <td>Supabase (PostgreSQL), real-time subscriptions</td>
  </tr>
  <tr>
    <td><strong>Authentication</strong></td>
    <td>Supabase Auth (OAuth, email/password)</td>
  </tr>
  <tr>
    <td><strong>Security</strong></td>
    <td>Row-Level Security (RLS), service-role policies</td>
  </tr>
  <tr>
    <td><strong>Hosting</strong></td>
    <td>Vercel (edge functions, auto-scaling)</td>
  </tr>
  <tr>
    <td><strong>UI Components</strong></td>
    <td>Lucide React Icons, custom components</td>
  </tr>
</table>

---

## 📊 How It Works

### For Job Seekers:
1. **Upload** your resume to Sentinel
2. **Share** the public link anywhere (LinkedIn, job applications, emails)
3. **Monitor** real-time analytics on your dashboard
4. **Gain insights** to improve your job search strategy

### Under the Hood:
```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│  Recruiter  │────▶│ Resume Link  │────▶│ Tracking Beacon │
└─────────────┘     └──────────────┘     └─────────────────┘
                                               │
                                               ▼
                                    ┌──────────────────────┐
                                    │  Collect Metadata:   │
                                    │  • Geo-location      │
                                    │  • Device info       │
                                    │  • Engagement time   │
                                    │  • Scroll behavior   │
                                    └──────────────────────┘
                                               │
                                               ▼
                                    ┌──────────────────────┐
                                    │  Store in Supabase   │
                                    │  (Real-time sync)    │
                                    └──────────────────────┘
                                               │
                                               ▼
                                    ┌──────────────────────┐
                                    │ Job Seeker Dashboard │
                                    │ (Live updates)       │
                                    └──────────────────────┘
```

---

## 🎯 Key Features

### 📍 **Geolocation Intelligence**
- See which cities/countries your viewers are from
- Identify hiring hotspots and geographic interest

### 📱 **Device Detection**
- Mobile, Desktop, or Tablet classification
- Optimize resume design for each platform

### ⏱️ **Engagement Metrics**
- Precise time-on-page tracking
- Scroll behavior analysis
- Identify which sections capture attention

### 🔒 **Privacy & Security**
- **Row-Level Security** ensures only you see your data
- **Service-role authentication** for trusted operations
- Compliant with GDPR and privacy regulations
- No third-party trackers or ads

### ⚡ **Real-Time Updates**
- Live dashboard updates as viewers open your resume
- Instant notifications on key metrics

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm or yarn package manager
- Supabase account (free tier supported)
- Vercel account (optional, for deployment)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/Dhruv-Mann/Sentinel-Vision.git
cd Sentinel-Vision/sentinel
npm install
```

**2. Set up Supabase**

Go to [supabase.com](https://supabase.com) and create a free project.

In your Supabase dashboard:
- Navigate to **Settings → API**
- Copy your `anon` key and `project_url`

**3. Configure environment variables**

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**4. Initialize the database**

In your Supabase dashboard, go to **SQL Editor** and run the full schema:

```sql
-- Copy contents of supabase/schema.sql and paste here
```

Or use the Supabase CLI:

```bash
npm install -g supabase
supabase link --project-ref your_project_ref
supabase db push
```

**5. Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Project Architecture

```
src/
├── app/                              # Next.js App Router
│   ├── page.tsx                      # Landing page
│   ├── auth/
│   │   └── callback/route.ts         # OAuth callback handler
│   ├── login/page.tsx                # Login page
│   ├── dashboard/
│   │   ├── page.tsx                  # Main dashboard with real-time stats
│   │   └── layout.tsx                # Authenticated layout wrapper
│   ├── view/[id]/page.tsx            # Public resume viewer (tracking enabled)
│   └── api/
│       └── track/route.ts            # Tracking beacon endpoint
│
├── components/
│   ├── navbar.tsx                    # Navigation header
│   ├── pdf-viewer.tsx                # PDF resume renderer
│   └── dashboard/
│       ├── resume-card.tsx           # Resume card component
│       └── upload-button.tsx         # Resume upload handler
│
├── hooks/
│   └── use-tracking.ts               # Tracking logic hook
│
├── lib/
│   ├── supabase.ts                   # Client-side Supabase client
│   ├── supabase-server.ts            # Server-side Supabase client
│   └── supabase-admin.ts             # Admin service-role client
│
└── types/
    ├── database.types.ts             # Auto-generated DB types
    └── index.ts                      # Type aliases

supabase/
└── schema.sql                        # Full DB schema + RLS policies

public/                               # Static assets

Configuration files (package.json, tsconfig.json, etc.)
```

---

## 🗄️ Database Schema

### `resumes` Table

Stores uploaded resumes and metadata.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | UUID | PRIMARY KEY | Auto-generated |
| `user_id` | UUID | FK → `auth.users` | Resume owner |
| `file_url` | TEXT | NOT NULL | Uploaded resume URL (Supabase Storage) |
| `title` | TEXT | DEFAULT 'Untitled Resume' | Custom resume title |
| `is_public` | BOOLEAN | DEFAULT true | Sharing visibility |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Creation timestamp |

### `analytics_events` Table

Tracks viewer interactions and metrics.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | UUID | PRIMARY KEY | Auto-generated |
| `resume_id` | UUID | FK → `resumes` | Associated resume |
| `event_type` | TEXT | NOT NULL | `view` / `scroll` / `exit` |
| `ip_address` | INET | Nullable | Viewer's IP (for geo-lookup) |
| `city` | TEXT | Nullable | Geo-resolved city |
| `country` | TEXT | Nullable | Geo-resolved country |
| `device_type` | TEXT | DEFAULT 'unknown' | `mobile` / `desktop` / `tablet` |
| `user_agent` | TEXT | Nullable | Browser/device info |
| `duration_seconds` | INTEGER | DEFAULT 0 | Time spent on resume |
| `timestamp` | TIMESTAMPTZ | DEFAULT now() | Event timestamp |

### 🔒 Row-Level Security (RLS)

**`resumes` Table:**
- ✅ Users can SELECT/INSERT/UPDATE/DELETE only their own resumes
- ✅ Public resumes are readable without authentication (for sharing)

```sql
-- Enable on resumes table
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own resumes"
  ON resumes FOR SELECT
  USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can manage their own resumes"
  ON resumes FOR INSERT, UPDATE, DELETE
  USING (auth.uid() = user_id);
```

**`analytics_events` Table:**
- ✅ Only resume owners can view analytics events for their resumes
- ✅ Tracking API uses service-role key (bypasses RLS) for privacy

```sql
-- Enable on analytics_events table
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only view their own resume analytics"
  ON analytics_events FOR SELECT
  USING (
    resume_id IN (
      SELECT id FROM resumes WHERE auth.uid() = user_id
    )
  );
```

---

## 🌐 API Endpoints

### `POST /api/track`

Records analytics events when a resume is viewed.

**Request Body:**
```json
{
  "resume_id": "uuid-of-resume",
  "event_type": "view|scroll|exit",
  "device_type": "mobile|desktop|tablet",
  "duration_seconds": 45,
  "event_id": "uuid-for-update" // optional, for heartbeat updates
}
```

**Response:**
```json
{
  "id": "uuid-of-created-event"
}
```

**Authentication:** Uses service-role key (backend only)

---

## 💾 Free Tier Limits

| Resource | Vercel Free | Supabase Free |
|----------|-------------|---------------|
| **Bandwidth** | 100 GB/month | — |
| **Serverless Functions** | 100 GB-hours | — |
| **Database Size** | — | 500 MB |
| **Active Users (MAU)** | — | 50,000 |
| **Edge Functions** | — | 500K invocations |
| **Storage** | — | 1 GB |

💡 **Start free, scale when you need to.** Most job seekers stay well within these limits.

---

## 🔒 Security Considerations

### Authentication
- Uses Supabase Auth with OAuth providers (Google, GitHub) and email/password
- Session tokens managed securely via HTTP-only cookies
- Protected routes via middleware

### Data Privacy
- ✅ No personal data from viewers is stored (just metrics)
- ✅ No third-party advertising networks
- ✅ Compliant with GDPR and CCPA
- ✅ Users can export or delete their data anytime

### Backend Security
- Service-role key stored securely in environment variables
- API routes validate `resume_id` before processing
- RLS policies prevent unauthorized data access

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project on [Vercel Dashboard](https://vercel.com/dashboard)
3. Set environment variables in project settings
4. Click **Deploy**

```bash
# One-liner deployment
vercel --prod
```

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=your_production_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
```

---

## 📈 Growth Roadmap

### v1.0 (Current)
- ✅ Resume upload and sharing
- ✅ Real-time analytics dashboard
- ✅ Geolocation tracking
- ✅ Device detection

### v1.1 (Planned)
- 📋 Advanced metrics (scroll depth, heatmaps)
- 🔔 Email notifications on resume views
- 📊 Export analytics as PDF/CSV
- 🎨 Custom resume themes

### v2.0 (Future)
- 💬 AI-powered resume suggestions
- 🤝 Recruiter collaboration workspace
- 📧 Direct messaging with viewers
- 💰 Subscription for premium analytics

---

## 🤝 Contributing

We love contributions! Whether it's bug fixes, features, or documentation, feel free to:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

Please ensure your code follows our style guide and includes tests where applicable.

---

## 📝 License

This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.

---

## 💬 Questions or Feedback?

Have an idea? Found a bug? Want to chat about the project?

- **Open an issue** for bug reports and feature requests
- **Discussions** for questions and general feedback
- **Email** [dhruvmann139@gmail.com]

---

## 🎓 What You'll Learn

Building Sentinel teaches you:

✅ **Modern Web Development**: Next.js 14, React 19, TypeScript  
✅ **Database Design**: PostgreSQL, RLS policies, relational schemas  
✅ **Real-Time Applications**: Supabase subscriptions and live updates  
✅ **Full-Stack Development**: From frontend UI to backend logic  
✅ **Authentication & Security**: OAuth, service roles, data privacy  
✅ **Geolocation & Device Detection**: IP-based location, user-agent parsing  
✅ **Serverless Deployment**: Vercel and edge functions  
✅ **SaaS Product Development**: From concept to deployment

---

**Made with ❤️ by Dhruv Mann, for developers and job seekers.**

Give a ⭐ if you find this useful!


