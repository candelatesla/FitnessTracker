# Yash's Personal Fitness Tracker

A dark, athletic personal dashboard for fat-loss tracking with workout logging, diet tracking, weekly planning, progress charts, rewards, and Google Sheets sync.

## Stack

- Next.js 14 App Router + TypeScript
- Tailwind CSS v3
- shadcn/ui primitives
- Recharts
- date-fns
- Google Sheets API v4 through Next.js route handlers
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

If Google credentials are not configured, the app automatically uses an in-memory fallback store so you can test logging, charts, badges, and navigation locally.

## Environment Variables

Create `.env.local` with:

```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=1dwDLu5CBNi_MHu4XBG6oFF_ZWnrfjPVTXiuhP6M1Gvk
NEXT_PUBLIC_APP_NAME=Fitness Tracker
```

## Google Cloud Setup

1. Go to Google Cloud Console and create a new project.
2. Enable the Google Sheets API for that project.
3. Open `IAM & Admin` → `Service Accounts`.
4. Create a service account.
5. Create and download a JSON key for that service account.
6. Copy the `client_email` value into `GOOGLE_SERVICE_ACCOUNT_EMAIL`.
7. Copy the `private_key` value into `GOOGLE_PRIVATE_KEY`.
8. Open the Google Sheet with ID `1dwDLu5CBNi_MHu4XBG6oFF_ZWnrfjPVTXiuhP6M1Gvk`.
9. Share the sheet with the service account email and give it `Editor` access.
10. Add the three environment variables to Vercel or `.env.local`.

The app will create and use these tabs when credentials exist:

- `DailyLog`
- `WeeklyWeight`
- `Badges`
- `Settings`

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

- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_PRIVATE_KEY`
- `GOOGLE_SHEET_ID`
- `NEXT_PUBLIC_APP_NAME`

## Notes

- The app is dark-mode only by design.
- Google Sheets secrets are only used in server-side route handlers.
- Local fallback storage is intentionally credential-free for quick testing.
