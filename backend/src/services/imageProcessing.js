import { readFile } from 'node:fs/promises';
import sharp from 'sharp';
import { sampleFixtures } from './sampleFixtures.js';
import { toDataUrl } from '../utils/validation.js';

const AQI_ORIGINAL_URL = new URL('../assets/samples/aqi-original.png', import.meta.url);
const AQI_ACCESSIBLE_URL = new URL('../assets/samples/aqi-accessible.png', import.meta.url);

const esc = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');
const svgWrap = (body) => `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800"><rect width="1200" height="800" fill="#fff"/>${body}</svg>`;
const text = (x, y, value, size = 24, color = '#202A2E', weight = 500, extra = '') =>
  `<text x="${x}" y="${y}" font-family="Arial, sans-serif" font-size="${size}" fill="${color}" font-weight="${weight}"${extra}>${esc(value)}</text>`;

const PROFILE_PALETTES = {
  protanopia: {
    label: 'Protanopia',
    series: [
      { fill: '#005B86', pattern: '#FFFFFF' },
      { fill: '#B64E00', pattern: '#FFFFFF' },
    ],
  },
  deuteranopia: {
    label: 'Deuteranopia',
    series: [
      { fill: '#48559C', pattern: '#FFFFFF' },
      { fill: '#0D746B', pattern: '#FFFFFF' },
    ],
  },
  tritanopia: {
    label: 'Tritanopia',
    series: [
      { fill: '#913B63', pattern: '#FFFFFF' },
      { fill: '#426B2D', pattern: '#FFFFFF' },
    ],
  },
  'general-accessible': {
    label: 'General Accessible Mode',
    series: [
      { fill: '#176A93', pattern: '#FFFFFF' },
      { fill: '#A84800', pattern: '#FFFFFF' },
    ],
  },
};

function getAccessiblePalette(cvdType) {
  return PROFILE_PALETTES[cvdType] || PROFILE_PALETTES['general-accessible'];
}

export function getProfileLabel(cvdType) {
  return getAccessiblePalette(cvdType).label;
}

function getChartPatternDefs(fgColor = '#0B1F52', bgColor = '#FFFFFF') {
  return `
    <pattern id="pattern-stripes" width="10" height="6" patternUnits="userSpaceOnUse">
      <rect width="10" height="6" fill="${bgColor}"/>
      <line x1="0" y1="2" x2="10" y2="2" stroke="${fgColor}" stroke-width="2"/>
    </pattern>
    <pattern id="pattern-dots" width="8" height="8" patternUnits="userSpaceOnUse">
      <rect width="8" height="8" fill="${bgColor}"/>
      <circle cx="2" cy="2" r="1.6" fill="${fgColor}"/>
      <circle cx="6" cy="6" r="1.6" fill="${fgColor}"/>
    </pattern>
    <pattern id="pattern-blocks" width="48" height="20" patternUnits="userSpaceOnUse">
      <rect width="48" height="20" fill="${bgColor}"/>
      <rect x="0" y="2" width="48" height="10" fill="${fgColor}"/>
    </pattern>
    <pattern id="pattern-crosses" width="14" height="14" patternUnits="userSpaceOnUse">
      <rect width="14" height="14" fill="${bgColor}"/>
      <path d="M1 1l12 12M13 1L1 13" stroke="${fgColor}" stroke-width="2.2" stroke-linecap="square"/>
    </pattern>
  `;
}

