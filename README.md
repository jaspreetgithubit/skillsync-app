# SyncSkills.AI

SyncSkills.AI is organized as an npm workspace with a React + Vite frontend in
`client/` and the existing Express + MongoDB API in `server/`.

## Requirements

- Node.js 20.19 or newer
- npm 10 or newer
- MongoDB, if persistent database storage is desired

## Install

Install both workspace applications from the repository root:

```sh
npm install
```

For local configuration, copy the examples and adjust them as needed:

```powershell
Copy-Item client/.env.example client/.env
Copy-Item server/.env.example server/.env
```

`API_PROXY_TARGET` configures the Vite development proxy. `MONGODB_URI` and
`PORT` are server-only settings. Do not put credentials in client environment
files or expose secrets through `VITE_` variables.

The backend defaults to the existing local MongoDB database
`teammatch_ai`. If MongoDB is unavailable, project data uses the existing
`data/projects.json` fallback.

## Develop

Run the API and frontend in separate terminals:

```sh
npm run dev:server
npm run dev:client
```

The frontend is served by Vite (normally at `http://localhost:5173`) and
proxies `/api` requests to the Express server (normally at port `5000`). The
API health endpoint is `http://localhost:5000/api/health`; projects are served
at `/api/projects`.

The existing client-side authentication screens and query-parameter
navigation are preserved. This workspace change does not add or replace an
authentication provider.

## Test and lint

```sh
npm test
npm run lint
```

`npm test` runs the frontend skill-matching tests and backend API tests.

## Production build and start

```sh
npm run build
npm start
```

The frontend build is written to `client/dist`. When `NODE_ENV=production` is
set for the server, Express serves that build as well as the API. Configure
`MONGODB_URI` and `PORT` in the server environment for deployment.

## Workspace commands

- `npm run dev:client` — start Vite
- `npm run dev:server` — start the API with Node watch mode
- `npm run build` — build the frontend
- `npm run start` — start the API
- `npm run test` — run tests in both workspaces
- `npm run lint` — lint the frontend

Each application has its own `package.json` and `package-lock.json`. The root
workspace lockfile coordinates root-level installs.
