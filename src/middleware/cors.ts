const ALLOWED_ORIGINS = [
  'https://www.ncodx.com',
  'https://ncodx.com',
  'http://localhost:5173',
  ...(process.env.CORS_ORIGIN ? [process.env.CORS_ORIGIN] : []),
];

export function getCorsHeaders(origin?: string): Record<string, string> {
  const allowed =
    origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Max-Age': '86400',
  };
}
