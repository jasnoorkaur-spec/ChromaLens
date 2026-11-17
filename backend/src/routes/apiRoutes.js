import { Router } from 'express';
import { analyze, analysisProgress, audit, explain, health, sampleList, transform } from '../controllers/analysisController.js';
import { history } from '../controllers/historyController.js';
import { login, logout, me, register } from '../controllers/authController.js';
import { requireAuth, optionalAuth } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

const router = Router();
router.get('/health', health);
router.get('/samples', sampleList);
router.get('/analyze/:analysisId/progress', analysisProgress);
router.post('/analyze', upload, optionalAuth, analyze);
router.post('/explain', upload, optionalAuth, explain);
router.post('/transform', upload, optionalAuth, transform);
router.post('/audit', upload, optionalAuth, audit);
router.get('/history', requireAuth, history);
router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/logout', logout);
router.get('/auth/me', optionalAuth, asyncHandler(me));

export default router;
