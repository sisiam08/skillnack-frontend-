# Frontend

Next.js 16 frontend for the Ilmefy tutoring platform.

The app handles public pages, authentication, role-based dashboards, tutor and student flows, and live class features.

## Requirements

- Node.js 20 or newer
- Bun

## Install

```bash
bun install
```

The repository includes a `bun.lock` file, so Bun is the recommended package manager for this app.

## Scripts

```bash
bun run dev
bun run build
bun run start
bun run lint
```

- `dev` starts the Next.js development server.
- `build` creates a production build.
- `start` runs the production server.
- `lint` runs ESLint.

## Environment Variables

Create a `.env.local` file in the `frontend` folder with the variables below:

```env
BACKEND_URL=
FRONTEND_URL=
API_URL=
AUTH_URL=

NEXT_PUBLIC_FRONTEND_URL=
NEXT_PUBLIC_BACKEND_URL=
NEXT_PUBLIC_ZEGO_APP_ID=
NEXT_PUBLIC_ZEGO_SERVER_SECRET=
```

Notes:

- `BACKEND_URL`, `FRONTEND_URL`, `API_URL`, and `AUTH_URL` are validated through `src/env.ts`.
- `NEXT_PUBLIC_BACKEND_URL` is used for auth requests.
- `NEXT_PUBLIC_FRONTEND_URL` is used for redirects and callback URLs.
- `NEXT_PUBLIC_ZEGO_APP_ID` and `NEXT_PUBLIC_ZEGO_SERVER_SECRET` are required by the live class component.

## Development Flow

1. Start the backend API first.
2. Configure the frontend environment variables.
3. Run `bun install`.
4. Run `bun run dev`.

Open [http://localhost:3000](http://localhost:3000) in your browser after the dev server starts.

## Project Notes

- The app uses the Next.js App Router.
- Authentication and redirects are handled through the custom auth client and route proxy.
- Styling is built with Tailwind CSS v4 and the shared UI components in `src/components`.
