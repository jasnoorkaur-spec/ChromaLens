import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true,
  timeout: 60000,
  headers: { Accept: 'application/json' },
});

api.interceptors.request.use((config) => {
  if (['post', 'put', 'patch', 'delete'].includes(String(config.method || 'get').toLowerCase())) {
    config.headers.set('X-ChromaLens-Request', '1');
  }
  return config;
});

export function getErrorMessage(error, fallback = 'The request could not be completed.') {
  const apiError = error?.response?.data?.error;
  const message = typeof apiError === 'string'
    ? apiError
    : apiError?.message || error?.response?.data?.message || error?.message;
  if (!error?.response && error?.code === 'ERR_NETWORK') {
    return 'The analysis service is unavailable right now. Your image was not analyzed. Please try again when the service is available.';
  }
  return typeof message === 'string' && message.trim() ? message : fallback;
}

const waitForPoll = (milliseconds) => new Promise((resolve) => window.setTimeout(resolve, milliseconds));

export async function analyzeImage({ image, cvdType, sampleId, saveHistory, onProgress }) {
  const body = new FormData();
  if (!sampleId) {
    if (!image) throw new Error('Choose an image first.');
    body.append('image', image);
  }
  body.append('cvdType', cvdType);
  if (sampleId) body.append('sampleId', sampleId);
  body.append('saveHistory', String(Boolean(saveHistory)));
  const analysisId = globalThis.crypto?.randomUUID?.()
    || `analysis-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  body.append('analysisId', analysisId);

  let polling = true;
  const progressLoop = (async () => {
    while (polling) {
      try {
        const response = await api.get(`/analyze/${encodeURIComponent(analysisId)}/progress`);
        if (response.data?.data && typeof onProgress === 'function') onProgress(response.data.data);
        if (['complete', 'failed'].includes(response.data?.data?.status)) break;
      } catch {
        // The main request owns the final error; progress polling must not conceal it.
      }
      if (polling) await waitForPoll(450);
    }
  })();

  try {
    const response = await api.post('/analyze', body, {
      onUploadProgress(event) {
        if (typeof onProgress !== 'function' || !event.total) return;
        onProgress({
          status: 'uploading',
          message: 'Uploading image to the analysis service.',
          uploadProgress: Math.min(100, Math.round((event.loaded / event.total) * 100)),
        });
      },
    });
    return response.data;
  } finally {
    polling = false;
    await progressLoop;
  }
}

export async function fetchHistory() {
  const response = await api.get('/history');
  return response.data;
}

export async function fetchCurrentUser() {
  const response = await api.get('/auth/me');
  return response.data;
}

export async function login(credentials) {
  const response = await api.post('/auth/login', credentials);
  return response.data;
}

export async function register(details) {
  const response = await api.post('/auth/register', details);
  return response.data;
}

export async function logout() {
  const response = await api.post('/auth/logout');
  return response.data;
}

export default api;
