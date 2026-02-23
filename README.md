# 🦜 Lingo — Language Learning App

A **Duolingo-inspired** language learning platform built with **Next.js 14**, **TypeScript**, **Drizzle ORM**, and **Clerk**. Lingo gamifies the process of learning new languages with hearts, XP, streaks, leaderboards, and an in-app shop — keeping learners motivated every step of the way.

🌐 **Live Demo:** [lingo-blond.vercel.app](https://lingo-blond.vercel.app)

---

## ✨ Features

- 🎓 **Gamified Lessons** — Interactive exercises with multiple question types
- ❤️ **Hearts System** — Lose hearts for wrong answers, restore them in the shop
- ⚡ **XP & Progression** — Earn XP to level up and unlock new content
- 🔥 **Streaks** — Daily streak tracking to build consistent learning habits
- 🏆 **Leaderboard** — Compete with other learners on a global XP leaderboard
- 🛒 **In-App Shop** — Spend gems to restore hearts or regain streak freezes
- 🌍 **Multiple Languages** — Support for several language courses
- 🔐 **Authentication** — Secure sign-in via Clerk with Google/GitHub OAuth
- 💾 **Persistent Progress** — All progress saved to PostgreSQL via Drizzle ORM
- 📱 **Responsive Design** — Fully optimized for mobile and desktop

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Authentication | Clerk |
| ORM | Drizzle ORM |
| Database | PostgreSQL (NeonDB) |
| State Management | Zustand |
| Styling | Tailwind CSS + shadcn/ui |
| Deployment | Vercel |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (e.g., [NeonDB](https://neon.tech) — free tier)
- [Clerk](https://clerk.com) account
- npm / yarn / pnpm

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/ARtoRiAs10/lingo.git
cd lingo

# 2. Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root (note: the repo already has `.env` — replace values):

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key
CLERK_SECRET_KEY=sk_test_your_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/learn
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/learn

# Database
DATABASE_URL=postgresql://user:password@host:5432/lingo

# Stripe (for Pro subscription, optional)
STRIPE_API_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_public_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Database Setup

```bash
# Push schema to your database
npx drizzle-kit push

# Seed the database with initial course data
npm run db:seed
```

### Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start learning!

---

## 📁 Project Structure

```
lingo/
├── action/              # Next.js server actions
│   ├── challenge-progress.ts
│   ├── user-progress.ts
│   └── user-subscription.ts
├── app/                 # Next.js App Router
│   ├── (main)/          # Main app layout
│   │   ├── learn/       # Active lesson page
│   │   ├── leaderboard/ # Leaderboard page
│   │   ├── quests/      # Quests & milestones
│   │   └── shop/        # Hearts & gems shop
│   ├── (marketing)/     # Landing page
│   ├── admin/           # Admin panel (course builder)
│   ├── api/             # API routes (Stripe webhooks)
│   └── lesson/          # Lesson quiz interface
├── components/          # Reusable UI components
│   ├── modals/          # Hearts, Practice, Exit modals
│   └── ui/              # shadcn/ui components
├── config/              # App-level config
├── db/                  # Drizzle schema & DB client
│   └── schema.ts        # Full database schema
├── lib/                 # Utility functions & helpers
├── scripts/             # DB seed scripts
│   └── seed.ts          # Course & lesson seeder
├── store/               # Zustand global state
├── constants.ts         # App-wide constants
├── drizzle.config.ts    # Drizzle ORM config
└── middleware.ts        # Clerk auth middleware
```

---

## 🗃️ Database Schema

The app uses the following core tables via Drizzle ORM:

- `courses` — Available languages (Spanish, French, etc.)
- `units` — Grouped sets of lessons per course
- `lessons` — Individual lessons inside a unit
- `challenges` — Questions inside a lesson (SELECT, ASSIST types)
- `challengeOptions` — Answer choices per challenge
- `challengeProgress` — Tracks which challenges a user has completed
- `userProgress` — Hearts, XP, active course per user
- `userSubscription` — Stripe subscription status

---

## 🤝 Contributing

1. Fork the repository
2. Create your branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'feat: add new feature'`
4. Push: `git push origin feature/new-feature`
5. Open a Pull Request

---

## 📄 License

This project is open source. See the repository for license details.
