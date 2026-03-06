import bcrypt from 'bcryptjs';
import { store, newId } from '../lib/mock-store';
import { signToken } from '../lib/jwt';
import { ValidationError } from '../middleware/error';
import { AppContext, RouteHandler } from '../types';

function parseBody(ctx: AppContext) {
  try { return JSON.parse(ctx.event.body ?? '{}'); } catch { return {}; }
}

export const login: RouteHandler = async (ctx) => {
  const { email, password } = parseBody(ctx);
  if (!email || !password) throw new ValidationError('email and password are required');

  let user = store.users.findOne(u => u.email === email);

  if (!user) {
    // Auto-create in memory (lost on cold start — OK for demo)
    const hashed = await bcrypt.hash(password, 10);
    const now = new Date().toISOString();
    user = store.users.insert({
      id: newId(), email, password: hashed,
      name: null, locale: 'es', timezone: 'America/Mexico_City',
      createdAt: now, updatedAt: now,
    });
  } else {
    // Demo user: accept hardcoded password without bcrypt
    const valid = user.password === '__demo__'
      ? password === 'password123'
      : await bcrypt.compare(password, user.password);
    if (!valid) throw new ValidationError('Invalid credentials');
  }

  const token = await signToken({ sub: user.id, email: user.email });
  const { password: _pw, ...safeUser } = user;
  return { statusCode: 200, body: { token, user: safeUser } };
};

export const register: RouteHandler = async (ctx) => {
  const { email, password, name } = parseBody(ctx);
  if (!email || !password) throw new ValidationError('email and password are required');

  if (store.users.findOne(u => u.email === email)) {
    throw new ValidationError('Email already in use');
  }

  const hashed = await bcrypt.hash(password, 10);
  const now = new Date().toISOString();
  const user = store.users.insert({
    id: newId(), email, password: hashed,
    name: name ?? null, locale: 'es', timezone: 'UTC',
    createdAt: now, updatedAt: now,
  });

  const token = await signToken({ sub: user.id, email: user.email });
  const { password: _pw, ...safeUser } = user;
  return { statusCode: 201, body: { token, user: safeUser } };
};

export const me: RouteHandler = async (ctx) => {
  const user = store.users.byId(ctx.userId!);
  if (!user) throw new ValidationError('User not found');
  const { password: _pw, ...safeUser } = user;
  return { statusCode: 200, body: safeUser };
};
