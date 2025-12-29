# SpinWheel — Frontend

SpinWheel is a React + Vite frontend for a category-based spinner game. This repository contains the UI used to register/login users, configure categories (admin), and play the spinner game.

## Quick Start

- Prerequisites: Node.js (v18+ recommended) and npm/yarn installed.
- Clone the repo and install dependencies:

```bash
git clone <repo-url>
cd SpinWheel_Frontend
npm install
```

- Create environment variables (see below), then run the dev server:

```bash
# development
npm run dev

# build for production
npm run build

# preview production build locally
npm run preview

# type-check
npm run lint
```

## Environment Variables

This project reads runtime configuration from Vite env variables prefixed with `VITE_APP_` (see `src/config/env.ts`). The following variables are required:

- `VITE_APP_API_URL` (required): Base URL of the backend API (e.g. `https://api.example.com`).
- `VITE_APP_SECRET_KEY` (required): Secret key used by the client (used for simple encryption or signing in `src/lib/encryption-utils.ts`).
- `VITE_APP_APP_URL` (optional): URL of the app (default: `http://localhost:3000`).

Create a `.env` or `.env.local` file at project root containing:

```env
VITE_APP_API_URL=https://api.example.com
VITE_APP_SECRET_KEY=your-secret-key
VITE_APP_APP_URL=http://localhost:3000
```

Notes:
- Vite exposes variables starting with `VITE_` to the browser. This project strips the `VITE_APP_` prefix and validates presence of `API_URL` and `SECRET_KEY` at startup (see `src/config/env.ts`).
- Do NOT store sensitive production secrets in client-side env variables. Keep server-only secrets on the backend.

## What this UI does

- Authentication: register, login, password reset, OTP verification (see `src/components/auth`).
- Admin area: create/edit categories used by the spinner (see `src/components/admin`).
- Game: spin the wheel, show results, leaderboard-like results view (`src/components/game`).
- Reusable UI components: modals, toasts, skeleton loaders, error boundary, etc.

## Project Structure (high level)

Top-level important files and folders:

- `index.html` — HTML entry.
- `src/main.tsx` — app bootstrap.
- `src/App.tsx` — application routes and layout.
- `src/config/env.ts` — environment parsing & validation.
- `src/lib/api-client.ts` — axios wrapper for API calls.
- `src/context` — React contexts (Auth, Theme).
- `src/components` — grouped UI components (auth, admin, game, layout, ui).
- `src/pages` — page containers: `AuthPage`, `AdminPage`, `GamePage`.
- `src/hooks` — custom hooks used by the app.
- `src/utils` — helper utilities (date format, validators, sound manager).

Example tree (abridged):

```
src/
├─ api/             # API endpoints wrappers
├─ components/
│  ├─ admin/        # category management
	│  ├─ auth/         # login/register/OTP
	│  ├─ game/         # spinner and results
	│  └─ layout/       # header, sidebar, auth layout
├─ config/
│  └─ env.ts
├─ context/
├─ hooks/
├─ lib/
└─ pages/
```

## Development Tips

- Lint/type check: `npm run lint` runs `tsc --noEmit`.
- Tailwind is configured — edit `index.css`/`src/index.css` and `postcss.config.js`.
- API client: see `src/lib/api-client.ts` and `src/api/*` for available endpoints.
- To debug env parsing errors, check startup logs — `src/config/env.ts` throws clear errors listing missing fields.

## Common Commands

- `npm install` — install dependencies
- `npm run dev` — run dev server (Vite)
- `npm run build` — compile TypeScript and build production bundle
- `npm run preview` — preview production build locally
- `npm run lint` — type checking

## Contributing

- Fork the repo, create a feature branch, implement changes and open a PR to `development`.
- Keep changes small and focused; update or add tests if applicable.

## Troubleshooting

- If the app fails on startup with env errors, ensure `VITE_APP_API_URL` and `VITE_APP_SECRET_KEY` are set.
- If you get CORS issues when calling the API, confirm backend CORS is configured for your `VITE_APP_APP_URL`.

## License & Credits

This repo was created by the project owner. Check repository settings for license details.

---
