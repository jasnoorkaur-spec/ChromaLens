import { createWorker } from 'tesseract.js';

export async function extractText(imageBuffer, onProgress = () => {}) {
  const stages = [{ stage: 'queued', status: 'started' }];
  const worker = await createWorker('eng', undefined, {
    logger: (event) => {
      if (event.status) {
        const progress = Number.isFinite(event.progress) ? Math.round(event.progress * 100) : undefined;
        stages.push({ stage: event.status, progress });
        onProgress({ status: 'active', message: `OCR: ${event.status}`, progress });
      }
    },
  });
  try {
    const { data } = await worker.recognize(imageBuffer);
    const words = (data.words || [])
      .filter((word) => word.text && word.text.trim())
      .map((word) => ({
        text: word.text.trim(),
        confidence: Number.isFinite(word.confidence) ? Math.round(word.confidence) : null,
        bbox: word.bbox ? {
          x0: word.bbox.x0,
          y0: word.bbox.y0,
          x1: word.bbox.x1,
          y1: word.bbox.y1,
        } : null,
      }));
    stages.push({ stage: 'complete', status: 'complete' });
    return { text: String(data.text || '').trim(), words, stages };
  } finally {
    await worker.terminate();
  }
}
