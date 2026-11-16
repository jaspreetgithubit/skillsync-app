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

## Individual student–project compatibility

The authenticated student dashboard includes **Project Compatibility**. It
compares the signed-in account's confirmed profile with a selected project's
skill requirements. The browser does not submit a student ID; the API resolves
the student from the existing HttpOnly session cookie.

`GET /api/projects/:projectId/compatibility` returns an explainable result:
score and classification, required/preferred coverage, exact matches,
missing required skills, partial matches, critical gaps, and a
deterministic explanation. The endpoint calculates from the latest profile
and project data; it does not persist scores or make AI-provider calls.
This endpoint evaluates only the currently authenticated student. It does not
provide a teacher-facing ranking of multiple students or persist project
assignments; those require a separate, authorized assignment workflow.

Project creation continues to use `requiredSkills`. Each entry now supports
`priority` (`required` or `preferred`), `weight` (1–100), and `critical`.
Student proficiency is not part of project compatibility scoring.

### Scoring and normalization

The deterministic scoring service compares skills only. It defaults to
relative component weights of 70% required skill coverage and 20% preferred
skill coverage. Coverage is the weight-adjusted sum of match strengths divided
by total requirement weight. When a project has no preferred skills, that
component is omitted and the remaining component weights are renormalized.

The default classification threshold is 60. These server-only settings may be
overridden in `server/.env`:

```env
COMPATIBILITY_REQUIRED_WEIGHT=70
COMPATIBILITY_PREFERRED_WEIGHT=20
COMPATIBILITY_CLASSIFICATION_THRESHOLD=60
```

Trusted aliases normalize to canonical names (for example `React.js` → `React`,
`NodeJS` → `Node.js`, `JS` → `JavaScript`, and `Postgres` → `PostgreSQL`).
Java and JavaScript, React and React Native, and MongoDB and PostgreSQL are not
equivalents. A small, explicit related-skill list can award limited partial
credit (currently JavaScript for React/Node.js and deep learning for machine
learning); partial matches do not satisfy required or critical skills. No
semantic AI provider is used.

The score is a suitability score, not a probability of success or statistical
accuracy. Critical eligibility is reported separately from the score.

## Team compatibility and recommendations

The landing page's **Project & Team Matching** section points visitors to
sign in or create an account. For signed-in users, it displays the same live
**Project Compatibility** and **Find Best Teams** interface used on the
dashboard; it does not use sample students or simulated team results. The
endpoint
`GET /api/projects/:projectId/team-recommendations` uses the session cookie to
authorize the request; it does not accept a student ID from the browser.
Candidate profiles come from confirmed account profiles with at least one
usable technical skill. The project creator is not automatically excluded.
The response contains only each student's name, project-relevant skills,
contributions, and individual fit score; it never includes email, student
account identifiers, resume content, or the full profile.

New projects default to a team of three. The project form allows teams of 1–8.
Legacy projects without a stored team size use the application default of 3,
which is identified in the recommendations. At present the application has a
project-creation form but no project-edit endpoint or editing screen.

Project roles are optional. To include role coverage, add one or more role
entries and enter that role's explicit required skills as comma-separated
values. Role coverage is weighted by the configured position count. A role is
fully covered only when every configured skill has an exact or trusted-alias
match; related-skill matches are partial. If no role skills are configured,
role coverage is omitted and the remaining component weights are renormalized.
No role skills are inferred from role names or project descriptions.

Each possible team has exactly the configured team size and contains distinct
eligible students. The current student's own profile remains a candidate when
it is eligible. The application does not create teams, assign students, change
availability, or send invitations.

Team skill coverage reuses Feature 2's canonical aliases and explicit partial
match rules. For each requirement, the strongest member match is counted once,
weighted by that requirement. Required and preferred coverage are calculated
separately; when both exist, combined coverage is 80% required and 20%
preferred. If only one priority exists, it supplies the whole component.
Missing critical requirements are reported separately and require exact
canonical matches, even when the overall score is high.

Individual member relevance is the average of each member's actual Feature 2
compatibility score. Complementarity is the percentage of covered required
and preferred skill weight for which exactly one member has a valid match.
Unrelated skills do not contribute. The default final score is:

```text
(combined skill coverage × 0.60)
+ (role coverage × 0.15)
+ (individual member relevance × 0.15)
+ (skill complementarity × 0.10)
```

When role coverage is unavailable, its weight is removed and the remaining
weights are renormalized. The default classifications are highly compatible
(80+), moderately compatible (65+), low compatibility (50+), and poor
compatibility (below 50). Ties are broken by critical requirements, required
coverage, role coverage, individual relevance, complementarity, then sorted
student IDs. These are deterministic heuristic rankings, not an outcome
probability.

The search evaluates all combinations when there are at most 25,000 possible
teams. Larger searches use a deterministic bounded beam search, returning the
best complete teams found within that search rather than claiming the global
top five. Defaults are 50 candidates maximum, team size 8 maximum, beam width
200, and five recommendations. Requests above the candidate or team-size
limits are rejected with an actionable error. Server-only settings are in
`server/.env.example` under `TEAM_RECOMMENDATION_*` and
`TEAM_COMPATIBILITY_*`.

The response includes the search strategy, possible/evaluated team counts,
team size/default status, score breakdown, critical gaps, matched and missing
skills, role coverage, unique contributions, and a deterministic explanation.
Tests use controlled profiles and projects; there is no human-labeled team
recommendation dataset, so real-world team-ranking accuracy has not been
independently evaluated.

### Human-reviewed accuracy evaluation

No human-labeled compatibility dataset is currently available in this
repository. Therefore the target of **more than 90% held-out accuracy is not
verified**. The example file
`server/evaluation/compatibility.dataset.example.json` is intentionally empty
and is not evidence of accuracy.

To evaluate, create a JSON dataset with non-empty `train`, `validation`, and
`test` arrays. Every pair must include anonymized `studentId` and `projectId`,
the confirmed `profile`, `project`, and a human-reviewed `label` of
`RELEVANT` or `NOT_RELEVANT`. Set metadata `labelingMethod` to `human_review`.
Keep both student and project identities disjoint across all three splits;
this grouped split rule prevents the same student or project from leaking
between development, validation, and held-out test data. Aim for at least 200
reviewed pairs and representative positive/negative examples.

The evaluator calibrates a threshold using validation F1 (ties use higher
accuracy, then proximity to the default threshold) and reports accuracy,
precision, recall, F1, confusion matrix, threshold, split sizes, and test
examples on the independent test set. It never uses the test split for
calibration and refuses overlapping identities. Run:

```sh
npm run evaluate:compatibility -- evaluation/human-reviewed.json
```

This writes adjacent `.evaluation.json` and `.evaluation.md` reports without
overwriting existing files. A held-out accuracy at or below 90% is reported as
below target (and exits with status 2). The classification threshold selected
from validation can be set as
`COMPATIBILITY_CLASSIFICATION_THRESHOLD` for the application. Do not claim the
target until a suitably sized, independently held-out human dataset actually
meets it.

## Test and lint

```sh
npm test
npm run lint
```

`npm test` runs frontend utility tests and backend unit and API tests.

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
