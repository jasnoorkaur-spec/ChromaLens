# ChromaLens

**See Beyond Colors. Understand Everything.**

ChromaLens is an accessibility-focused image analysis MVP for color-dependent charts, maps, forms and screenshots. It combines local OCR and pixel-color analysis with optional contextual Gemini Vision explanations, then produces an accessible, downloadable alternative. The demo is designed to work without an account; prepared demo analysis is always labeled as such when live AI is unavailable.

## Architecture

The application is a JavaScript npm workspace. `frontend/` contains the React/Vite client, React Router pages, Redux state, Tailwind CSS v4 styling and API client. `backend/` contains the Express API, Prisma schema/migrations and isolated OCR, Gemini, color-detection, transformation, audit, upload and database services. Gemini uses Google's `@google/genai` 3.4.0 Interactions API from the backend, with the `v1beta` image-input API version. In development, Vite listens on port 3000 and proxies `/api` to Express on port 3001. The production Express server serves the built frontend and `/api` from one origin on `PORT` (default 3000); a separate Vercel frontend and Render backend are also supported.

Uploads are held in memory while analyzed and are not kept by default. A signed-in user must explicitly opt into saving scan history. The browser stores only the selected profile and a small whitelist of recent-scan metadata in localStorage; it never stores uploaded image bytes, OCR text, or the full result payload there. Cloudinary storage is optional and only used when consent is provided and all Cloudinary credentials are configured. When Gemini is configured, the image and analysis context are sent to Google for processing with Interactions `store: false`, so ChromaLens does not ask Google to retain an Interaction. The Gemini key is read only by the backend; it must never be placed in a `VITE_*` variable.

## Requirements

- Node.js 22 or newer and npm 10.9.9 (pinned in the project manifest; Node 22 is required by the current Gemini SDK).
- A MySQL-compatible database for accounts and durable scan-history metadata.
- A Gemini API key for live AI explanations. If not configured or unavailable, sample mode uses a clearly labeled prepared explanation while still running local OCR/color processing.
- Cloudinary credentials only if permanent image storage is desired and explicitly consented to.

## Local development

From the repository root, install both workspace packages and start the development stack:

```sh
npm install
cp backend/.env.example backend/.env
# Edit backend/.env with a MySQL DATABASE_URL and optional provider values.
npm run prisma:generate --workspace backend
npm run prisma:migrate --workspace backend
npm run dev
```

The root runner launches frontend and backend together. The Vite dev server uses the configured project port (default 3000); Express defaults to port 3001 in the root development runner. Open the application through the project Preview.

Each package can also be installed and started separately:

```sh
cd frontend
npm install
npm run dev

# In another terminal:
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

When running the packages separately, set `API_PROXY_URL=http://127.0.0.1:3001` for Vite and `PORT=3001` for the API. To build the production UI, run `npm run build` from the root. For production, set the backend `PORT` environment variable (the service defaults to 3000).

## Environment variables

Copy `backend/.env.example` to `backend/.env` for ordinary local development. Never commit `.env` files. Managed project values are injected into the backend process in the managed environment; do not write protected values into source or frontend variables.

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | For accounts/history | MySQL-compatible Prisma connection string. Managed environment supplies this value for the enabled managed database. |
| `GEMINI_API_KEY` | Optional | Google Gemini Vision API key; backend only. Missing/unavailable key disables live explanations without disabling local analysis or prepared demos. |
| `GEMINI_MODEL` | Optional | Override the backend default `gemini-3.8-flash` if needed for the chosen Google account/API. |
| `PORT` | Runtime | Express listen port; defaults to 3000 when run as the production server. Root development runner assigns the API port. |
| `FRONTEND_ORIGIN` | Optional | Exact browser origin allowed by API CORS when frontend and backend are deployed separately. |
| `CLOUDINARY_CLOUD_NAME` | Optional | Cloudinary account name for consented image storage. |
| `CLOUDINARY_API_KEY` | Optional | Cloudinary API key. |
| `CLOUDINARY_API_SECRET` | Optional | Cloudinary API secret; backend only. |
| `VITE_API_BASE_URL` | Optional, browser-safe | API base path; defaults to same-origin `/api`. Do not put secrets in any `VITE_*` value. |
| `API_PROXY_URL` | Development only | Vite proxy target for the Express process; defaults to `http://127.0.0.1:3001`. |

In the managed project, set protected values through the platform's secure configuration UI. The Gemini API key has already been supplied to the project through that secure mechanism; its value is not stored in this repository. If setting it up independently, use the key name `GEMINI_API_KEY` in the backend environment.

## Database and migrations

The Prisma schema is in `backend/prisma/schema.prisma`; the initial SQL migration is in `backend/prisma/migrations/`. Generate the Prisma client and apply the committed migration history with:

```sh
npm run prisma:generate --workspace backend
npm run prisma:migrate --workspace backend
```

For a local standalone backend, the equivalent commands are `npx prisma generate` and `npx prisma migrate dev` from `backend/`. Set `DATABASE_URL` before migration commands. The managed Prisma client and migration script automatically add `sslaccept=strict` only when the MySQL host is a TiDB Cloud public endpoint and the parameter is absent. The managed development and published applications share their project database, so changes to managed schema/data are shared. Do not run destructive resets against a shared database.

