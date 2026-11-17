import sharp from 'sharp';
import { sampleFixtures } from './sampleFixtures.js';
import { toDataUrl } from '../utils/validation.js';

const esc = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');
const svgWrap = (body) => `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800"><rect width="1200" height="800" fill="#fff"/>${body}</svg>`;
const text = (x, y, value, size = 24, color = '#202A2E', weight = 500) => `<text x="${x}" y="${y}" font-family="Arial, sans-serif" font-size="${size}" fill="${color}" font-weight="${weight}">${esc(value)}</text>`;

const PROFILE_PALETTES = {
  protanopia: {
    label: 'Protanopia',
    series: [
      { fill: '#005B86', pattern: '#FFFFFF' },
      { fill: '#B64E00', pattern: '#FFFFFF' },
    ],
    risk: {
      low: { background: '#DCEBF2', pattern: '#285D77' },
      moderate: { background: '#FBECC8', pattern: '#76500D' },
      high: { background: '#F1DCD8', pattern: '#78332E' },
    },
    status: { success: '#005B86', successText: '#003F5D', error: '#B64E00', errorText: '#7B3500', primary: '#244F76' },
  },
  deuteranopia: {
    label: 'Deuteranopia',
    series: [
      { fill: '#48559C', pattern: '#FFFFFF' },
      { fill: '#0D746B', pattern: '#FFFFFF' },
    ],
    risk: {
      low: { background: '#DDEAF2', pattern: '#285D77' },
      moderate: { background: '#F6E4C9', pattern: '#76500D' },
      high: { background: '#EBDDE8', pattern: '#78332E' },
    },
    status: { success: '#0D746B', successText: '#094B46', error: '#984577', errorText: '#6A3053', primary: '#3E5477' },
  },
  tritanopia: {
    label: 'Tritanopia',
    series: [
      { fill: '#913B63', pattern: '#FFFFFF' },
      { fill: '#426B2D', pattern: '#FFFFFF' },
    ],
    risk: {
      low: { background: '#DFEBD8', pattern: '#315D29' },
      moderate: { background: '#F6E5C9', pattern: '#76500D' },
      high: { background: '#F0DFE2', pattern: '#78332E' },
    },
    status: { success: '#426B2D', successText: '#2A481C', error: '#913B63', errorText: '#672744', primary: '#51436F' },
  },
  'general-accessible': {
    label: 'General Accessible Mode',
    series: [
      { fill: '#176A93', pattern: '#FFFFFF' },
      { fill: '#A84800', pattern: '#FFFFFF' },
    ],
    risk: {
      low: { background: '#DCEBEA', pattern: '#285D77' },
      moderate: { background: '#F7E7C7', pattern: '#76500D' },
      high: { background: '#F1DDDE', pattern: '#78332E' },
    },
    status: { success: '#28754F', successText: '#1B553A', error: '#A33232', errorText: '#852727', primary: '#234F76' },
  },
};

function getAccessiblePalette(cvdType) {
  return PROFILE_PALETTES[cvdType] || PROFILE_PALETTES['general-accessible'];
}

export function getProfileLabel(cvdType) {
  return getAccessiblePalette(cvdType).label;
}

