# Kick AI Odds

A sports betting-odds dashboard. It pulls live sports, leagues, fixtures and bookmaker odds from [The Odds API](https://the-odds-api.com) through Supabase Edge Functions and shows them in a React app.

Originally created with [Lovable](https://lovable.dev/projects/ef01dc8e-8b99-4384-b9f4-9008f34f1f0b); changes pushed here sync back to Lovable.

## Features

- **Odds**: head-to-head odds across bookmakers, with filters (sport, league, region, market).
- **Fixtures & results**: upcoming and past matches.
- **Standings and teams/players** views.
- **Chat bot** widget. Replies are currently simulated in the browser (no AI backend yet).

## Tech stack

Vite 5, React 18, TypeScript, Tailwind CSS 3, shadcn/ui (Radix), React Router 6, TanStack Query, Recharts, Supabase (client + Edge Functions on Deno).

## Structure

```
src/
  pages/Index.tsx            single page with tabs (Odds, Fixtures, Standings, Teams)
  components/                Dashboard, OddsTable, OddsFilters, FixturesResults, TeamsPlayers, ChatBot
  hooks/useSportsData.ts     calls the Edge Functions
  integrations/supabase/     generated client and types
supabase/functions/
  fetch-sports/              list of sports
  fetch-leagues/             leagues for a sport
  fetch-odds/                odds for a sport / region / market
  fetch-fixtures/            fixtures with h2h odds
```

## Getting started

```bash
npm install
npm run dev        # Vite dev server
npm run build      # production build
npm run lint
```

### Environment

Frontend (`.env`, committed with the Lovable project; these are public/publishable values):

| Variable | Purpose |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/publishable key |
| `VITE_SUPABASE_PROJECT_ID` | Supabase project id |

Supabase Edge Function secret (set in the Supabase dashboard, never in the repo):

| Secret | Purpose |
|---|---|
| `ODDS_API_KEY` | API key for The Odds API |

Deploy the functions with the Supabase CLI: `supabase functions deploy fetch-sports fetch-leagues fetch-odds fetch-fixtures`.
