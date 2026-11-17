import { configureStore, createSlice } from '@reduxjs/toolkit';

const PROFILE_STORAGE_KEY = 'chromalens.profile.v1';
const RECENT_STORAGE_KEY = 'chromalens.recent-scans.v1';
const SUPPORTED_PROFILES = new Set(['protanopia', 'deuteranopia', 'tritanopia', 'general-accessible']);
const GENERIC_SCAN_LABEL = 'Visual accessibility scan';

function readStorage(key, fallback) {
  try {
    const value = globalThis.localStorage?.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function safeProfile(value) {
  return SUPPORTED_PROFILES.has(value) ? value : 'general-accessible';
}

function scanMetadata(scan) {
  if (!scan || typeof scan !== 'object') return null;
  const id = typeof scan.id === 'string' || typeof scan.id === 'number' ? String(scan.id).slice(0, 120) : '';
  if (!id) return null;
  const rawDate = scan.createdAt || scan.created_at;
  let timestamp = '';
  if (rawDate) {
    const date = new Date(rawDate);
    if (Number.isFinite(date.getTime())) timestamp = date.toISOString();
  }
  return {
    id,
    profile: safeProfile(scan.profile || scan.cvdType),
    summary: GENERIC_SCAN_LABEL,
    createdAt: timestamp,
    historySaved: Boolean(scan.historySaved),
  };
}

const persistedRecent = readStorage(RECENT_STORAGE_KEY, []);
const initialRecent = Array.isArray(persistedRecent)
  ? persistedRecent.map(scanMetadata).filter(Boolean).slice(0, 8)
  : [];
const persistedProfile = safeProfile(readStorage(PROFILE_STORAGE_KEY, 'general-accessible'));

const scanSlice = createSlice({
  name: 'scan',
  initialState: { result: null, recent: initialRecent, selectedImageName: '' },
  reducers: {
    setSelectedImageName(state, action) { state.selectedImageName = action.payload || ''; },
    setResult(state, action) {
      state.result = action.payload;
      const entry = {
        id: action.payload?.id || `session-${Date.now()}`,
        profile: action.payload?.profile || 'general-accessible',
        summary: action.payload?.summary || 'Accessibility scan',
        createdAt: new Date().toISOString(),
        historySaved: Boolean(action.payload?.historySaved),
      };
      state.recent = [entry, ...state.recent.filter((item) => item.id !== entry.id)].slice(0, 8);
    },
    setRecent(state, action) { state.recent = Array.isArray(action.payload) ? action.payload : []; },
    clearResult(state) { state.result = null; state.selectedImageName = ''; },
  },
});

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState: { cvdType: persistedProfile },
  reducers: { setCvdType(state, action) { state.cvdType = safeProfile(action.payload); } },
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, checked: false },
  reducers: {
    setUser(state, action) { state.user = action.payload || null; state.checked = true; },
    setAuthChecked(state) { state.checked = true; },
  },
});

export const { setResult, setRecent, clearResult, setSelectedImageName } = scanSlice.actions;
export const { setCvdType } = preferencesSlice.actions;
export const { setUser, setAuthChecked } = authSlice.actions;

export const store = configureStore({
  reducer: { scan: scanSlice.reducer, preferences: preferencesSlice.reducer, auth: authSlice.reducer },
});

let previousProfile;
let previousRecent;
store.subscribe(() => {
  try {
    const state = store.getState();
    const profile = safeProfile(state.preferences.cvdType);
    const recent = state.scan.recent.map(scanMetadata).filter(Boolean).slice(0, 8);
    const recentJson = JSON.stringify(recent);
    if (profile !== previousProfile) {
      globalThis.localStorage?.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
      previousProfile = profile;
    }
    if (recentJson !== previousRecent) {
      globalThis.localStorage?.setItem(RECENT_STORAGE_KEY, recentJson);
      previousRecent = recentJson;
    }
  } catch {
    // Private browsing or storage restrictions must not interrupt in-memory use.
  }
});
