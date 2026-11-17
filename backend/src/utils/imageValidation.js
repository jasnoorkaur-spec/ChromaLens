import path from 'node:path';
import sharp from 'sharp';

const MIME_FORMATS = new Map([
  ['image/png', 'png'],
  ['image/jpeg', 'jpeg'],
  ['image/webp', 'webp'],
]);
const EXT_FORMATS = new Map([
  ['.png', 'png'],
  ['.jpg', 'jpeg'],
  ['.jpeg', 'jpeg'],
  ['.webp', 'webp'],
]);
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

export async function validateAndNormalizeImage(buffer, declaredMime, originalName) {
  if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
    const error = new Error('Upload an image in the image field.');
    error.status = 400;
    throw error;
  }
  if (buffer.length > MAX_IMAGE_BYTES) {
    const error = new Error('Image exceeds the 10 MiB upload limit.');
    error.status = 413;
    throw error;
  }
  const declaredFormat = MIME_FORMATS.get(String(declaredMime || '').toLowerCase());
  const extensionFormat = EXT_FORMATS.get(path.extname(String(originalName || '')).toLowerCase());
  if (!declaredFormat || !extensionFormat || declaredFormat !== extensionFormat) {
    const error = new Error('Only matching PNG, JPEG/JPG, and WebP image uploads are accepted.');
    error.status = 415;
    throw error;
  }

  let metadata;
  let normalized;
  try {
    const decoded = sharp(buffer, { failOn: 'error', limitInputPixels: 40_000_000 });
    metadata = await decoded.metadata();
    if (!['png', 'jpeg', 'webp'].includes(metadata.format) || metadata.format !== declaredFormat) {
      throw new Error('Image content does not match its declared type.');
    }
    if (!metadata.width || !metadata.height || metadata.width * metadata.height > 40_000_000) {
      throw new Error('Image dimensions are not supported.');
    }
    normalized = await sharp(buffer, { failOn: 'error', limitInputPixels: 40_000_000 })
      .rotate()
      .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
      .png({ compressionLevel: 8 })
      .toBuffer();
  } catch {
    const error = new Error('The uploaded file could not be decoded as a supported image.');
    error.status = 415;
    throw error;
  }
  return { buffer: normalized, width: metadata.width, height: metadata.height, format: metadata.format };
}
