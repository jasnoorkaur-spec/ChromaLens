import { analyzeImageRequest, getAuditFromAnalysis } from '../services/analysisService.js';
import { sampleFixtures } from '../services/sampleFixtures.js';
import { SAMPLE_IDS, validateSampleId } from '../utils/validation.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';
import { randomBytes } from 'node:crypto';
import { beginAnalysisProgress, finishAnalysisProgress, getAnalysisProgress, isValidAnalysisId, updateAnalysisProgress } from '../services/analysisProgress.js';

function responseData(request, onProgress) {
  return analyzeImageRequest({
    file: request.file,
    sampleId: request.body?.sampleId,
    cvdType: request.body?.cvdType || 'general-accessible',
    saveHistory: request.body?.saveHistory,
    user: request.user || null,
    onProgress,
  });
}

export const analyze = asyncHandler(async (request, response) => {
  const analysisId = String(request.body?.analysisId || randomBytes(16).toString('hex'));
  if (!isValidAnalysisId(analysisId) || !beginAnalysisProgress(analysisId)) {
    return response.status(400).json({ success: false, error: { code: 'INVALID_ANALYSIS_ID', message: 'The analysis progress identifier is invalid.' } });
  }
  try {
    const data = await responseData(request, (event) => updateAnalysisProgress(analysisId, event));
    finishAnalysisProgress(analysisId, 'complete', 'Analysis complete.');
    return response.status(200).json({ success: true, data });
  } catch (error) {
    finishAnalysisProgress(analysisId, 'failed', error.status && error.status < 500 ? error.message : 'Analysis could not be completed.');
    throw error;
  }
});

export const analysisProgress = asyncHandler(async (request, response) => {
  const { analysisId } = request.params;
  if (!isValidAnalysisId(analysisId)) {
    return response.status(400).json({ success: false, error: { code: 'INVALID_ANALYSIS_ID', message: 'The analysis progress identifier is invalid.' } });
  }
  const data = getAnalysisProgress(analysisId) || {
    analysisId,
    status: 'waiting',
    message: 'Waiting for the analysis request to reach the backend.',
    stages: [
      { id: 'reading-image', label: 'Reading image', status: 'pending', progress: 0 },
      { id: 'extracting-labels', label: 'Extracting labels', status: 'pending', progress: 0 },
      { id: 'identifying-visual-elements', label: 'Identifying visual elements', status: 'pending', progress: 0 },
      { id: 'understanding-color-relationships', label: 'Understanding color relationships', status: 'pending', progress: 0 },
      { id: 'preparing-accessible-output', label: 'Preparing accessible output', status: 'pending', progress: 0 },
    ],
  };
  return response.json({ success: true, data });
});

export const explain = asyncHandler(async (request, response) => {
  const data = request.file || request.body?.sampleId
    ? await responseData(request)
    : request.body?.data || request.body?.analysis;
  if (data && typeof data === 'object' && typeof data.summary === 'string') {
    return response.json({ success: true, data: { summary: data.summary, ai: data.ai || { source: 'local-only', status: 'unavailable', message: 'Explanation supplied from existing analysis.' } } });
  }
  return response.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Provide an image or sampleId, or a prior analysis object in data.' } });
});

export const transform = asyncHandler(async (request, response) => {
  const data = request.file || request.body?.sampleId
    ? await responseData(request)
    : request.body?.data || request.body?.analysis;
  if (!data || typeof data.transformedImageUrl !== 'string' || !data.transformedImageUrl.startsWith('data:image/png;base64,')) {
    return response.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Provide an image or sampleId, or a prior analysis object with a PNG transformation.' } });
  }
  return response.json({ success: true, data: { id: data.id || null, transformedImageUrl: data.transformedImageUrl, transformationNote: data.transformationNote || 'Best-effort transformation; not a verified reconstruction.' } });
});

export const audit = asyncHandler(async (request, response) => {
  const data = request.file || request.body?.sampleId
    ? await responseData(request)
    : request.body?.data || request.body?.analysis;
  if (data && Array.isArray(data.issues) && Array.isArray(data.recommendations)) {
    return response.json({ success: true, data: getAuditFromAnalysis(data) });
  }
  return response.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Provide an image or sampleId, or a prior analysis object containing issues and recommendations.' } });
});

export const health = asyncHandler(async (_request, response) => {
  const { checkDatabase } = await import('../config/db.js');
  const dbAvailable = await checkDatabase();
  return response.status(200).json({
    success: true,
    data: {
      status: 'ok',
      services: { api: 'available', database: dbAvailable ? 'available' : 'unavailable', gemini: process.env.GEMINI_API_KEY?.trim() ? 'configured' : 'not-configured' },
      time: new Date().toISOString(),
    },
  });
});

export const sampleList = asyncHandler(async (_request, response) => {
  return response.json({
    success: true,
    data: [...SAMPLE_IDS].map((id) => ({ id, title: sampleFixtures[id].title, summary: sampleFixtures[id].summary })),
  });
});
