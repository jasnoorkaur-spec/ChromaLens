import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import path from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import apiRoutes from './routes/apiRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import { disconnectDatabase } from './config/db.js';
import { requireMutationMarker } from './middleware/csrfMiddleware.js';

const app = express();
const frontendDist = fileURLToPath(new URL('../../frontend/dist/', import.meta.url));
const frontendIndex = path.join(frontendDist, 'index.html');
const hasFrontendBuild = existsSync(frontendIndex);
app.disable('x-powered-by');
// The deployment contract places exactly one trusted application gateway in front of this API.
app.set('trust proxy', 1);
// Managed production HTML adds platform-owned inline configuration and an HTTPS CDN runtime.
// Keep these source classes permitted; do not restrict ancestors, because Preview is cross-site.
app.use(helmet({
  frameguard: false,
  contentSecurityPolicy: {
    directives: {
      frameAncestors: null,
      imgSrc: ["'self'", 'data:', 'blob:'],
      scriptSrc: ["'self'", "'unsafe-inline'", 'https:'],
    },
  },
}));

const localOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];
const configuredOrigins = String(process.env.FRONTEND_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowedOrigins = new Set([...localOrigins, ...configuredOrigins]);
app.use(cors({
  credentials: true,
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) return callback(null, true);
    return callback(null, false);
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-ChromaLens-Request'],
  maxAge: 600,
}));
app.use(express.json({ limit: '1mb', strict: true }));
app.use(express.urlencoded({ extended: false, limit: '32kb', parameterLimit: 100 }));
app.get('/', (_request, response, next) => {
  if (hasFrontendBuild) return response.sendFile(frontendIndex);
  return response.json({ success: true, data: { name: 'ChromaLens API', health: '/api/health' } });
});
app.use('/api', requireMutationMarker);
app.use('/api', apiRoutes);
if (hasFrontendBuild) {
  app.use(express.static(frontendDist, {
    index: false,
    setHeaders(response, filePath) {
      response.setHeader('Cache-Control', filePath.includes(`${path.sep}assets${path.sep}`)
        ? 'public, max-age=31536000, immutable'
        : 'no-cache');
    },
  }));
  app.get('*', (request, response, next) => {
    if (request.path.startsWith('/api/') || !request.accepts('html')) return next();
    return response.sendFile(frontendIndex);
  });
}
app.use(notFound);
app.use(errorHandler);

const port = Number.parseInt(process.env.PORT, 10) || 3000;
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`ChromaLens API listening on port ${port}`);
});

async function shutdown() {
  server.close(async () => {
    await disconnectDatabase();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10000).unref();
}
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

export { app };