The schema contains users with bcrypt-hashed passwords, CVD preferences, scan history, transformations, and session records. Image URLs are nullable and images are not uploaded or retained unless the authenticated user explicitly enables history saving; without configured Cloudinary, history can retain metadata but not a durable copy of the image.

## Main user flow

1. Select **Try ChromaLens** or one of three sample demonstrations: red/green bar chart, color-coded risk map, or status form/dashboard.
2. For a custom image, upload a PNG, JPG/JPEG, or WebP image up to 10 MB and choose Protanopia, Deuteranopia, Tritanopia, or General Accessible Mode. These profiles are display preferences, not diagnoses.
3. Analyze. The API extracts visible text with Tesseract.js, detects dominant colors with JavaScript pixel processing, and—when Gemini is configured—requests a contextual structured explanation. It reports uncertainty rather than inventing labels or meaning.
4. Review detected elements, OCR, issues/recommendations, source status, and the accessible output. Compare before/after and download the accessible image as PNG.
5. Account creation is optional for demos. Uploaded images are temporary by default; the explicit “save this scan” choice requires a signed-in account. Cloudinary retention also requires its backend configuration.

Prepared sample explanations are not live model results. Custom uploads without Gemini still receive local findings and are marked as local-only; ambiguous meaning remains unconfirmed. A reconstructed sample chart/map/form can be more complete than the best-effort treatment of an arbitrary photograph or screenshot.

## REST API

All endpoints are mounted under `/api`. JSON errors have the form `{ "success": false, "error": { "code": "...", "message": "..." } }` and use appropriate HTTP status codes.

Every state-changing request (`POST`, `PUT`, `PATCH`, or `DELETE`) must include `X-ChromaLens-Request: 1`. The frontend API client adds this marker automatically for mutations; the API returns `403 CSRF_HEADER_REQUIRED` when it is missing. For separately deployed frontend/backend origins, configure the exact frontend origin in `FRONTEND_ORIGIN`; CORS preflight allows the marker header only for configured origins.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | API and dependency readiness summary. |
| `POST` | `/api/analyze` | Multipart `image` plus `cvdType`; optional `sampleId` and `saveHistory`; returns structured OCR/color/AI/audit/transformation results. |
| `GET` | `/api/analyze/:analysisId/progress` | Read the short-lived, in-memory processing stages for an active analysis request. |
| `POST` | `/api/explain` | Contextual plain-language explanation for an uploaded image/profile. |
| `POST` | `/api/transform` | Accessible best-effort or reconstructed PNG output. |
| `POST` | `/api/audit` | Accessibility findings and recommendations. |
| `GET` | `/api/history` | Recent saved scans for the authenticated user. |
| `POST` | `/api/auth/register` | Create an account. |
| `POST` | `/api/auth/login` | Authenticate an account using an HTTP-only session cookie. |
| `POST` | `/api/auth/logout` | Revoke the current application session. |
| `GET` | `/api/auth/me` | Return the authenticated account or a logged-out response. |

Never infer semantics from color alone: sample labels or image context must support an interpretation. Any custom transformation that cannot be reconstructed with confidence is explicitly reported as best-effort.

## Deployment

### Vercel frontend + Render backend

1. Create a Render Node service from the repository and set its root directory to `backend/`. Use Node 22+, build command `npm install && npx prisma generate`, and start command `npm start` (or `node src/server.js` if using a package runner). Set `PORT` through Render's runtime and configure `DATABASE_URL`, `GEMINI_API_KEY`, `GEMINI_MODEL` if needed, and `FRONTEND_ORIGIN` to the exact Vercel site origin. Configure Cloudinary variables only if consented storage is enabled.
2. Deploy `frontend/` to Vercel with the Vite framework preset. Set `VITE_API_BASE_URL` to the Render API origin plus `/api`, for example `https://your-service.onrender.com/api`. This value is public; it contains no credential.
3. Apply Prisma migrations as a release/deploy step against the selected MySQL-compatible database before serving authenticated history features. Verify `/api/health` and configure exact CORS origins and HTTPS cookie behavior.

### Single-origin container

Build the Vite app with `npm run build` from the repository root, generate Prisma Client during the container build, then start the Express service. Express serves `frontend/dist` and the API from the same listener; provide `DATABASE_URL`, `GEMINI_API_KEY`, optional Cloudinary values and a `PORT` at runtime. Never inject secrets during frontend compilation. The platform-managed Preview uses the same-origin Vite proxy in development.

## Privacy, security and limitations

ChromaLens is an accessibility aid, not a medical diagnostic system. Profile selection describes a preferred presentation. The system avoids guessing color semantics and marks uncertain AI or local findings. Multer checks supported image types and size; file processing is transient in memory; Helmet/CORS, a required custom mutation header, input validation and safe error handling protect the API. Account passwords are stored as bcrypt hashes. Sessions use HTTP-only cookies and are revoked at logout. Browser localStorage is limited to the selected profile and recent-scan metadata; uploaded image bytes, OCR text, and full analysis results are not persisted there.

Gemini, database and Cloudinary services require valid credentials and network access. When live analysis is enabled, images are transmitted to Google for processing; ChromaLens sets `store: false` on each Gemini Interaction. The samples remain usable without login and can use prepared, labeled explanations if Gemini is unavailable. Generic photo/screenshot reconstruction is best-effort; structured samples are the strongest demonstration. No uploaded image is permanently stored by ChromaLens unless the user signs in and explicitly opts to save it.
