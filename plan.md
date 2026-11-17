# ChromaLens implementation plan

## Product and delivery approach

Build a full-stack, JavaScript-only hackathon MVP in the initialized managed Web project. Preserve the requested React + Vite frontend and Node.js + Express backend, with a same-origin production deployment: Express serves the Vite build and `/api/*` on port 3000. During local development, Vite serves the frontend on the configured Preview port and proxies `/api` to the Express development process. This keeps Preview simple while leaving frontend and backend package scripts independently runnable. Provide deployment notes for the requested Vercel frontend / Render API split as a supported alternative, with CORS and API-base configuration documented.

The client will use React Router for `/`, `/dashboard`, `/analysis`, and `/results`; Redux Toolkit for preferences and the current scan; Tailwind CSS v4 for design tokens/layout; Framer Motion for restrained transitions; Axios for API calls; Lucide React for controls; and React Dropzone for upload. Keep page and feature modules separate. Landing page stays intentionally sparse, with the requested hero, logo, sign-in/create-account entry points, and demo CTAs. Dashboard provides recent local/account scans, preferred CVD mode, samples, and upload entry. The analysis workspace accepts PNG/JPG/JPEG/WebP up to 10 MB, previews/replaces/removes images, offers a CVD profile selector, and can start a sample without sign-in.

The Express API will validate uploads with Multer and run modular services: Tesseract.js OCR; Sharp normalization/resizing and JavaScript-based image pixel/color analysis; context assembly; Gemini Vision explanation; accessibility audit; accessible-image/chart rendering; persistence. `POST /api/analyze`, `/api/explain`, `/api/transform`, `/api/audit`, `GET /api/history`, and `GET /api/health` return structured JSON and safe, consistent errors. Use Helmet and restrictive CORS, validate inputs and MIME/extension/size, and delete temporary upload files after processing. Do not claim diagnosis, infer meanings from color alone, or invent uncertain chart labels.

Gemini Vision will be integrated with the current Google JavaScript SDK, reading `GEMINI_API_KEY` only in the backend. No key is present in the project at planning time. Live AI enrichment will be available once the user supplies that protected environment value; absent Gemini, uploaded images still receive genuine local OCR and color findings with a plainly labeled AI-unavailable state, while the three built-in demos use clearly labeled precomputed fallback explanations if needed. Never describe fallback as live AI. Do not embed provider credentials in the frontend.

For the accessible output, favor an SVG/Chart.js replacement when a sample or extracted chart structure is sufficiently clear; otherwise generate a labelled, high-contrast best-effort rendition that preserves the source and discloses uncertainty. Use redundant distinctions—text/shape/pattern/outline as well as hue—and support a draggable before/after comparison plus PNG export. Samples will be original in-app SVG/chart or form/map visuals: (1) red/green bar chart with legend, (2) color-coded risk map, and (3) success/error form/dashboard. Their images pass through the same local OCR/color pipeline as uploads; associated demo explanations are explicitly marked as prepared demo content when live AI is unavailable.

## Data, accounts, storage, and deployment constraints

Use Prisma with the enabled MySQL-compatible managed database. Add schema models for User, CvdPreference, ScanHistory, and Transformation with the requested fields, unique email, relations, foreign keys, and migration workflow. The managed DSN is read from `DATABASE_URL`; development and publication share the database, so migrations must be additive and no destructive reset will be used. Provide Prisma generation/migration commands and `.env.example` files. Implement account registration/login with bcrypt and HTTP-only secure cookies only as a lightweight MVP; demo access never requires authentication. Keep scans in browser state/local storage unless a signed-in user explicitly opts into saving. Cloudinary uploads are optional/configured through backend environment variables and will not be required for a working demo; no image is retained by default.

## Result presentation and interaction

The results route will show the original, detected-element cards with color and labels/meaning/uncertainty, OCR text, explanation and its source (live Gemini, local analysis, or prepared fallback), accessibility issues and recommendations, accessible output, comparison, and PNG download. Loading messages reflect actual request/service progress; the client will not fake the completion of analysis. All forms, navigation, upload, sample selection, analysis, profile changes, compare, export, and account actions will be keyboard operable with descriptive labels, visible focus rings, sufficient contrast, and non-color-only status cues.

## Project structure

- `frontend/src/app/`: router, Redux store, and app-level layout.
- `frontend/src/pages/`: Home, Dashboard, Analysis, Results, and focused auth views/dialogs.
- `frontend/src/components/`: navbar/hero, uploader, profile selector, samples, analysis progress, findings/explanation/audit panels, and comparison/download.
- `frontend/src/features/`: Redux slices for scans and preferences; typed JSON contracts remain plain JavaScript modules.
- `frontend/src/services/`: Axios API client and sample assets/data.
- `backend/src/server.js`: Express app, static hosting, API mounting, startup.
- `backend/src/routes/` and `controllers/`: REST route/controller boundary.
- `backend/src/services/`: Gemini, OCR, color analysis, image normalization/transformation, audit, persistence.
- `backend/src/middleware/` and `utils/`: upload validation, CORS/security/error handling, image validation.
- `backend/prisma/`: Prisma schema and migrations.
- Root: npm workspace/scripts, route manifest, shared documentation, environment examples, and deployment instructions.

## Design direction

- **Design Movement:** contemporary editorial Swiss design with warm, tactile product details.
- **Core Principles:** calm clarity; meaningful redundancy; generous whitespace; show work rather than obscure it.
- **Color Philosophy:** warm paper and charcoal create a readable baseline; a distinctive deep teal signals the ChromaLens identity; blue and orange highlight actions and comparison states. Color-coded information is always reinforced by labels, borders or symbols.
- **Layout Paradigm:** a spacious asymmetric editorial landing hero leading into a narrow, left-anchored workspace rail and broad analysis canvas; avoid a generic centered dashboard grid.
- **Signature Elements:** a split-lens mark that resolves into labelled bars; small numbered reading steps; crisp bordered color swatches with pattern cues.
- **Interaction Philosophy:** direct manipulation, visible state changes, plain-language feedback, and reversible upload/profile/comparison choices.
- **Animation:** brief, low-amplitude fades and panel reveals; avoid motion that delays task completion; honor reduced-motion preferences.
- **Typography System:** DM Sans for interface/body and Manrope for headlines/wordmark, with clear size/weight hierarchy and tabular numerals for chart labels.
- **Brand Essence:** an accessible interpretation layer for people who cannot rely on color alone; calm, precise, empowering.
- **Brand Voice:** concise, respectful, evidence-aware. Example lines: “The labels carry the meaning—not the color.” “We couldn’t verify this legend, so we’ve marked it as uncertain.”
- **Wordmark & Logo:** custom split-lens/paired-aperture symbol beside a carefully spaced ChromaLens wordmark.
- **Signature Brand Color:** deep teal, used sparingly for the primary identity and key interactions.

## Dependencies and operating assumptions

Use JavaScript throughout application code. Use npm workspaces (frontend/backend) and pin the package-manager version in the root manifest. Register JavaScript/JSON/CSS diagnostics before application implementation. Keep secret values out of source and version control. The first deliverable is a runnable MVP and accurate setup/deployment documentation; the built-in sample path must work without user accounts, Gemini key, or Cloudinary credentials. Live Gemini, durable account/history storage, and external cloud image storage depend on their respective runtime credentials/services being configured.