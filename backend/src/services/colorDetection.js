import sharp from 'sharp';

function hexByte(value) {
  return Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, '0');
}

export async function detectDominantColors(imageBuffer, limit = 5) {
  const { data, info } = await sharp(imageBuffer, { failOn: 'error', limitInputPixels: 40_000_000 })
    .rotate()
    .resize({ width: 112, height: 112, fit: 'inside', withoutEnlargement: true })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const bins = new Map();
  const channels = info.channels;
  for (let offset = 0; offset < data.length; offset += channels) {
    const r = data[offset];
    const g = data[offset + 1];
    const b = data[offset + 2];
    const qr = r >> 4;
    const qg = g >> 4;
    const qb = b >> 4;
    const key = `${qr},${qg},${qb}`;
    const current = bins.get(key) || { count: 0, r: 0, g: 0, b: 0 };
    current.count += 1;
    current.r += r;
    current.g += g;
    current.b += b;
    bins.set(key, current);
  }
  const pixelCount = Math.max(1, data.length / channels);
  return [...bins.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
    .map((bin) => {
      const r = bin.r / bin.count;
      const g = bin.g / bin.count;
      const b = bin.b / bin.count;
      return {
        hex: `#${hexByte(r)}${hexByte(g)}${hexByte(b)}`.toUpperCase(),
        percentage: Math.round((bin.count / pixelCount) * 1000) / 10,
      };
    });
}

export function colorsToLocalElements(colors) {
  return colors.map((color, index) => ({
    name: `Detected color region ${index + 1}`,
    color: color.hex,
    label: 'Unlabeled color region',
    meaning: 'Unknown from pixel color alone.',
    confidence: 0,
    uncertainty: 'No contextual label or legend was verified for this color.',
  }));
}
