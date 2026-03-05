import jwt from 'jsonwebtoken';
import { getParam } from './ssm';
import { JwtPayload } from '../types';

async function getSecret(): Promise<string> {
  return getParam('/ncodx/prod/jwt_secret', 'JWT_SECRET');
}

export async function signToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): Promise<string> {
  const secret = await getSecret();
  return jwt.sign(payload, secret, { expiresIn: '7d', algorithm: 'HS256' });
}

export async function verifyToken(token: string): Promise<JwtPayload> {
  const secret = await getSecret();
  return jwt.verify(token, secret, { algorithms: ['HS256'] }) as JwtPayload;
}
