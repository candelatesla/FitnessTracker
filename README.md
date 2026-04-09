# Yash's Personal Fitness Tracker

A dark, athletic personal dashboard for fat-loss tracking with workout logging, diet tracking, weekly planning, progress charts, rewards, and Firebase Firestore sync.

## Stack

- Next.js 14 App Router + TypeScript
- Tailwind CSS v3
- shadcn/ui primitives
- Recharts
- date-fns
- Firebase Firestore through Next.js route handlers
- Framer Motion
- Lucide React
- canvas-confetti

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Start the dev server:

```bash
npm run dev
```

3. Open [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

If Firebase credentials are not configured, the app automatically uses an in-memory fallback store so you can test logging, charts, badges, and navigation locally.

## Environment Variables

Create `.env.local` with:

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

## Firebase Setup

1. Go to Firebase Console and create a project.
2. Enable `Firestore Database`.
3. Register a web app and copy the Firebase web config values.
4. Open `Project settings` → `Service accounts`.
5. Generate and download a private key JSON.
6. Copy `project_id` into `FIREBASE_PROJECT_ID`.
7. Copy `client_email` into `FIREBASE_CLIENT_EMAIL`.
8. Copy `private_key` into `FIREBASE_PRIVATE_KEY`.
9. Add the web config values as `NEXT_PUBLIC_FIREBASE_*` environment variables.
10. Add the same environment variables in Vercel before deploying.

The app uses these Firestore collections when credentials exist:

- `dayLogs`
- `weights`
- `badges`
- `meta/settings`

## API Routes

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

## App Usage

1. On first launch, set the journey start date in the welcome modal.
2. Use `Dashboard` for the daily overview, checklist, and streaks.
3. Use `Today's Workout` to log set-by-set performance and mark the session complete.
4. Use `Diet Tracker` to mark meals eaten, track water, and audit snack choices.
5. Use `Weekly Schedule` to review the current week and browse past weeks.
6. Use `Progress` to log weight and monitor chart trends.
7. Use `Rewards` to track unlocked badges and the weekly summary.

Autosave runs about 2 seconds after edits on the daily log pages.

## Vercel Deployment

### CLI

```bash
npm install -g vercel
vercel
vercel deploy --prod
```

### Project Config

`vercel.json` is included:

```json
{
  "name": "fitness-tracker",
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next"
}
```

Add these same environment variables in the Vercel project settings before production deploys:

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

## Notes

- The app is dark-mode only by design.
- Firebase admin secrets are only used in server-side route handlers.
- Local fallback storage is intentionally credential-free for quick testing.
