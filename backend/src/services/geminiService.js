import { GoogleGenAI } from '@google/genai';

const responseSchema = {
  type: 'object',
  properties: {
    summary: { type: 'string' },
    detectedElements: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          color: { type: 'string' },
          label: { type: 'string' },
          meaning: { type: 'string' },
          confidence: { type: 'number' },
          uncertainty: { type: 'string' },
        },
        required: ['name', 'color', 'label', 'meaning', 'confidence', 'uncertainty'],
      },
    },
    issues: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          severity: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
        },
        required: ['severity', 'title', 'description'],
      },
    },
    recommendations: { type: 'array', items: { type: 'string' } },
  },
  required: ['summary', 'detectedElements', 'issues', 'recommendations'],
};

export function hasGeminiKey() {
  return Boolean(process.env.GEMINI_API_KEY?.trim());
}

export async function analyzeWithGemini({ imageBuffer, ocr, colors, cvdType, sampleContext }) {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) return null;
  const model = process.env.GEMINI_MODEL?.trim() || 'gemini-3.8-flash';
  if (!/^gemini-[a-z0-9][a-z0-9._-]{0,80}$/i.test(model)) {
    throw new Error('GEMINI_MODEL is not a supported Gemini model identifier.');
  }

  const ai = new GoogleGenAI({ apiKey, httpOptions: { apiVersion: 'v1beta' } });
  const context = {
    selectedAccessibilityProfile: cvdType,
    OCRText: ocr.text.slice(0, 12000),
    dominantColors: colors,
    preparedDemoContext: sampleContext || null,
  };
  const prompt = `Analyze this image for accessibility, not medical diagnosis. Use only labels and relationships genuinely supported by the image or the supplied prepared demo context. Never infer a category meaning from hue alone. If a label or meaning is uncertain, say so plainly in the meaning or uncertainty fields and use a low confidence value. Do not invent chart values, legend associations, or map facts. Be concise and actionable. Context: ${JSON.stringify(context)}`;

  const timeoutMs = 8000;
  let timer;
  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error(`Gemini API request timed out after ${timeoutMs}ms.`));
    }, timeoutMs);
    timer?.unref?.();
  });

  let interaction;
  try {
    interaction = await Promise.race([
      ai.interactions.create({
        model,
        store: false,
        input: [
          { type: 'text', text: prompt },
          { type: 'image', data: imageBuffer.toString('base64'), mime_type: 'image/png' },
        ],
        response_format: {
          type: 'text',
          mime_type: 'application/json',
          schema: responseSchema,
        },
      }),
      timeoutPromise,
    ]);
  } finally {
    clearTimeout(timer);
  }

  const raw = interaction.output_text;
  if (!raw) throw new Error('Gemini returned an empty response.');
  const parsed = JSON.parse(raw);
  if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.detectedElements)) {
    throw new Error('Gemini returned an invalid structured response.');
  }
  return {
    summary: String(parsed.summary || '').slice(0, 2400),
    detectedElements: parsed.detectedElements.slice(0, 20).map((item) => ({
      name: String(item.name || 'Visual element').slice(0, 180),
      color: /^#[0-9a-f]{6}$/i.test(String(item.color)) ? String(item.color).toUpperCase() : 'Unknown',
      label: String(item.label || 'No verified label').slice(0, 180),
      meaning: String(item.meaning || 'Meaning could not be verified from the available context.').slice(0, 500),
      confidence: Number.isFinite(Number(item.confidence)) ? Math.max(0, Math.min(1, Number(item.confidence))) : 0,
      uncertainty: String(item.uncertainty || 'Interpretation may be uncertain.').slice(0, 500),
    })),
    issues: Array.isArray(parsed.issues) ? parsed.issues.slice(0, 12).map((item) => ({
      severity: String(item.severity || 'informational').slice(0, 40),
      title: String(item.title || 'Accessibility consideration').slice(0, 180),
      description: String(item.description || '').slice(0, 500),
    })) : [],
    recommendations: Array.isArray(parsed.recommendations)
      ? parsed.recommendations.slice(0, 12).map((value) => String(value).slice(0, 400))
      : [],
  };
}
