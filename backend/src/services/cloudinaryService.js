import { v2 as cloudinary } from 'cloudinary';

export function cloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME?.trim()
    && process.env.CLOUDINARY_API_KEY?.trim()
    && process.env.CLOUDINARY_API_SECRET?.trim(),
  );
}

export async function persistConsentedImages(originalBuffer, transformedBuffer) {
  if (!cloudinaryConfigured()) return { originalImageUrl: null, transformedImageUrl: null };
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  const upload = (buffer, suffix) => new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({
      folder: 'chromalens/consented-scans',
      resource_type: 'image',
      format: 'png',
      public_id: `${Date.now()}-${suffix}`,
      overwrite: false,
    }, (error, result) => error ? reject(error) : resolve(result.secure_url));
    stream.end(buffer);
  });
  const [originalImageUrl, transformedImageUrl] = await Promise.all([
    upload(originalBuffer, 'original'),
    upload(transformedBuffer, 'accessible'),
  ]);
  return { originalImageUrl, transformedImageUrl };
}
