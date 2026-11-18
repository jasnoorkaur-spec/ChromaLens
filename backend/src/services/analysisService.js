import { randomBytes } from 'node:crypto';
import { getDb } from '../config/db.js';
import { validateAndNormalizeImage } from '../utils/imageValidation.js';
import { parseBoolean, toDataUrl, validateCvdType, validateSampleId } from '../utils/validation.js';
import { detectDominantColors, colorsToLocalElements } from './colorDetection.js';
import { extractText } from './ocrService.js';
import { renderSample, createBestEffortTransformation, getProfileLabel } from './imageProcessing.js';
import { sampleFixtures } from './sampleFixtures.js';
import { analyzeWithGemini } from './geminiService.js';
import { createLocalAudit, sanitizeIssues } from './accessibilityService.js';
import { cloudinaryConfigured, persistConsentedImages } from './cloudinaryService.js';

const normalizeAiElements = (items) => (Array.isArray(items) ? items : []).slice(0, 20).map((item) => ({
  name: String(item.name || 'Visual element').slice(0, 180),
  color: String(item.color || 'Unknown').slice(0, 24),
  label: String(item.label || 'No verified label').slice(0, 180),
  meaning: String(item.meaning || 'Meaning could not be verified from available context.').slice(0, 500),
  confidence: Math.max(0, Math.min(1, Number(item.confidence) || 0)),
  uncertainty: String(item.uncertainty || 'Interpretation may be uncertain.').slice(0, 500),
  symbol: item.symbol ? String(item.symbol).slice(0, 10) : undefined,
  pattern: item.pattern ? String(item.pattern).slice(0, 30) : undefined,
  patternName: item.patternName ? String(item.patternName).slice(0, 60) : undefined,
}));

function getSafeGeminiFailure(error) {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const rawMessage = String(error?.message || 'Provider request failed');
  const redactedMessage = apiKey ? rawMessage.replaceAll(apiKey, '[redacted]') : rawMessage;
  const message = redactedMessage
    .replace(/\bAIza[0-9A-Za-z_-]{20,}\b/g, '[redacted]')
    .replace(/((?:api[_ -]?key|authorization)\s*[:=]\s*)[^,\s;]+/gi, '$1[redacted]')
    .replace(/\s+/g, ' ')
    .slice(0, 220);
  const status = Number(error?.status || error?.statusCode);
  return `${Number.isInteger(status) && status > 0 ? `HTTP ${status}: ` : ''}${message}`;
}

async function maybeSaveHistory({ user, consent, cvdType, originalBuffer, transformedBuffer }) {
  if (!user || !consent) return null;
  const db = getDb();
  if (!db) return null;
  let imageUrls = { originalImageUrl: null, transformedImageUrl: null };
  if (cloudinaryConfigured()) {
    try {
      imageUrls = await persistConsentedImages(originalBuffer, transformedBuffer);
    } catch {
      // Metadata may still be saved; the response never exposes provider credentials/errors.
    }
  }
  try {
    const preference = cvdType === 'general-accessible' ? 'high-contrast-patterns' : 'color-plus-labels';
    return await db.$transaction(async (tx) => {
      const scan = await tx.scanHistory.create({
        data: {
          userId: user.id,
          originalImageUrl: imageUrls.originalImageUrl,
          transformedImageUrl: imageUrls.transformedImageUrl,
          cvdType,
          transformations: {
            create: { type: 'accessible-best-effort-png', url: imageUrls.transformedImageUrl },
          },
        },
      });
      await tx.cvdPreference.create({
        data: { userId: user.id, cvdType, preferredPalette: preference },
      });
      return scan;
    });
  } catch {
    return null;
  }
}

