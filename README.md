# Yash's Personal Fitness Tracker

A full-stack personal fitness dashboard built to track workouts, meals, hydration, weight progress, streaks, and rewards in one place.

The app is designed around a simple real-world goal: make daily fat-loss tracking feel fast, motivating, and structured enough to follow consistently. It combines a guided training plan, a diet tracker, progress visualization, athlete motivation, and a reward system inside a dark, athletic interface inspired by Formula 1 pit-wall dashboards and pro sports analytics tools.

## Overview

This project helps track:

- daily workout completion
- full weekly gym plan execution
- meal logging and protein/calorie progress
- hydration and clean-eating habits
- weekly weight entries
- progress trends and milestones
- unlocked consistency and fitness badges

The product is intentionally personal-first, but the architecture is reusable for habit tracking, performance dashboards, or coaching-style wellness apps.

## What The App Does

### Dashboard

The dashboard is the landing page and “today view” of the tracker. It shows:

- today’s date
- current timezone-aware local day
- current journey week
- rotating athlete quotes
- calories, protein, workout, and water KPIs
- today’s workout preview
- a daily checklist
- gym and clean-eating streaks
- weekly mini-progress

### Today's Workout

The workout page contains the full daily training session, including:

- the assigned workout day based on weekday
- exercise cards
- target sets and reps
- muscle-group tags
- YouTube demo embeds
- editable set logging
- workout completion state

### Diet Tracker

The diet page tracks:

- daily calories
- daily protein
- water intake
- meal-by-meal progress
- snack avoidance
- Greek yogurt protein boosts

### Weekly Schedule

The weekly schedule page provides a week-level operational view:

- assigned workout by day
- status indicators
- quick daily nutrition context
- navigation between current and past weeks

### Progress

The progress page visualizes long-term trends using charts:

- weight over time
- weekly workout completion
- average calories
- average protein
- snack-avoidance rate

### Full Plan Reference

The reference section acts like a built-in fitness playbook, covering:

- problem food audit
- daily diet structure
- dinner rotation ideas
- lifestyle guidance
- fat-loss timeline expectations
- a directly viewable imported HTML reference tab

### Rewards

The rewards page turns consistency into a badge system with:

- workout streak unlocks
- diet compliance unlocks
- hydration/protein streaks
- progress milestones
- weekly summary highlights

## Core Product Decisions

### 1. Dark Athletic Visual Language

The UI is intentionally high-contrast and dark-first, with gold as the only strong accent. The goal was not “gamer neon,” but a cleaner championship-board feel.

### 2. Daily Tracking As One Connected System

One of the main product goals was to make workout, diet, water, checklist, and dashboard views all operate on the same daily log. The app is structured so those sections are not separate tools; they are different views on the same day-level record.

### 3. Timezone-Aware Local Day Tracking

The app now treats “today” as a browser-local concept. Instead of forcing the user to manually pick the date every time, it:

- auto-detects the browser timezone
- uses that timezone to determine the current local day
- stores the local date key
- stores metadata like timezone and timestamps on day logs

This makes the tracker better for travel and real daily use.

### 4. Static-First Frontend, Server-Side Secrets

The UI is deployed as a Next.js app on Vercel, but sensitive backend credentials remain server-side. The frontend never exposes admin secrets.

## Why Firebase Firestore

The first backend approach used Google Sheets as a simple persistence layer. That worked for early prototyping, but it was not a great long-term fit for a responsive app with autosave and cross-page synchronization.

The project was moved to Firebase Firestore for these reasons:

- faster writes and reads for application-style usage
- more reliable day-level document storage
- fewer race conditions than spreadsheet row updates
- cleaner partial update behavior
- better fit for autosave and near-real-time UX
- easier future expansion into auth, sync, and mobile

In short: Sheets was good for proving the idea. Firestore is better for making the app feel production-like.

## Tech Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS v3
- shadcn/ui primitives
- Recharts
- date-fns
- Firebase Firestore
- Firebase Admin SDK
- Framer Motion
- Lucide React
- canvas-confetti

## Architecture

### Frontend

The UI is page-based and built with the App Router.

Main routes:

