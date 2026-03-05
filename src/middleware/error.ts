import { AuthError } from './auth';

export interface ErrorResponse {
  error: string;
  statusCode: number;
}

export function handleError(err: unknown): { statusCode: number; body: ErrorResponse } {
  if (err instanceof AuthError) {
    return { statusCode: 401, body: { error: err.message, statusCode: 401 } };
  }
  if (err instanceof ValidationError) {
    return { statusCode: 400, body: { error: err.message, statusCode: 400 } };
  }
  if (err instanceof NotFoundError) {
    return { statusCode: 404, body: { error: err.message, statusCode: 404 } };
  }
  if (err instanceof ForbiddenError) {
    return { statusCode: 403, body: { error: err.message, statusCode: 403 } };
  }
  console.error('[unhandled error]', err);
  const message = err instanceof Error ? err.message : 'Internal server error';
  return { statusCode: 500, body: { error: message, statusCode: 500 } };
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error {
  constructor(message = 'Not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class ForbiddenError extends Error {
  constructor(message = 'Forbidden') {
    super(message);
    this.name = 'ForbiddenError';
  }
}