function originalSampleSvg(sampleId) {
  const fixture = sampleFixtures[sampleId];
  if (sampleId === 'bar-chart') {
    const bars = fixture.chartData.map((item, i) => {
      const x = 210 + i * 190;
      const emailHeight = item.email * 3.1;
      const chatHeight = item.chat * 3.1;
      return `<rect x="${x}" y="${520 - emailHeight}" width="54" height="${emailHeight}" fill="#D64B45"/><rect x="${x + 62}" y="${520 - chatHeight}" width="54" height="${chatHeight}" fill="#32966C"/>${text(x + 47, 566, item.q, 20, '#374249', 600)}`;
    }).join('');
    const ticks = [0, 20, 40, 60, 80].map((value) => `<line x1="160" y1="${520 - value * 3.1}" x2="1000" y2="${520 - value * 3.1}" stroke="#E3E7E8"/>${text(115, 527 - value * 3.1, String(value), 16, '#59636A')}`).join('');
    return svgWrap(`${text(90, 80, fixture.title, 32, '#202A2E', 700)}${text(90, 120, 'Requests (illustrative counts)', 18, '#59636A')}${ticks}<line x1="160" y1="520" x2="1000" y2="520" stroke="#55616A" stroke-width="2"/>${bars}<rect x="300" y="640" width="24" height="24" fill="#D64B45"/>${text(338, 660, 'Email', 20)}<rect x="490" y="640" width="24" height="24" fill="#32966C"/>${text(528, 660, 'Chat', 20)}${text(90, 740, 'Illustrative sample data', 16, '#68737B')}`);
  }

  if (sampleId === 'risk-map') {
    const regions = fixture.regions.map((region, index) => {
      const fill = /^#[0-9a-f]{6}$/i.test(region.color) ? region.color : '#808080';
      const shape = index % 2
        ? `<path d="M${region.x - 60},${region.y - 45} l70,-8 24,48 -20,44 -66,-4 -16,-40z" fill="${fill}" stroke="#fff" stroke-width="5"/>`
        : `<path d="M${region.x - 55},${region.y - 42} l62,-15 35,34 -12,50 -74,9 -22,-42z" fill="${fill}" stroke="#fff" stroke-width="5"/>`;
      return `${shape}${text(region.x - 48, region.y + 9, region.name, 17, '#172126', 700)}`;
    }).join('');
    return svgWrap(`${text(80, 75, fixture.title, 31, '#202A2E', 700)}${text(80, 112, 'Fictional service areas — not real geography', 18, '#59636A')}${regions}<rect x="865" y="190" width="260" height="270" rx="8" fill="#F7F8F8" stroke="#C9D0D2"/>${text(895, 235, 'Risk legend', 23, '#202A2E', 700)}<rect x="900" y="265" width="28" height="28" fill="#4D9B78" stroke="#344"/>${text(948, 287, 'Low', 19)}<rect x="900" y="315" width="28" height="28" fill="#E9B64D" stroke="#344"/>${text(948, 337, 'Moderate', 19)}<rect x="900" y="365" width="28" height="28" fill="#C9514B" stroke="#344"/>${text(948, 387, 'High', 19)}${text(80, 700, 'Prepared fictional example • each region has a written name', 17, '#59636A')}`);
  }

  return svgWrap(`${text(90, 78, fixture.title, 32, '#202A2E', 700)}${text(100, 160, 'Email address', 20, '#343F45', 600)}<rect x="100" y="178" width="730" height="62" rx="5" fill="#fff" stroke="#3D966C" stroke-width="3"/>${text(125, 218, 'alex@example.test', 21)}<circle cx="900" cy="208" r="19" fill="#3D966C"/>${text(892, 216, '✓', 22, '#fff', 700)}${text(935, 216, 'Complete', 20, '#28754F', 700)}${text(100, 310, 'Phone number', 20, '#343F45', 600)}<rect x="100" y="328" width="730" height="62" rx="5" fill="#fff" stroke="#C84D4D" stroke-width="3"/><circle cx="900" cy="358" r="19" fill="#C84D4D"/>${text(894, 366, '!', 23, '#fff', 700)}${text(935, 366, 'Error', 20, '#A33A3A', 700)}${text(100, 425, 'Enter a valid phone number.', 18, '#A33A3A', 600)}<rect x="100" y="520" width="215" height="58" rx="6" fill="#285F89"/>${text(150, 557, 'Save changes', 19, '#fff', 700)}<circle cx="385" cy="550" r="17" fill="#2F6EA8"/>${text(378, 557, '✓', 19, '#fff', 700)}${text(415, 558, 'Changes saved', 19, '#285F89', 700)}${text(100, 700, 'Each state uses an icon and written label in addition to color.', 17, '#59636A')}`);
}

