import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';
import { signToken } from '../lib/jwt';
import { ValidationError } from '../middleware/error';
import { AppContext, RouteHandler } from '../types';

function parseBody(ctx: AppContext) {
  try {
    return JSON.parse(ctx.event.body ?? '{}');
  } catch {
    return {};
  }
}

export const login: RouteHandler = async (ctx) => {
  const { email, password } = parseBody(ctx);
  if (!email || !password) throw new ValidationError('email and password are required');

  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    // Auto-create user on first login
    const hashed = await bcrypt.hash(password, 10);
    user = await prisma.user.create({ data: { email, password: hashed } });
  } else {
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new ValidationError('Invalid credentials');
  }

  const token = await signToken({ sub: user.id, email: user.email });
  const { password: _pw, ...safeUser } = user;
  return { statusCode: 200, body: { token, user: safeUser } };
};

export const register: RouteHandler = async (ctx) => {
  const { email, password, name } = parseBody(ctx);
  if (!email || !password) throw new ValidationError('email and password are required');

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new ValidationError('Email already in use');

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, password: hashed, name } });

  const token = await signToken({ sub: user.id, email: user.email });
  const { password: _pw, ...safeUser } = user;
  return { statusCode: 201, body: { token, user: safeUser } };
};

export const me: RouteHandler = async (ctx) => {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: ctx.userId } });
  const { password: _pw, ...safeUser } = user;
  return { statusCode: 200, body: safeUser };
};
