import { getDb } from '../config/db.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

export const history = asyncHandler(async (request, response) => {
  const db = getDb();
  if (!db) {
    return response.status(503).json({ success: false, error: { code: 'DATABASE_UNAVAILABLE', message: 'Scan history is unavailable until the database is configured and reachable.' } });
  }
  const parsedLimit = Number.parseInt(request.query.limit, 10);
  const take = Number.isInteger(parsedLimit) ? Math.max(1, Math.min(50, parsedLimit)) : 20;
  try {
    const scans = await db.scanHistory.findMany({
      where: { userId: request.user.id },
      orderBy: { createdAt: 'desc' },
      take,
      select: { id: true, cvdType: true, originalImageUrl: true, transformedImageUrl: true, createdAt: true },
    });
    return response.json({ success: true, data: { scans } });
  } catch {
    return response.status(503).json({ success: false, error: { code: 'DATABASE_UNAVAILABLE', message: 'Scan history is temporarily unavailable.' } });
  }
});