function accessibleSampleSvg(sampleId, cvdType) {
  const fixture = sampleFixtures[sampleId];
  const palette = getAccessiblePalette(cvdType);
  const profileLabel = palette.label;
  const [email, chat] = palette.series;

  if (sampleId === 'bar-chart') {
    const bars = fixture.chartData.map((item, i) => {
      const x = 210 + i * 190;
      const emailHeight = item.email * 3.1;
      const chatHeight = item.chat * 3.1;
      return `<rect x="${x}" y="${520 - emailHeight}" width="54" height="${emailHeight}" fill="${email.fill}" stroke="#172126" stroke-width="3"/><path d="M${x} ${520 - emailHeight + 10}l54 -16 M${x} ${520 - emailHeight + 28}l54 -16" stroke="${email.pattern}" stroke-width="3"/><text x="${x + 18}" y="${506 - emailHeight}" font-family="Arial,sans-serif" font-size="15" font-weight="700" fill="#fff">E</text><rect x="${x + 62}" y="${520 - chatHeight}" width="54" height="${chatHeight}" fill="${chat.fill}" stroke="#172126" stroke-width="3"/><path d="M${x + 62} ${520 - chatHeight + 8}l54 42 M${x + 62} ${520 - chatHeight + 28}l54 42" stroke="${chat.pattern}" stroke-width="3"/><text x="${x + 77}" y="${506 - chatHeight}" font-family="Arial,sans-serif" font-size="15" font-weight="700" fill="#fff">C</text>${text(x + 47, 566, item.q, 20, '#374249', 600)}`;
    }).join('');
    return svgWrap(`${text(90, 80, `Accessible reconstruction — ${profileLabel}`, 30, '#202A2E', 700)}${text(90, 120, 'E = Email • C = Chat • hatch + outline reinforce series', 18, '#374249')}${[0, 20, 40, 60, 80].map((value) => `<line x1="160" y1="${520 - value * 3.1}" x2="1000" y2="${520 - value * 3.1}" stroke="#D6DCDF"/>${text(115, 527 - value * 3.1, String(value), 16, '#59636A')}`).join('')}<line x1="160" y1="520" x2="1000" y2="520" stroke="#39464C" stroke-width="2"/>${bars}<rect x="300" y="640" width="24" height="24" fill="${email.fill}" stroke="#172126" stroke-width="2"/>${text(338, 660, 'Email (E, diagonal hatch)', 19)}<rect x="650" y="640" width="24" height="24" fill="${chat.fill}" stroke="#172126" stroke-width="2"/>${text(688, 660, 'Chat (C, crosshatch)', 19)}${text(90, 740, `Profile-aware palette; labels, patterns and borders remain in use.`, 16, '#59636A')}`);
  }

  if (sampleId === 'risk-map') {
    const riskPattern = (key) => palette.risk[key];
    const definitions = ['low', 'moderate', 'high'].map((key) => {
      const color = riskPattern(key);
      const pattern = key === 'low'
        ? `<circle cx="3" cy="3" r="2" fill="${color.pattern}"/>`
        : key === 'moderate'
          ? `<path d="M-3 3L3-3M0 12L12 0M9 15L15 9" stroke="${color.pattern}" stroke-width="2"/>`
          : `<path d="M0 0l12 12M12 0L0 12" stroke="${color.pattern}" stroke-width="1.5"/>`;
      return `<pattern id="risk-${key}" width="12" height="12" patternUnits="userSpaceOnUse"><rect width="12" height="12" fill="${color.background}"/>${pattern}</pattern>`;
    }).join('');
    const regions = fixture.regions.map((region, index) => {
      const key = ['low', 'moderate', 'high'].includes(region.risk.toLowerCase()) ? region.risk.toLowerCase() : 'moderate';
      const shape = index % 2
        ? `<path d="M${region.x - 60},${region.y - 45} l70,-8 24,48 -20,44 -66,-4 -16,-40z" fill="url(#risk-${key})" stroke="#172126" stroke-width="4"/>`
        : `<path d="M${region.x - 55},${region.y - 42} l62,-15 35,34 -12,50 -74,9 -22,-42z" fill="url(#risk-${key})" stroke="#172126" stroke-width="4"/>`;
      return `${shape}${text(region.x - 48, region.y + 8, `${region.name} · ${region.risk}`, 14, '#11191D', 700)}`;
    }).join('');
    const legend = [
      { key: 'low', label: 'Low', y: 255 },
      { key: 'moderate', label: 'Moderate', y: 310 },
      { key: 'high', label: 'High', y: 365 },
    ].map((item) => `<rect x="902" y="${item.y}" width="36" height="30" fill="url(#risk-${item.key})" stroke="#172126" stroke-width="2"/>${text(955, item.y + 22, item.label, 18)}`).join('');
    return svgWrap(`<defs>${definitions}</defs>${text(80, 75, `Accessible regional risk — ${profileLabel}`, 30, '#202A2E', 700)}${text(80, 112, 'Fictional data • text, pattern and borders repeat each category', 18, '#59636A')}${regions}<rect x="875" y="190" width="255" height="285" rx="8" fill="#F7F8F8" stroke="#7A858B"/>${text(900, 232, 'Legend (pattern + word)', 20, '#202A2E', 700)}${legend}${text(80, 700, 'Illustrative only — not real boundaries, locations, or risk advice.', 17, '#59636A')}`);
  }

  const status = palette.status;
  return svgWrap(`${text(90, 78, `Accessible form status — ${profileLabel}`, 32, '#202A2E', 700)}${text(100, 160, 'Email address', 20, '#343F45', 600)}<rect x="100" y="178" width="730" height="62" rx="5" fill="#fff" stroke="${status.success}" stroke-width="4" stroke-dasharray="10 5"/>${text(125, 218, 'alex@example.test', 21)}<circle cx="900" cy="208" r="19" fill="${status.success}" stroke="#172126" stroke-width="2"/>${text(892, 216, '✓', 22, '#fff', 700)}${text(935, 216, 'COMPLETE', 18, status.successText, 700)}${text(100, 310, 'Phone number', 20, '#343F45', 600)}<rect x="100" y="328" width="730" height="62" rx="5" fill="#fff" stroke="${status.error}" stroke-width="4" stroke-dasharray="3 5"/><circle cx="900" cy="358" r="19" fill="${status.error}" stroke="#172126" stroke-width="2"/>${text(894, 366, '!', 23, '#fff', 700)}${text(935, 366, 'ERROR', 18, status.errorText, 700)}${text(100, 425, 'Enter a valid phone number.', 18, status.errorText, 700)}<rect x="100" y="520" width="215" height="58" rx="6" fill="${status.primary}" stroke="#172126" stroke-width="2"/>${text(150, 557, 'Save changes', 19, '#fff', 700)}<circle cx="385" cy="550" r="17" fill="${status.primary}" stroke="#172126" stroke-width="2"/>${text(378, 557, '✓', 19, '#fff', 700)}${text(415, 558, 'SAVED — Changes saved', 18, status.primary, 700)}${text(100, 700, 'Every state includes strong outline, symbol, and written status.', 17, '#59636A')}`);
}

