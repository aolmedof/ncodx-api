import { verifyToken } from '../lib/jwt';
import { AppContext } from '../types';

export class AuthError extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'AuthError';
  }
}

export async function authenticate(ctx: AppContext): Promise<string> {
  const authHeader = ctx.event.headers?.['authorization'] ?? ctx.event.headers?.['Authorization'];
  if (!authHeader?.startsWith('Bearer ')) {
    throw new AuthError('Missing or invalid Authorization header');
  }
  const token = authHeader.slice(7);
  const payload = await verifyToken(token);
  return payload.sub;
}
