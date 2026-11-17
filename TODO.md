# ChromaLens delivery checklist

## Landing page, navigation, and product identity
- [x] Build a polished, responsive, uncluttered landing page containing only the navbar and hero section, with login, create-account, and try-demo actions.
- [x] Show the ChromaLens logo in the navbar, with Login and Create Account buttons.
- [x] Use the hero heading “See Beyond Colors. Understand Everything.” and description “An intelligent accessibility layer that transforms color-dependent information into experiences everyone can understand.”
- [x] Provide primary CTA “Try ChromaLens” and secondary CTA “Explore Demo”.
- [x] Include an attractive product preview showing an original color-coded chart being transformed into an accessible chart.
- [x] Use a premium, modern accessibility-focused SaaS interface: clean, minimal, professional and futuristic; warm off-white or very light neutral background; dark charcoal typography; teal, blue and orange accents; avoid excessive gradients, overly bright colors and generic AI-dashboard aesthetics; use subtle glass effects only where appropriate, rounded cards, clear spacing, subtle shadows and smooth transitions.
- [x] Keep the app responsive for desktop, tablet and mobile. Build accessibility into the design: good text contrast, keyboard navigation, visible focus indicators, descriptive labels, and never communicate status through color alone.

## Dashboard, upload, and CVD profile workflow
- [x] Create a dedicated workspace after clicking Get Started. Include a welcome heading, image upload card, recent scans, selected CVD profile, quick access to sample demonstrations, and accessibility information. The dashboard must be functional.
- [x] Let users drag and drop an image or browse files; accept PNG, JPG, JPEG and WebP; preview the uploaded image; remove or replace it; allow photographs or screenshots; validate file type and size with a reasonable upload limit such as 10 MB.
- [x] Provide a “Try Sample Image” option so judges can demonstrate the project immediately without uploading anything.
- [x] Provide Protanopia, Deuteranopia, Tritanopia and General Accessible Mode options with brief explanations. Allow profile changes before generating the transformed image, and ensure the selected profile is sent to the backend and influences the accessible output. Do not claim to medically diagnose CVD; the selected profile represents the user’s preferred accessibility settings.
- [x] Ensure all major buttons and features work; do not deliver a static UI or frontend-only prototype.

## Genuine analysis and AI explanation
- [x] When Analyze is clicked, send the image and CVD profile to the Express backend; extract visible text using Tesseract.js; detect important visual regions and dominant colors using JavaScript image processing; send the image and extracted context to Gemini Vision; generate structured analysis; display results in the frontend.
- [x] Show genuine loading stages such as Reading image, Extracting labels, Identifying visual elements, Understanding color relationships, and Preparing accessible output. Use actual processing status where available. Do not simulate completed AI processing with artificial delays.
- [x] Identify color-coded chart legends, bar and pie chart segments, status badges, warning indicators, form validation states, map regions and colored labels. Use JavaScript-based pixel processing, Sharp and OpenCV.js when necessary; suitable methods include color segmentation, pixel color clustering, connected components, contour detection and dominant color extraction. Where possible, associate detected colors with nearby text labels.
- [x] Do not assume every red element means danger or every green element means success.
- [x] Use Gemini Vision for contextual interpretation. Generate structured JSON containing image summary, detected visual elements, color-coded elements, associated labels or legends, meaning of each element when supported by image context, potential accessibility problems, and recommended improvements.
- [x] Never invent labels or meanings. If a meaning cannot be established from the image, explicitly report uncertainty. Never present a fallback result as live AI analysis.
- [x] If Gemini API is unavailable, provide a clearly labeled demo fallback using precomputed sample analysis results.

## Accessible transformation and results
- [x] Generate a new accessible version of the uploaded image. Add text labels to important visual regions; use distinguishable colors; apply patterns or textures to chart segments where possible; add borders and outlines; use symbols or icons where appropriate; improve contrast; preserve the original image’s layout and meaning as much as possible.
- [x] For charts, prioritize reconstructing the chart as a new visualization using extracted data and labels rather than blindly recoloring the original screenshot. For structured charts, use a chart-rendering library such as Chart.js. If complete reconstruction is not possible, provide a clearly identified best-effort transformation rather than presenting uncertain results as accurate.
- [x] After analysis, show a detailed results page with the original image; detected-element cards containing element name, detected color, associated label, meaning if known, and confidence or uncertainty indicator; AI-generated plain-language explanation; accessibility issues and suggested corrections; accessible version; and before-and-after comparison.
- [x] Provide a draggable comparison slider or side-by-side comparison.
- [x] Allow users to download the generated accessible image in PNG format.

## Demonstration mode
- [x] Include at least three realistic sample images: a red-green bar chart with a color-coded legend; a color-coded risk map; and a form or dashboard with green success and red error indicators.
- [x] Let users click a sample and immediately start analyzing it.
- [x] Demonstrate color detection, OCR extraction, AI explanation, accessibility recommendations, image transformation and before-and-after comparison through the sample workflow.
- [x] Use genuine processing for samples wherever possible. The demo must work without requiring judges to create an account.

