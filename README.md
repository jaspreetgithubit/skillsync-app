# SyncSkills.AI

SyncSkills.AI is organized as an npm workspace with a React + Vite frontend in
`client/` and the existing Express + MongoDB API in `server/`.

## Requirements

- Node.js 20.19 or newer
- npm 10 or newer
- MongoDB (required for accounts, sessions, and resume profile drafts)

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

`API_PROXY_TARGET` configures the Vite development proxy. `MONGODB_URI`,
`CLIENT_ORIGIN`, and `PORT` are server-only settings. Do not put credentials
in client environment files or expose secrets through `VITE_` variables.

The backend defaults to the existing local MongoDB database
`teammatch_ai` during development. The API does not start if MongoDB is
unavailable; production requires an explicit `MONGODB_URI`.

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

The sign-in and create-account screens use the Express authentication API.
Vite proxies same-origin `/api` requests to the backend during development.

## Resume profile onboarding

The sign-up screen can extract a profile from PDF and DOCX resumes. The client
first asks for consent, then sends the file to `POST /api/resumes/parse`.
The server checks the file signature, declared MIME type, size, and document
limits; extracts text locally; and calls one configured AI provider through a
shared structured-output interface. Extracted data is normalized and validated
against the server-owned profile schema before it is returned for editing.
The resume binary is processed in memory and is not saved.

The editable review covers personal information, technical skills, education,
experience, projects, certifications, achievements, languages, and interests.
Nothing extracted is treated as confirmed until account creation. The reviewed
profile is stored with its MongoDB account record. Resume uploads are processed
in memory and are not retained; short-lived draft tokens are random, one-time
tokens whose SHA-256 hashes are stored in MongoDB. Pending drafts expire after
30 minutes by default.

### Accounts and sessions

- `POST /api/auth/register` validates the account/profile, stores the profile
  and a salted scrypt password hash in the `users` collection, and creates a
  session.
- `POST /api/auth/login` verifies the password hash and issues a new session.
- `GET /api/auth/me` validates the current session and returns the account
  profile.
- `POST /api/auth/logout` revokes the current session.

Passwords are never stored as plaintext or reversibly encrypted. Each password
uses a random salt and Node.js `scrypt`; the database stores only the resulting
hash. Sessions use cryptographically random opaque tokens: the browser receives
the token only in an `HttpOnly`, `SameSite=Lax` cookie, while MongoDB stores its
SHA-256 hash. Sessions expire after seven days, are revocable, and are removed
automatically after expiration. The session token is not returned in JSON or
stored in browser local storage.

Set `CLIENT_ORIGIN` to the exact frontend origin (or a comma-separated list of
origins) for CORS and request-origin validation. Production must use HTTPS so
the session cookie receives the `Secure` attribute. If the API is behind a
reverse proxy, set `TRUST_PROXY` to the correct trusted proxy hop count or CIDR
for accurate client IP handling and rate limits.

Email verification, password reset, MFA, and account deletion are not yet
implemented. Add a configured transactional email provider and those flows
before relying on email ownership checks in a public production deployment.

### Configure an AI provider

Resume parsing requires a running MongoDB connection and a valid key for the
selected provider. Copy `server/.env.example` to `server/.env`, then set the
server-only variables:

```env
AI_PROVIDER=gemini
AI_API_KEY=
AI_MODEL=
AI_TEMPERATURE=0
AI_TIMEOUT_MS=30000
AI_MAX_RETRIES=1

RESUME_MAX_FILE_SIZE_MB=5
RESUME_MAX_PAGES=10
RESUME_MAX_TEXT_CHARS=30000
ONBOARDING_DRAFT_TTL_MINUTES=30
```

Set `AI_API_KEY` to a key issued by the selected provider when resume
extraction is enabled. Supported values are
`openai`, `gemini`, and `xai`; `grok` is accepted as an alias for `xai`.
`AI_MODEL` is optional and overrides the provider defaults (`gpt-4o-mini`,
`gemini-2.5-flash`, and `grok-4.7`, respectively). Provider model availability
can change, so configure an available model for your account when needed.
Changing providers may change latency, quality, and cost, but all results still
pass through the same schema and normalizer. Resume parsing reports a
configuration error if the selected provider is not configured. Accounts and
sign-in do not depend on an AI provider. Keys are never returned by the API or
exposed to Vite/client environment variables.

Resume text is sent to the configured third-party provider only after the
student consents. Do not upload sensitive information the student does not
want processed by that provider. OpenAI, Gemini, and xAI have their own data
handling and retention policies; review those policies before production use.

### Manual verification

1. Start MongoDB and configure `server/.env` with `MONGODB_URI` and
   `CLIENT_ORIGIN`. Configure `AI_PROVIDER` and `AI_API_KEY` only if you will
   test resume extraction.
2. Run `npm run dev:server` and `npm run dev:client` in separate terminals.
3. Open `http://localhost:5173`, switch to **Create Account**, and enter the
   account details and a password of at least 12 characters. On successful
   creation, the server creates an account and establishes a session.
4. Optionally upload a PDF or DOCX, consent to processing, and select
   **Extract profile**. Review and edit the result; a valid extracted contact
   email is also copied to the account email field, which remains editable.
5. Reload the page to verify the existing session is restored. Sign out and
   sign in again to verify password authentication. `GET
   http://localhost:5000/api/resumes/config` reports safe provider/limit
   metadata and never returns the key.

API endpoints:

- `GET /api/resumes/config` — safe provider/limit metadata, no credentials.
- `POST /api/resumes/parse` — multipart `resume` and `consent=true`.
- `POST /api/auth/register` — create an account with a profile and establish a
  session.
- `POST /api/auth/login` — authenticate an existing account.
- `GET /api/auth/me` — restore the current account session.
- `POST /api/auth/logout` — revoke the current session.
- `POST /api/onboarding/drafts` and
  `POST /api/onboarding/drafts/:token/confirm` — legacy onboarding-draft
  endpoints retained for compatibility; the active signup flow associates
  drafts directly with an account.
- `DELETE /api/onboarding/drafts/:token` — cancel a pending resume draft.

PDFs are limited by page count and extracted text size. DOCX page counts use
stored page metadata when present or explicit page-break markers; DOCX files
without either are still limited by file size, safe archive expansion, and
extracted text length. Long documents are rejected rather than blindly
truncated. Scanned PDFs return an explicit error because OCR is not currently
implemented.

Automated tests mock every AI provider; running the test suite makes no paid AI
requests:

```sh
npm test
npm run build
```

The extracted normalized skill and project data is structured so a later
individual project-compatibility milestone can consume it. This implementation
does not add compatibility scoring, team recommendations, or ranking.

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
