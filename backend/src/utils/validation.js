export const CVD_TYPES = new Set([
  'protanopia',
  'deuteranopia',
  'tritanopia',
  'general-accessible',
]);

export const SAMPLE_IDS = new Set(['bar-chart', 'risk-map', 'status-form']);

export function parseBoolean(value, fallback = false) {
  if (value === undefined || value === null || value === '') return fallback;
  if (value === true || value === 'true' || value === '1') return true;
  if (value === false || value === 'false' || value === '0') return false;
  return null;
}

export function validateCvdType(value) {
  return typeof value === 'string' && CVD_TYPES.has(value);
}

export function validateSampleId(value) {
  return typeof value === 'string' && SAMPLE_IDS.has(value);
}

export function toDataUrl(buffer, mimeType = 'image/png') {
  return `data:${mimeType};base64,${buffer.toString('base64')}`;
}

export function normalizeEmail(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}
