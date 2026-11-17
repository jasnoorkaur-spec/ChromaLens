const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

export function requireMutationMarker(request, response, next) {
  if (!MUTATING_METHODS.has(request.method)) return next();
  if (request.get('X-ChromaLens-Request') === '1') return next();

  return response.status(403).json({
    success: false,
    error: {
      code: 'CSRF_HEADER_REQUIRED',
      message: 'This request could not be verified. Refresh the page and try again.',
    },
  });
}
