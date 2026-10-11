# NXTSTEP 🚀
> **AI-Powered Career Intelligence & Interactive Roadmap Platform**
>
> 🌐 **Live Demo:** [nxtstep31.vercel.app](https://nxtstep31.vercel.app)

---

## 📖 Overview

**NXTSTEP** is a modern, full-stack career navigation platform engineered to help students and early-career professionals discover, evaluate, and pursue modern career pathways. By combining an adaptive assessment engine, real-time Gemini LLM streaming, real-world industry benchmarks, and curated course trajectories, NXTSTEP transforms abstract career goals into actionable, milestone-driven roadmaps.

---

## ✨ Features

- 🎯 **Dynamic Career Assessment Quiz**: Multi-step interactive evaluation analyzing student interests, problem-solving tendencies, work style, and aspirations.
- ⚡ **Dual Recommender Architecture (AI + Local Fallback)**:
  - **Online**: Powered by Google Gemini (`@google/generative-ai`) with RAG context over real-world job roles and course directories.
  - **Offline/Resilient**: Zero-downtime heuristic scoring algorithm that instantly delivers ranked recommendations if API limits or network issues occur.
- 🗺️ **Real-time Streaming Roadmaps**: Generates personalized 5-stage career milestones with live token streaming and instant local backup (`localStorage`).
- 🤖 **Interactive Milestone Coach**: In-roadmap contextual AI mentor answering questions, providing weekly study schedules, and helping conquer specific milestones.
- 💬 **AI Guidance Chatbot (Nova)**: Persistent guidance assistant grounded in career intelligence, salary trends, and skill benchmarks.
- 📊 **Progress Command Center (Student Dashboard)**:
  - Track active roadmap milestones with visual progress indicators.
  - Bookmark favorite career paths with optimistic UI toggles.
  - Smooth skeleton loader states eliminating flash of empty content (FOUC).
- 🔐 **Dual Auth & Storage Pipeline**:
  - **Firebase Authentication**: Secure Google OAuth and Email/Password flows, self-healing password resets, and JWT verification via Firebase Admin SDK.
  - **Supabase PostgreSQL / Firestore**: Scalable user preference tracking and saved roadmaps.
- 🎨 **Adaptive Neobrutalist UI**: Custom dark/light mode engine powered by Tailwind CSS, smooth micro-interactions, tilt cards, and scroll animations.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Framework** | [Next.js 15 (App Router)](https://nextjs.org/) + Turbopack |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Frontend & UI** | [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/), [Lucide React](https://lucide.dev/), `next-themes` |
| **AI & LLM** | [Google Gemini API](https://ai.google.dev/) (`@google/generative-ai`), Gemini Flash models |
| **Auth & Security** | [Firebase Auth v12](https://firebase.google.com/), [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup) |
| **Database & Storage** | [Supabase](https://supabase.com/) (`@supabase/supabase-js`), Cloud Firestore |
| **Hosting & CI/CD** | [Vercel](https://vercel.com/) |

---

## 📂 Project Architecture

The project adheres to a refined **Feature-Sliced Design (FSD)** paradigm inside `src/`, establishing a clean boundary between framework routes, feature business logic, shared UI primitives, and infrastructure libraries.

```
nxtstep/
├── src/
│   ├── app/                          # Next.js App Router (Routes & Layouts only)
│   │   ├── api/                      # Backend API Route Handlers
│   │   │   ├── chat/                 # AI chatbot streaming endpoint
│   │   │   ├── quiz/                 # Career quiz recommendation endpoints
│   │   │   ├── roadmap/              # AI roadmap streaming, coach, and persistence
│   │   │   └── user/                 # Profile & saved career bookmarks
│   │   ├── contact/                  # Contact & support page
│   │   ├── dashboard/                # Progress Command Center (Student Dashboard)
│   │   ├── forgot/                   # Password reset request page
│   │   ├── landing/                  # Product landing page
│   │   ├── login/                    # User authentication (Login)
│   │   ├── options/                  # Career explorer & catalog
│   │   ├── profile/                  # User profile settings
│   │   ├── quiz/                     # Assessment quiz route
│   │   ├── reset-password/           # Password recovery handler
│   │   ├── signup/                   # User registration
│   │   ├── layout.tsx                # Global root layout & theme provider
│   │   └── page.tsx                  # Root redirect & home view
│   ├── components/                   # Shared presentation primitives
│   │   └── ui/                       # Reusable UI widgets (Navbar, ConfirmModal, etc.)
│   ├── features/                     # Domain-driven feature modules
│   │   ├── quiz/                     # Quiz engine domain
│   │   │   └── components/           # AssessmentQuiz, CareerCard, RecommendationsModal, etc.
│   │   └── roadmap/                  # Roadmap engine domain
│   │       └── components/           # InteractiveRoadmap, StreamingRoadmap
│   ├── lib/                          # Core configurations & client initializations
│   │   ├── data/                     # Career datasets, market intelligence & courses
│   │   ├── firebase.ts               # Client-side Firebase configuration
│   │   ├── firebase-admin.ts         # Server-side Firebase Admin token verification
│   │   ├── gemini.ts                 # Google Gemini SDK setup & prompt orchestration
│   │   └── supabase.ts               # Supabase database client
│   ├── services/                     # External service abstractions
│   │   └── aiService.ts              # LLM client interface layer
│   └── utils/                        # Global helpers & algorithmic scoring
│       ├── CareerData.ts             # Normalized career dataset & helper exports
│       └── offlineRecommender.ts     # Offline algorithmic recommendation engine
├── public/                           # Static assets, branding, and icons
├── .env.example                      # Environment variables reference template
├── components.json                   # UI configuration manifest
├── next.config.ts                    # Next.js runtime configuration
├── package.json                      # Project dependencies & scripts
├── tailwind.config.js                # Tailwind CSS configuration
└── tsconfig.json                     # TypeScript compiler & path alias settings
```

---

## 🏛️ Architectural & Design Decisions

1. **Feature-Sliced Modular Boundaries**: Rather than mixing business logic directly into route pages, feature code is colocated within `src/features/<feature>/components`. This ensures page files remain thin orchestrators and enables seamless testing and maintainability.
2. **Dual AI & Offline Recommender Engine**: To prevent a single point of failure when Gemini API quotas are exhausted or rate limits occur, the platform automatically switches to a local scoring engine (`offlineRecommender.ts`). This guarantees zero downtime for users taking the assessment.
3. **HTTP Chunked Streaming (`ReadableStream`)**: Roadmaps and AI coaching chats stream tokens via native `ReadableStream` instead of blocking for full payloads, dramatically reducing Time to First Token (TTFT) and providing a responsive UX.
4. **Optimistic UI Updates with Resilient Fallbacks**: Dashboard operations (bookmarking careers, checking milestones) execute with optimistic UI updates combined with `localStorage` persistence, ensuring users never lose their state even during transient network disconnects.
5. **Elimination of FOUC (Flash of Unstyled/Empty Content)**: Pages implement strict mounted and data-loading skeleton boundaries, avoiding jarring layout shifts and empty states during Firebase authentication hydration.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.18.0 or later recommended)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)
- Firebase project credentials
- Google Gemini API key
- Supabase project credentials (optional, for persistent cloud saves)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/nxtstep.git
   cd nxtstep
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
   Fill in your API keys in `.env.local`:
   ```env
   # Gemini AI
   GEMINI_API_KEY=your_gemini_api_key
   GEMINI_MODEL=gemini-2.5-flash

   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # Firebase (Client)
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # Firebase Admin SDK (Server)
   FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```

5. **Open the Application:**
   Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

- `npm run dev`: Boots the Next.js local development server with Turbopack.
- `npm run build`: Generates an optimized production build.
- `npm run start`: Starts the Next.js production server.
- `npm run lint`: Runs ESLint to verify code quality.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