export async function renderSample(sampleId, accessible = false, cvdType = 'general-accessible') {
  if (!sampleFixtures[sampleId]) {
    const error = new Error('Unknown sampleId.');
    error.status = 400;
    throw error;
  }
  const svg = accessible ? accessibleSampleSvg(sampleId, cvdType) : originalSampleSvg(sampleId);
  return sharp(Buffer.from(svg)).png({ compressionLevel: 8 }).toBuffer();
}

export async function createBestEffortTransformation(imageBuffer, colors = [], cvdType = 'general-accessible') {
  const image = sharp(imageBuffer, { failOn: 'error', limitInputPixels: 40_000_000 });
  const metadata = await image.metadata();
  const width = Math.min(metadata.width || 1200, 1600);
  const height = 116;
  const palette = getAccessiblePalette(cvdType);
  const visibleColorCount = Math.min(5, colors.length, Math.max(1, Math.floor((width - 32) / 185)));
  const columnWidth = (width - 32) / Math.max(visibleColorCount, 1);
  const labels = colors.slice(0, visibleColorCount).map((item, index) => {
    const x = 16 + index * columnWidth;
    const sourceColor = /^#[0-9a-f]{6}$/i.test(String(item.hex || '')) ? String(item.hex).toUpperCase() : '#737B80';
    const profileCue = palette.series[index % palette.series.length];
    const dash = index % 2 === 0 ? '4 2' : 'none';
    const fontSize = Math.min(15, Math.max(11, Math.floor(columnWidth / 15)));
    const name = `Color ${index + 1}: ${sourceColor}`;
    return `<rect x="${x - 4}" y="50" width="35" height="35" rx="4" fill="none" stroke="${profileCue.fill}" stroke-width="3" stroke-dasharray="${dash}"/><rect x="${x}" y="54" width="27" height="27" rx="3" fill="${sourceColor}" stroke="#101820" stroke-width="2"/><text x="${x + 40}" y="73" font-family="Arial,sans-serif" font-size="${fontSize}" font-weight="700" fill="#172126">${esc(name)}</text>`;
  }).join('');
  const header = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="#fff"/><text x="16" y="31" font-family="Arial,sans-serif" font-size="18" font-weight="700" fill="#172126">BEST-EFFORT ACCESSIBILITY AID — ${esc(palette.label.toUpperCase())} PROFILE</text>${labels}<text x="16" y="105" font-family="Arial,sans-serif" font-size="12" fill="#46534C">Profile-colored outline accents; source color meaning is not inferred.</text></svg>`);
  return sharp(imageBuffer, { failOn: 'error', limitInputPixels: 40_000_000 })
    .resize({ width, withoutEnlargement: true })
    .extend({ top: height, background: '#FFFFFF' })
    .composite([{ input: header, top: 0, left: 0 }])
    .png({ compressionLevel: 8 })
    .toBuffer();
}

export function transformationDataUrl(buffer) {
  return toDataUrl(buffer, 'image/png');
}