function originalSampleSvg(sampleId) {
  const fixture = sampleFixtures[sampleId];

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

function accessibleSampleSvg(sampleId) {
  const fixture = sampleFixtures[sampleId];
  const ink = '#0B1F52';

  if (sampleId === 'risk-map') {
    const definitions = `
      <pattern id="risk-low" width="12" height="12" patternUnits="userSpaceOnUse">
        <rect width="12" height="12" fill="#FFFFFF"/>
        <circle cx="3" cy="3" r="1.9" fill="${ink}"/>
        <circle cx="9" cy="9" r="1.9" fill="${ink}"/>
      </pattern>
      <pattern id="risk-moderate" width="12" height="8" patternUnits="userSpaceOnUse">
        <rect width="12" height="8" fill="#FFFFFF"/>
        <line x1="0" y1="3" x2="12" y2="3" stroke="${ink}" stroke-width="2.6"/>
      </pattern>
      <pattern id="risk-high" width="12" height="12" patternUnits="userSpaceOnUse">
        <rect width="12" height="12" fill="#FFFFFF"/>
        <path d="M0 0l12 12M12 0L0 12" stroke="${ink}" stroke-width="2.1"/>
      </pattern>
    `;
    const regions = fixture.regions.map((region, index) => {
      const key = ['low', 'moderate', 'high'].includes(region.risk.toLowerCase()) ? region.risk.toLowerCase() : 'moderate';
      const shape = index % 2
        ? `<path d="M${region.x - 60},${region.y - 45} l70,-8 24,48 -20,44 -66,-4 -16,-40z" fill="url(#risk-${key})" stroke="${ink}" stroke-width="3"/>`
        : `<path d="M${region.x - 55},${region.y - 42} l62,-15 35,34 -12,50 -74,9 -22,-42z" fill="url(#risk-${key})" stroke="${ink}" stroke-width="3"/>`;
      return `${shape}${text(region.x - 48, region.y + 9, region.name, 17, ink, 700, ' paint-order="stroke" stroke="#FFFFFF" stroke-width="7" stroke-linejoin="round"')}`;
    }).join('');
    return svgWrap(
      `<defs>${definitions}</defs>` +
      text(80, 75, fixture.title, 31, ink, 700) +
      text(80, 112, 'Fictional service areas — not real geography', 18, ink, 500) +
      regions +
      `<rect x="865" y="190" width="260" height="270" rx="8" fill="#FFFFFF" stroke="${ink}" stroke-width="2"/>` +
      text(895, 235, 'Risk legend', 23, ink, 700) +
      `<rect x="900" y="265" width="28" height="28" fill="url(#risk-low)" stroke="${ink}" stroke-width="2"/>` +
      text(948, 287, 'Low', 19, ink, 600) +
      `<rect x="900" y="315" width="28" height="28" fill="url(#risk-moderate)" stroke="${ink}" stroke-width="2"/>` +
      text(948, 337, 'Moderate', 19, ink, 600) +
      `<rect x="900" y="365" width="28" height="28" fill="url(#risk-high)" stroke="${ink}" stroke-width="2"/>` +
      text(948, 387, 'High', 19, ink, 600) +
      text(80, 700, 'Prepared fictional example • each region has a written name', 17, ink, 500)
    );
  }

  const statusDefs = `
    <pattern id="status-complete" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="10" height="10" fill="#FFFFFF"/>
      <line x1="0" y1="0" x2="0" y2="10" stroke="${ink}" stroke-width="2.4"/>
    </pattern>
    <pattern id="status-error" width="12" height="12" patternUnits="userSpaceOnUse">
      <rect width="12" height="12" fill="#FFFFFF"/>
      <path d="M0 0l12 12M12 0L0 12" stroke="${ink}" stroke-width="2"/>
    </pattern>
    <pattern id="status-saved" width="12" height="7" patternUnits="userSpaceOnUse">
      <rect width="12" height="7" fill="#FFFFFF"/>
      <line x1="0" y1="2.5" x2="12" y2="2.5" stroke="${ink}" stroke-width="2.6"/>
    </pattern>
  `;
  const halo = ' paint-order="stroke" stroke="#FFFFFF" stroke-width="6" stroke-linejoin="round"';
  return svgWrap(
    `<defs>${statusDefs}</defs>` +
    text(90, 78, fixture.title, 32, ink, 700) +
    text(100, 160, 'Email address', 20, ink, 600) +
    `<rect x="100" y="178" width="730" height="62" rx="5" fill="#fff" stroke="${ink}" stroke-width="3"/>` +
    `<rect x="101" y="179" width="14" height="60" rx="3" fill="url(#status-complete)" stroke="${ink}" stroke-width="1.5"/>` +
    text(125, 218, 'alex@example.test', 21, ink, 500) +
    `<circle cx="900" cy="208" r="19" fill="url(#status-complete)" stroke="${ink}" stroke-width="2.5"/>` +
    text(892, 216, '✓', 22, ink, 700, halo) +
    text(935, 216, 'Complete', 20, ink, 700) +
    text(100, 310, 'Phone number', 20, ink, 600) +
    `<rect x="100" y="328" width="730" height="62" rx="5" fill="#fff" stroke="${ink}" stroke-width="3" stroke-dasharray="10 5"/>` +
    `<rect x="101" y="329" width="14" height="60" rx="3" fill="url(#status-error)" stroke="${ink}" stroke-width="1.5"/>` +
    `<circle cx="900" cy="358" r="19" fill="url(#status-error)" stroke="${ink}" stroke-width="2.5"/>` +
    text(894, 366, '!', 23, ink, 700, halo) +
    text(935, 366, 'Error', 20, ink, 700) +
    text(100, 425, 'Enter a valid phone number.', 18, ink, 600) +
    `<rect x="100" y="520" width="215" height="58" rx="6" fill="url(#status-saved)" stroke="${ink}" stroke-width="2.5"/>` +
    text(150, 557, 'Save changes', 19, ink, 700, halo) +
    `<circle cx="385" cy="550" r="17" fill="url(#status-saved)" stroke="${ink}" stroke-width="2.5"/>` +
    text(378, 557, '✓', 19, ink, 700, halo) +
    text(415, 558, 'Changes saved', 19, ink, 700) +
    text(100, 700, 'Each state uses an icon and written label in addition to color.', 17, ink, 500)
  );
}

export async function renderSample(sampleId, accessible = false) {
  if (!sampleFixtures[sampleId]) {
    const error = new Error('Unknown sampleId.');
    error.status = 400;
    throw error;
  }
  if (sampleId === 'bar-chart') {
    return readFile(accessible ? AQI_ACCESSIBLE_URL : AQI_ORIGINAL_URL);
  }
  const svg = accessible ? accessibleSampleSvg(sampleId) : originalSampleSvg(sampleId);
  return sharp(Buffer.from(svg)).png({ compressionLevel: 8 }).toBuffer();
}

export async function createBestEffortTransformation(imageBuffer, colors = [], cvdType = 'general-accessible') {
  const image = sharp(imageBuffer, { failOn: 'error', limitInputPixels: 40_000_000 });
  const metadata = await image.metadata();
  const width = Math.min(metadata.width || 1200, 1600);
  const height = 136;
  const palette = getAccessiblePalette(cvdType);
  const patternDefs = getChartPatternDefs('#172126', '#f4f6f0');
  const PATTERN_KEYS = [
    { id: 'pattern-stripes', symbol: '▲', name: 'Horizontal stripes' },
    { id: 'pattern-dots', symbol: 'ℹ', name: 'Stippled dots' },
    { id: 'pattern-blocks', symbol: '✓', name: 'Segmented blocks' },
    { id: 'pattern-crosses', symbol: '✕', name: 'Crosshatch (XXXX)' },
    { id: 'pattern-stripes', symbol: '◆', name: 'Dense lines' },
  ];
  const visibleColorCount = Math.min(4, colors.length, Math.max(1, Math.floor((width - 32) / 250)));
  const columnWidth = (width - 32) / Math.max(visibleColorCount, 1);
  const labels = colors.slice(0, visibleColorCount).map((item, index) => {
    const x = 16 + index * columnWidth;
    const sourceColor = /^#[0-9a-f]{6}$/i.test(String(item.hex || '')) ? String(item.hex).toUpperCase() : '#737B80';
    const pat = PATTERN_KEYS[index % PATTERN_KEYS.length];
    const fontSize = Math.min(13, Math.max(11, Math.floor(columnWidth / 18)));
    return `
      <rect x="${x}" y="52" width="28" height="28" rx="4" fill="${sourceColor}" stroke="#101820" stroke-width="2"/>
      <text x="${x + 36}" y="71" font-family="Arial,sans-serif" font-size="15" font-weight="700" fill="#202A2E">→</text>
      <rect x="${x + 56}" y="50" width="52" height="32" rx="4" fill="url(#${pat.id})" stroke="#172126" stroke-width="2"/>
      <text x="${x + 116}" y="64" font-family="Arial,sans-serif" font-size="${fontSize}" font-weight="700" fill="#172126">${pat.symbol} ${esc(pat.name)}</text>
      <text x="${x + 116}" y="80" font-family="Arial,sans-serif" font-size="11" fill="#586760">${esc(sourceColor)}</text>
    `;
  }).join('');
  const header = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="#fff"/><defs>${patternDefs}</defs><text x="16" y="28" font-family="Arial,sans-serif" font-size="16" font-weight="700" fill="#172126">ACCESSIBLE PATTERN CONVERSION — ${esc(palette.label.toUpperCase())} PROFILE</text>${labels}<text x="16" y="118" font-family="Arial,sans-serif" font-size="12" fill="#46534C">Colors are reinforced by distinct textural patterns (stripes, dots, blocks, crosshatch) and symbols.</text></svg>`);
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