- `/dashboard`
- `/workout`
- `/diet`
- `/schedule`
- `/progress`
- `/plan`
- `/claude-reference`
- `/rewards`

### Backend

The backend is exposed through Next.js route handlers:

- `POST /api/log-day`
- `GET /api/get-day?date=YYYY-MM-DD`
- `GET /api/get-week?startDate=YYYY-MM-DD`
- `GET /api/get-all-logs`
- `POST /api/log-weight`
- `GET /api/get-weights`
- `POST /api/unlock-badge`
- `GET /api/get-badges`
- `GET /api/settings`
- `POST /api/settings`

The route layer is intentionally thin. Most storage logic is centralized in:

- [client.ts](/Users/yashdoshi/Documents/Projects/FitnessTracker/src/lib/sheets/client.ts)

That file now acts as the app’s persistence adapter for Firestore while preserving the higher-level storage API used across the project.

### State Model

The project revolves around a shared day-log model. A single day log contains:

- workout assignment
- workout completion
- exercise set logs
- meal state
- snack avoidance state
- water intake
- checklist state
- notes
- optional weight
- timezone
- created/updated timestamps

This is what makes the dashboard, diet page, and workout page behave like one connected tracker instead of disconnected modules.

## Firestore Data Model

The app uses these collections:

- `dayLogs`
- `weights`
- `badges`
- `meta`

Expected documents:

- `dayLogs/{YYYY-MM-DD}`
- `weights/{weekStartDate}`
- `badges/{badgeId}`
- `meta/settings`

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` with your Firebase credentials:

```env
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...
NEXT_PUBLIC_APP_NAME=Fitness Tracker
```

3. Start the dev server:

```bash
npm run dev
```

4. Open:

[http://localhost:3000/dashboard](http://localhost:3000/dashboard)

If Firebase credentials are missing, the app falls back to an in-memory store so the UI can still be tested locally.

## Firebase Setup

1. Create a Firebase project.
2. Enable Firestore Database.
3. Register a web app.
4. Copy the Firebase web config values.
5. Go to `Project settings` → `Service accounts`.
6. Generate a private key JSON.
7. Add the admin and public Firebase values into `.env.local` and Vercel.

Required environment variables:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`
- `NEXT_PUBLIC_APP_NAME`

## Deployment

This project is set up to deploy on Vercel.

### Vercel CLI

```bash
npm install -g vercel
vercel
vercel deploy --prod
```

### Project Config

`vercel.json`:

```json
{
  "name": "fitness-tracker",
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next"
}
```

Before deploying, add the Firebase env vars in Vercel under:

`Project Settings` → `Environment Variables`

## How To Use The App

1. Open the dashboard.
2. Set the start date on first launch.
3. Track your meals and water throughout the day.
4. Log workout sets when training.
5. Complete the day’s workout.
6. Review weekly adherence and chart trends.
7. Track weight weekly.
8. Watch milestones and reward badges unlock over time.

## Notable UX Features

- autosave for daily logging
- dashboard summary cards
- timezone-aware current day handling
- rotating motivational athlete quotes
- workout guidance with exercise media
- visual streaks and progress indicators
- badge unlock system
- confetti-based reward moments

## Current Status

This project is functional as a full-stack personal tracker and is actively tuned around:

- reducing save latency
- keeping all pages in sync with the same day log
- making daily tracking reliable across refreshes
- improving backend responsiveness after moving from Sheets to Firestore

## Potential Future Improvements

- Firebase Auth for user accounts
- true real-time listeners with Firestore subscriptions
- multi-user or coach view
- export/shareable progress summaries
- mobile app version
- push reminders for water, meals, and workouts

## Notes

- The app is dark-mode only by design.
- Firebase admin secrets are used only in server-side route handlers.
- Local fallback storage exists for testing without cloud credentials.
- Recharts may emit non-fatal width warnings during static build; the app still builds successfully.

## Contact

- Email: yash.doshi@tamu.edu
- LinkedIn: [https://www.linkedin.com/in/yashdoshi8/](https://www.linkedin.com/in/yashdoshi8/)

## License / Copyright
© 2026 Yash Chetan Doshi. All rights reserved.

You may not copy, modify, distribute, or use any part of this repository or its contents without prior written permission from the author.
