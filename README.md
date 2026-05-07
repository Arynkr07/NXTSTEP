# NxtStep: AI-Powered Career Guidance Platform

NxtStep is a Next.js application designed to guide users through their career exploration journey. It leverages AI to provide personalized career roadmaps, course recommendations, and skill-building insights.

## Features

*   **AI-Driven Career Roadmaps**: Generates detailed, step-by-step roadmaps for various careers based on user interests and market trends.
*   **Personalized Recommendations**: Suggests relevant courses (free and paid) and skill development paths.
*   **Interactive Chatbot**: Guides users through a series of questions to understand their interests, skills, and aspirations.
*   **User Authentication**: Secure sign-up and login functionality using Firebase Authentication.
*   **Progress Tracking**: Allows users to save favorite careers, track quiz results, and view their journey progress.
*   **Dynamic UI**: Features modern UI elements with smooth animations, dark mode support, and interactive components.

## Tech Stack

*   **Frontend**: Next.js (App Router), React, Tailwind CSS, shadcn/ui, Next Themes
*   **Backend/API**: Next.js API Routes, Google Generative AI (Gemini API), Firebase Admin SDK (for Auth & Firestore), Mongoose (for MongoDB integration)
*   **Database**: Firebase Firestore, MongoDB (for potential future use or specific services)
*   **AI Model**: Google Gemini 2.5 Flash

## Getting Started

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm, yarn, pnpm, or bun package manager

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/NxtStep.git
    cd NxtStep/nxtstep
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    # or
    bun install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the `nxtstep` directory and add your API keys:

    ```env
    # .env.local
    GEMINI_API_KEY=YOUR_GOOGLE_GEMINI_API_KEY
    MONGODB_URI=your_mongodb_connection_string
    ```
    *Replace placeholders with your actual keys and connection strings.*

### Running the Development Server

Start the Next.js development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
Open http://localhost:3000 with your browser to see the result.

Project Structure
nxtstep/
├── app/                  # Next.js App Router directory
│   ├── api/              # API routes for backend logic
│   │   ├── chat/         # Chatbot API endpoints
│   │   ├── roadmap/      # Roadmap generation API
│   │   └── user/         # User-related API endpoints
│   ├── components/       # Reusable UI components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── ChatWidget.tsx
│   │   ├── contact.tsx
│   │   ├── data.tsx      # Career data
│   │   ├── navbar.tsx
│   │   └── ...
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout component
│   └── page.tsx          # Home page
├── components/           # Shared components (e.g., UI, utils)
│   └── ui/               # shadcn/ui components
├── lib/                  # Utility functions and library configurations
│   ├── firebase.ts       # Firebase initialization and exports
│   ├── mongodb.ts        # MongoDB connection logic
│   └── utils.ts          # General utility functions (e.g., cn for Tailwind merging)
├── public/               # Static assets
├── .eslintrc.mjs         # ESLint configuration
├── .gitignore
├── components.json       # shadcn/ui configuration
├── next.config.ts        # Next.js configuration
├── package.json
├── postcss.config.js     # PostCSS configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
Usage
Authentication: Sign up or log in to access personalized features.
Career Exploration: Navigate to the "Careers" or "Options" page to browse and search for career paths.
AI Guidance: Use the chatbot or quiz section to get personalized career recommendations and roadmaps.
Dashboard: View your progress, saved careers, and quiz history.
Contact Us: Reach out through the contact form for support or inquiries.
Contributing
Contributions are welcome! Please follow these guidelines:

Fork the repository.
Create a new branch for your feature (git checkout -b feature/AmazingFeature).
Commit your changes (git commit -m 'Add some AmazingFeature').
Push to the branch (git push origin feature/AmazingFeature).
Open a Pull Request.
License
This project is licensed under the MIT License - see the LICENSE file for details.

