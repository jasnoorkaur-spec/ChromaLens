const STAGES = [
  { id: 'reading-image', label: 'Reading image' },
  { id: 'extracting-labels', label: 'Extracting labels' },
  { id: 'identifying-visual-elements', label: 'Identifying visual elements' },
  { id: 'understanding-color-relationships', label: 'Understanding color relationships' },
  { id: 'preparing-accessible-output', label: 'Preparing accessible output' },
];

const progressRecords = new Map();
const RETENTION_MS = 2 * 60 * 1000;
const OPERATION_ID_PATTERN = /^[a-zA-Z0-9_-]{12,80}$/;

function snapshot(record) {
  return {
    analysisId: record.analysisId,
    status: record.status,
    message: record.message,
    stages: record.stages.map((stage) => ({ ...stage })),
    updatedAt: record.updatedAt,
  };
}

export function beginAnalysisProgress(analysisId) {
  if (!OPERATION_ID_PATTERN.test(String(analysisId || ''))) return false;
  progressRecords.set(analysisId, {
    analysisId,
    status: 'processing',
    message: 'The analysis request has been received.',
    stages: STAGES.map((stage) => ({ ...stage, status: 'pending', progress: 0, message: '' })),
    updatedAt: Date.now(),
  });
  return true;
}

export function updateAnalysisProgress(analysisId, event = {}) {
  const record = progressRecords.get(analysisId);
  const stageIndex = STAGES.findIndex((stage) => stage.id === event.stage);
  if (!record || stageIndex < 0) return;

  record.stages = record.stages.map((stage, index) => {
    if (index < stageIndex) return { ...stage, status: 'complete', progress: 100 };
    if (index === stageIndex) {
      const progress = Number.isFinite(event.progress)
        ? Math.max(0, Math.min(100, Math.round(event.progress)))
        : event.status === 'complete' ? 100 : stage.progress;
      return {
        ...stage,
        status: event.status === 'complete' ? 'complete' : 'active',
        progress,
        message: typeof event.message === 'string' ? event.message.slice(0, 180) : '',
      };
    }
    return stage;
  });
  record.message = typeof event.message === 'string' ? event.message.slice(0, 180) : '';
  record.status = 'processing';
  record.updatedAt = Date.now();
}

export function finishAnalysisProgress(analysisId, status, message) {
  const record = progressRecords.get(analysisId);
  if (!record) return;
  if (status === 'complete') {
    record.stages = record.stages.map((stage) => ({ ...stage, status: 'complete', progress: 100 }));
  } else {
    const active = record.stages.findIndex((stage) => stage.status === 'active');
    if (active >= 0) record.stages[active] = { ...record.stages[active], status: 'failed' };
  }
  record.status = status;
  record.message = String(message || (status === 'complete' ? 'Analysis complete.' : 'Analysis could not be completed.')).slice(0, 180);
  record.updatedAt = Date.now();
}

export function getAnalysisProgress(analysisId) {
  const record = progressRecords.get(analysisId);
  if (!record) return null;
  if (Date.now() - record.updatedAt > RETENTION_MS) {
    progressRecords.delete(analysisId);
    return null;
  }
  return snapshot(record);
}

export function isValidAnalysisId(analysisId) {
  return OPERATION_ID_PATTERN.test(String(analysisId || ''));
}