## Database, authentication, and image retention
- [x] Use MySQL with Prisma ORM. Create users (id, name, email, password, created_at; unique email), cvd_preferences (id, user_id, cvd_type, preferred_palette, created_at), scan_history (id, user_id, original_image_url, transformed_image_url, cvd_type, created_at), and transformations (id, scan_id, transformation_type, transformed_image_url, created_at), with appropriate foreign keys and proper relationships.
- [x] Use Prisma migrations and environment variables for database credentials. Do not store uploaded images permanently without user consent.
- [x] Prioritize the image-analysis pipeline over building a complex authentication system. The demo must work without authentication. If authentication is included, hash passwords with bcrypt and use HTTP-only secure cookies where feasible.
- [x] Persist the selected profile and recent-scan metadata locally, while never persisting uploaded image bytes, OCR text, or the full result payload in browser storage.

## Backend API and security
- [x] Build Express REST endpoints: POST /api/analyze accepts an image and CVD profile, validates the uploaded image, performs OCR and image analysis, calls Gemini Vision and returns structured analysis; POST /api/explain generates a plain-language image explanation; POST /api/transform generates the accessible image and returns the generated image URL; POST /api/audit evaluates accessibility issues and generates recommendations; GET /api/history returns previous scans for the authenticated user; GET /api/health checks backend availability.
- [x] Use proper HTTP status codes, validation, error handling and structured JSON responses. Validate image MIME types and file extensions; set a maximum upload size; use Multer with secure file handling; configure CORS properly; use Helmet; validate API inputs; implement safe error handling; never expose Gemini API keys or database credentials; avoid permanently storing unnecessary user images.
- [x] Require `X-ChromaLens-Request: 1` on state-changing API requests, add the marker from the frontend for mutations, allow it in exact-origin CORS preflight, and reject missing markers before route handling.
- [x] Keep Gemini AI integration, OCR processing, color detection, image transformations and database operations in separate service modules. Do not put all processing logic inside route handlers.

## Architecture, dependencies, and documentation
- [x] Use JavaScript throughout, not TypeScript or Python. Frontend stack: React with Vite, Redux Toolkit, Tailwind CSS v4, Framer Motion, React Router, Axios, Lucide React and React Dropzone. Backend stack: Node.js, Express.js REST APIs, JavaScript ES modules, Prisma ORM, Multer, and Express validation/error/security middleware. AI: current supported Google Gemini JavaScript SDK with credentials only in backend environment variables. Image processing: Sharp, Tesseract.js, JavaScript Canvas/pixel processing; introduce OpenCV.js only if needed. MySQL is the relational database; Cloudinary is for uploaded and generated images; deployment instructions cover Vercel frontend, Render backend, MySQL-compatible hosting and Cloudinary.
- [x] Keep frontend components and pages modular. Suggested components: Navbar.jsx, Hero.jsx, ImageUploader.jsx, CVDSelector.jsx, AnalysisLoader.jsx, DetectedElements.jsx, ExplanationPanel.jsx, ImageComparison.jsx and SampleGallery.jsx; pages Home.jsx, Dashboard.jsx, Analysis.jsx and Results.jsx; Redux store and analysis/preferences slices; API services and assets; App.jsx and main.jsx. The structure may be adjusted while maintaining separation of responsibilities.
- [x] Keep backend modules separated into config/db.js; controllers; routes; services (geminiService.js, ocrService.js, colorDetection.js, imageProcessing.js, accessibilityService.js); middleware (uploadMiddleware.js, authMiddleware.js, errorMiddleware.js); prisma/schema.prisma; uploads; utils/imageValidation.js; server.js; package.json; and .env.example, or equivalent modular structure.
- [x] Create README.md with setup instructions, frontend and backend package.json files, .env.example files, Prisma schema, database migration instructions, API documentation, deployment instructions, all required environment variables and explanation of how to configure them.
- [x] Document local execution: frontend `npm install` and `npm run dev`; backend `npm install`, `npx prisma generate`, `npx prisma migrate dev` and `npm run dev`.

## End-to-end delivery outcome
- [x] Deliver a polished, responsive landing page; upload flow; selectable CVD profile; Node.js backend image processing; useful OCR and visual analysis; contextual Gemini explanation when API credentials are available; accessible transformed image; working before-and-after comparison; PNG download; and at least three functioning sample demonstrations.
- [x] Implement error handling and ensure the application runs locally without critical errors. Verify the complete image-analysis workflow and resolve runtime errors and broken components.
- [x] Keep the implementation maintainable, and explain implemented features, setup instructions, environment variables, necessary compromises and remaining limitations.
