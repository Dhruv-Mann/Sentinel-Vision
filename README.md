# 🎯 Sentinel-Vision – Resume Intelligence Platform

[![Live Demo](https://img.shields.io/badge/demo-online-green?logo=vercel&style=for-the-badge)](https://sentinel-vision-five.vercel.app)


> **Turn your resume into a data source.** Know exactly who's viewing your resume, where they're from, what device they're using, and how engaged they are. Real-time analytics for job seekers who want an unfair advantage.



[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
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

Sentinel embeds invisible tracking into your resume link. When someone opens your resume, you get actionable insights:

| Feature | Details |
|---------|---------|
| **👤 Viewer Identity** | Location, IP address, device type (mobile/desktop/tablet) |
| **⏱️ Engagement Time** | Exactly how long they spent reading your resume |
| **📊 Analytics Dashboard** | Review views, duration, location, and device trends |
| **🔐 Privacy-First** | No cookies, no personal data collection—just workplace insights |
| **📱 Responsive Design** | Track on any device, accessible anywhere |
| **⏰ Link Expiry** | Set custom expiry (1–7 months) or permanent links |
| **🛑 Kill Switch** | Instantly terminate any shared link with one click |
| **🎨 Distinctive UI** | Neo-brutalist visual system with custom UI primitives |

---

## 🏗️ Tech Stack (Production-Ready)

<table>
  <tr>
    <td><strong>Frontend</strong></td>
    <td>Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS 4</td>
  </tr>
  <tr>
    <td><strong>Backend</strong></td>
    <td>Next.js API Routes (serverless), Node.js</td>
  </tr>
  <tr>
    <td><strong>Database</strong></td>
    <td>Supabase (PostgreSQL)</td>
  </tr>
  <tr>
    <td><strong>Authentication</strong></td>
    <td>Supabase Auth (email/password, OTP verification/recovery)</td>
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
    <td>Reusable Badge/Button/Card/Input/Skeleton primitives, Lucide icons, CVA</td>
  </tr>
</table>

---

## 📊 How It Works

### For Job Seekers:
1. **Upload** your resume to Sentinel
2. **Share** the public link anywhere (LinkedIn, job applications, emails)
3. **Monitor** analytics on your dashboard
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
                                    │  • Browser + OS      │
                                    └──────────────────────┘
                                               │
                                               ▼
                                    ┌──────────────────────┐
                                    │  Store in Supabase   │
                                    │  (event logging)     │
                                    └──────────────────────┘
                                               │
                                               ▼
                                    ┌──────────────────────┐
                                    │ Job Seeker Dashboard │
                                    │ (analytics insights) │
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
- Identify which sections capture attention

### 🔒 **Privacy & Security**
- **Row-Level Security** ensures only you see your data
- **Service-role authentication** for trusted operations
- Designed to follow privacy-first principles
- No third-party trackers or ads

### ⏰ **Link Expiry & Kill Switch**
- Set link lifetime from 1–7 months, or permanent
- Instantly revoke any shared link with the kill switch
- Expired links show a clean "Link Expired" page

### 🎨 **Visual System**
- Clean, high-contrast neo-brutalist UI direction
- Consistent component primitives for inputs, cards, buttons, badges, and skeleton states
- Responsive layouts tuned for dashboard and public resume views

### ⚡ **Analytics Visibility**
- Dashboard summary for total views, average duration, and top-performing resumes
- Per-resume breakdown with exportable CSV reports

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm or yarn package manager
- Supabase account (free tier supported at [supabase.com](https://supabase.com))
- Vercel account (optional, for deployment at [vercel.com](https://vercel.com))

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

Create `sentinel/.env.local` (if it does not already exist):

Fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
# Optional: email view notifications
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL="Sentinel <onboarding@resend.dev>"
```

`RESEND_*` variables are optional and only needed for email notifications.

**4. Initialize the database**

In your Supabase dashboard, go to **SQL Editor** and run the full schema:

```sql
-- Copy contents of sentinel/supabase/schema.sql and paste here into SQL Editor
```

Or use the Supabase CLI:

```bash
cd sentinel
npm install -g supabase
supabase link --project-ref your_project_ref
supabase db push
```

**5. Run the development server**

```bash
npm run dev
# or if you're in the root directory:
cd sentinel && npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Project Architecture

```
src/
├── app/                              # Next.js App Router
│   ├── page.tsx                      # Hero landing page
│   ├── auth/
│   │   └── callback/route.ts         # Auth callback handler
│   ├── login/page.tsx                # Sign in/sign up/recovery flows
│   ├── dashboard/
│   │   ├── page.tsx                  # Dashboard with analytics stats
│   │   ├── layout.tsx                # Authenticated layout wrapper
│   │   └── resume/[id]/page.tsx      # Per-resume analytics detail
│   ├── view/[id]/page.tsx            # Public resume viewer (+ expiry check)
│   └── api/
│       └── track/route.ts            # Tracking beacon endpoint
│
├── components/
│   ├── navbar.tsx                    # Main navigation header
│   ├── pdf-viewer.tsx                # PDF resume renderer
│   ├── ui/
│   │   ├── badge.tsx                 # Badge primitive
│   │   ├── button.tsx                # Button primitive
│   │   ├── card.tsx                  # Card primitive
│   │   ├── input.tsx                 # Input primitive
│   │   └── skeleton.tsx              # Loading skeleton primitive
│   └── dashboard/
│       ├── resume-card.tsx           # Card with expiry picker & kill switch
│       └── upload-button.tsx         # Resume upload handler
│
├── hooks/
│   └── use-tracking.ts               # Tracking logic hook
│
├── lib/
│   ├── utils.ts                      # cn() helper (clsx + tailwind-merge)
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
| `slug` | TEXT | UNIQUE | Shareable URL slug |
| `notify_on_view` | BOOLEAN | DEFAULT true | Enable email notification on new views |
| `expires_at` | TIMESTAMPTZ | Nullable | Link expiry timestamp (null = permanent) |
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
| `browser` | TEXT | Nullable | Parsed browser name |
| `os` | TEXT | Nullable | Parsed operating system |
| `duration_seconds` | INTEGER | DEFAULT 0 | Time spent on resume |
| `timestamp` | TIMESTAMPTZ | DEFAULT now() | Event timestamp |

### 🔒 Row-Level Security (RLS)

**`resumes` Table:**
- ✅ Users can SELECT/INSERT/UPDATE/DELETE only their own resumes
- ✅ Public resume viewing is handled server-side via service-role access in `/view/[id]`

```sql
-- Enable on resumes table
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own resumes"
  ON resumes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own resumes"
  ON resumes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resumes"
  ON resumes FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own resumes"
  ON resumes FOR DELETE
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
  "browser": "Chrome",
  "os": "Windows",
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
- Uses Supabase Auth with email/password, email verification, and password recovery
- Session tokens managed securely via HTTP-only cookies
- Protected routes via middleware

### Data Privacy
- ✅ No personal data from viewers is stored (just metrics)
- ✅ No third-party advertising networks
- ✅ Built with privacy-first defaults
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
# Optional (email notifications)
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL="Sentinel <onboarding@resend.dev>"
```

---

## 📈 Growth Roadmap

### v1.0 (Current)
- ✅ Resume upload and sharing
- ✅ Real-time analytics dashboard
- ✅ Geolocation tracking
- ✅ Device detection
- ✅ Link expiry (1–7 months + permanent)
- ✅ Kill switch — instantly terminate shared links
- ✅ Email notification support for new views (optional via Resend)
- ✅ Reusable UI primitives and responsive layouts
- ✅ CSV export for analytics

### v1.1 (Planned)
- 📋 Advanced metrics (scroll depth, heatmaps)
- 🔔 Notification preferences (toggle and cadence controls)
- 📊 Export analytics as PDF

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
- **Email** dhruvmann139@gmail.com

---

## 🎓 What You'll Learn

Building Sentinel teaches you:

✅ **Modern Web Development**: Next.js 16, React 19, TypeScript 5  
✅ **Frontend System Design**: Reusable component primitives and consistent design tokens  
✅ **Database Design**: PostgreSQL, RLS policies, relational schemas  
✅ **Analytics Interfaces**: Charts, summaries, and export flows for resume engagement  
✅ **Full-Stack Development**: From frontend UI to backend logic  
✅ **Authentication & Security**: Service roles, data privacy  
✅ **Geolocation & Device Detection**: IP-based location, user-agent parsing  
✅ **Serverless Deployment**: Vercel and edge functions  
✅ **SaaS Product Development**: From concept to deployment

---

**Made with ❤️ by Dhruv Mann, for developers and job seekers.**

Give a ⭐ if you find this useful!

[⭐ Star on GitHub](https://github.com/Dhruv-Mann/Sentinel-Vision) | [🚀 Try the Live Demo](https://sentinel-vision-five.vercel.app)


