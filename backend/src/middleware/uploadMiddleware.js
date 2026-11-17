import multer from 'multer';
import path from 'node:path';
import { MAX_IMAGE_BYTES } from '../utils/imageValidation.js';

const allowed = new Map([
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.webp', 'image/webp'],
]);

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_IMAGE_BYTES, files: 1, fields: 12, parts: 14 },
  fileFilter: (_req, file, callback) => {
    const extension = path.extname(file.originalname || '').toLowerCase();
    if (allowed.get(extension) !== String(file.mimetype || '').toLowerCase()) {
      const error = new Error('Only PNG, JPEG/JPG, and WebP image files are accepted.');
      error.status = 415;
      return callback(error);
    }
    return callback(null, true);
  },
}).single('image');