export async function analyzeImageRequest({ file, sampleId, cvdType = 'general-accessible', saveHistory = false, user = null, onProgress = () => {} }) {
  if (!validateCvdType(cvdType)) {
    const error = new Error('cvdType must be protanopia, deuteranopia, tritanopia, or general-accessible.');
    error.status = 400;
    throw error;
  }
  if (sampleId !== undefined && sampleId !== '' && !validateSampleId(sampleId)) {
    const error = new Error('sampleId must be bar-chart, risk-map, or status-form.');
    error.status = 400;
    throw error;
  }
  if (file && sampleId) {
    const error = new Error('Provide either an uploaded image or a sampleId, not both.');
    error.status = 400;
    throw error;
  }
  const consent = parseBoolean(saveHistory, false);
  if (consent === null) {
    const error = new Error('saveHistory must be true or false.');
    error.status = 400;
    throw error;
  }
  if (!file && !sampleId) {
    const error = new Error('Provide multipart image or a known sampleId.');
    error.status = 400;
    throw error;
  }

  let originalBuffer;
  let fixture = null;
  onProgress({ stage: 'reading-image', status: 'active', message: 'Opening and validating the image.' });
  if (sampleId) {
    fixture = sampleFixtures[sampleId];
    originalBuffer = await renderSample(sampleId, false);
  } else {
    const normalized = await validateAndNormalizeImage(file.buffer, file.mimetype, file.originalname);
    originalBuffer = normalized.buffer;
  }
  onProgress({ stage: 'reading-image', status: 'complete', message: 'Image is readable and validated.' });

  onProgress({ stage: 'extracting-labels', status: 'active', message: 'Tesseract.js is reading visible text.' });
  let ocr;
  try {
    ocr = await extractText(originalBuffer, (event) => onProgress({
      stage: 'extracting-labels',
      status: 'active',
      progress: event.progress,
      message: event.message,
    }));
  } catch {
    ocr = { text: '', words: [], stages: [{ stage: 'unavailable', status: 'OCR could not be initialized.' }] };
  }
  onProgress({ stage: 'extracting-labels', status: 'complete', message: ocr.text ? 'Visible text extraction is complete.' : 'OCR returned no readable text; continuing with visual analysis.' });

  onProgress({ stage: 'identifying-visual-elements', status: 'active', message: 'Sampling image pixels and dominant colors.' });
  const dominantColors = await detectDominantColors(originalBuffer);
  onProgress({ stage: 'identifying-visual-elements', status: 'complete', message: 'Dominant colors and visual signals are identified.' });

  onProgress({ stage: 'understanding-color-relationships', status: 'active', message: process.env.GEMINI_API_KEY?.trim() ? 'Gemini Vision is interpreting the image context.' : 'Checking whether contextual AI is available.' });
  let interpretation = null;
  let providerFailed = false;
  try {
    interpretation = await analyzeWithGemini({
      imageBuffer: originalBuffer,
      ocr,
      colors: dominantColors,
      cvdType,
      sampleContext: fixture ? {
        summary: fixture.summary,
        detectedElements: fixture.detectedElements,
        issues: fixture.issues,
        recommendations: fixture.recommendations,
      } : null,
    });
  } catch (error) {
    providerFailed = true;
    console.warn(`Gemini contextual analysis failed: ${getSafeGeminiFailure(error)}`);
  }
  onProgress({
    stage: 'understanding-color-relationships',
    status: 'complete',
    message: interpretation ? 'Contextual Gemini analysis is complete.' : 'Using the clearly labeled local or prepared-demo result.',
  });

  let ai;
  let summary;
  let detectedElements;
  let audit;
  if (interpretation) {
    ai = {
      source: 'live-gemini',
      status: 'live',
      message: 'Contextual interpretation was returned by live Gemini analysis.',
    };
    summary = interpretation.summary || 'Gemini returned no summary; see the extracted evidence below.';
    detectedElements = interpretation.detectedElements.length
      ? normalizeAiElements(interpretation.detectedElements)
      : colorsToLocalElements(dominantColors);
    const localAudit = createLocalAudit({ colors: dominantColors });
    audit = {
      issues: interpretation.issues.length ? interpretation.issues : localAudit.issues,
      recommendations: interpretation.recommendations.length ? interpretation.recommendations : localAudit.recommendations,
    };
  } else if (fixture) {
    ai = {
      source: 'prepared-demo-fallback',
      status: 'fallback',
      message: providerFailed
        ? 'Live Gemini was unavailable; this is prepared demo analysis combined with fresh local OCR and color results.'
        : 'Live Gemini is not configured; this is prepared demo analysis combined with fresh local OCR and color results.',
    };
    summary = fixture.summary;
    detectedElements = normalizeAiElements(fixture.detectedElements);
    audit = { issues: fixture.issues, recommendations: fixture.recommendations };
  } else {
    ai = {
      source: 'local-only',
      status: 'unavailable',
      message: 'Gemini is unavailable; this result contains local OCR and pixel analysis only. Color meanings are not inferred.',
    };
    summary = 'Image processed locally. Extracted text and dominant colors are reported; color meaning remains unverified without contextual analysis.';
    detectedElements = colorsToLocalElements(dominantColors);
    audit = createLocalAudit({ colors: dominantColors });
  }

  onProgress({ stage: 'preparing-accessible-output', status: 'active', message: 'Creating the accessible PNG transformation.' });
  const transformedBuffer = sampleId
    ? await renderSample(sampleId, true, cvdType)
    : await createBestEffortTransformation(originalBuffer, dominantColors, cvdType);
  onProgress({ stage: 'preparing-accessible-output', status: 'complete', message: 'Accessible output is ready.' });

  const savedScan = await maybeSaveHistory({
    user,
    consent,
    cvdType,
    originalBuffer,
    transformedBuffer,
  });
  const id = savedScan?.id || randomBytes(15).toString('hex');
  const profileLabel = getProfileLabel(cvdType);
  const outputNote = sampleId
    ? `Prepared accessible PNG reconstruction using the ${profileLabel} palette with explicit labels, patterns or symbols, and contrast; sample context is illustrative and not a medical adaptation.`
    : `Best-effort labeled PNG aid for the ${profileLabel} profile: it preserves the source composition and adds profile-colored swatch outlines. This is not a verified reconstruction and does not establish color meanings.`;

  return {
    id,
    profile: cvdType,
    summary,
    detectedElements,
    ocr: { text: ocr.text, words: ocr.words, stages: ocr.stages },
    dominantColors,
    issues: sanitizeIssues(audit.issues),
    recommendations: audit.recommendations.slice(0, 12).map((item) => String(item).slice(0, 400)),
    chartData: fixture?.chartData || null,
    ai,
    transformedImageUrl: toDataUrl(transformedBuffer),
    originalImageUrl: toDataUrl(originalBuffer),
    transformationNote: outputNote,
    historySaved: Boolean(savedScan),
    createdAt: savedScan?.createdAt || new Date().toISOString(),
    persistenceNote: consent && !savedScan
      ? 'History was not saved: sign in and ensure the configured database is available.'
      : undefined,
  };
}

export function getAuditFromAnalysis(data) {
  return {
    issues: sanitizeIssues(data.issues),
    recommendations: Array.isArray(data.recommendations) ? data.recommendations.slice(0, 12) : [],
  };
}
