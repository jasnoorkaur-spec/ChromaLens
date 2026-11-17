import multer from 'multer';

export function notFound(_request, response) {
  return response.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'API route not found.' } });
}

export function errorHandler(error, _request, response, _next) {
  if (response.headersSent) return;
  console.error('Unhandled API Error:', error);
  if (error instanceof multer.MulterError) {
    const status = error.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
    const message = error.code === 'LIMIT_FILE_SIZE'
      ? 'Image exceeds the 10 MiB upload limit.'
      : 'The multipart upload is invalid or exceeds allowed limits.';
    return response.status(status).json({ success: false, error: { code: error.code, message } });
  }
  const status = Number.isInteger(error.status) && error.status >= 400 && error.status <= 499 ? error.status : 500;
  const message = error.message || (status < 500 ? 'Request error' : 'An unexpected server error occurred.');
  return response.status(status).json({
    success: false,
    error: { code: status === 500 ? 'INTERNAL_ERROR' : 'REQUEST_ERROR', message },
  });
}

export function asyncHandler(handler) {
  return (request, response, next) => Promise.resolve(handler(request, response, next)).catch(next);
}
