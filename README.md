# DayFlow — Daily Planner PWA

**Plan your day, own your life.** A simple, beautiful daily planner built with Next.js 14 and Supabase.

## ✨ Features

- ✅ **Task Management** — Create, edit, delete daily tasks
- 📂 **Categories** — Kerja, Pribadi, Kesehatan, Belajar, Lainnya
- 🔥 **Priority Levels** — High, Medium, Low
- 📅 **Calendar View** — Browse tasks by date
- 📊 **Dashboard & Stats** — Track your productivity
- 🌙 **Light/Dark Mode** — Toggle anytime
- 📱 **PWA** — Installable on mobile/desktop
- 🔔 **Push Notifications** — Task reminders (PWA)
- 🔒 **Offline Support** — Works without internet
- 🔐 **Auth** — Email/password authentication

## 🛠 Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Icons | Lucide React |
| Charts | Recharts |
| Deploy | Vercel |
| PWA | Service Worker |

## 📁 Project Structure

```
daily-planner/
├── public/
│   ├── manifest.json      # PWA manifest
│   ├── sw.js              # Service worker
│   ├── offline.html       # Offline fallback
│   └── icons/             # App icons
├── src/
│   ├── app/
│   │   ├── layout.tsx     # Root layout
│   │   ├── page.tsx       # Redirects to /today
│   │   ├── globals.css    # Global styles
│   │   ├── today/         # Today's tasks page
│   │   ├── calendar/      # Calendar view
│   │   ├── dashboard/     # Stats dashboard
│   │   ├── settings/      # Settings page
│   │   └── login/         # Auth page
│   ├── components/
│   │   ├── layout/        # Sidebar, Header, BottomNav
│   │   ├── tasks/         # TaskCard, TaskForm
│   │   ├── calendar/      # TaskCalendar
│   │   ├── stats/         # StatsCards
│   │   └── providers/    # ThemeProvider
│   ├── hooks/             # useTasks, useServiceWorker
│   ├── lib/
│   │   ├── supabase/      # Supabase client setup
│   │   └── types.ts       # TypeScript types
│   └── middleware.ts      # Auth middleware
├── supabase/
│   └── schema.sql         # Database schema
├── .env.example
├── tailwind.config.ts
└── package.json
```

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/Tole2404/DailyPlanner.git
cd DailyPlanner
npm install
```

### 2. Setup Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run `supabase/schema.sql`
3. Copy your **Project URL** and **anon key** from Settings → API
4. Add keys to `.env.local`

### 3. Setup Environment Variables

```bash
cp .env.example .env.local
# Fill in your Supabase credentials
```

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🌐 Deploy to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/DailyPlanner.git
git push -u origin main
```

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **Import Project**
3. Select your GitHub repo
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Click **Deploy**

Vercel auto-deploys on every push to `main`.

## 📱 Install as PWA

1. Open the app in Chrome/Safari on mobile
2. Tap **Add to Home Screen**
3. The app will appear as a native-like app

## 🔔 Push Notifications

Push notifications work when:
- PWA is installed
- User has granted notification permission
- Service worker is active

## 🎨 Design System

### Colors

| Token | Light | Dark |
|---|---|---|
| background | #F9F7F7 | #0F172A |
| surface | #DBE2EF | #1E293B |
| primary | #3F72AF | #60A5FA |
| text | #112D4E | #F1F5F9 |

### Categories

| Kategori | Warna |
|---|---|
| Kerja | #3F72AF |
| Pribadi | #A78BFA |
| Kesehatan | #6EE7B7 |
| Belajar | #FCD34D |
| Lainnya | #94A3B8 |

## 📄 License

MIT
