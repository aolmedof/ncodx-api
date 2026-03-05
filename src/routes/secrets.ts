import prisma from '../lib/prisma';
import { encrypt, decrypt } from '../lib/crypto';
import { NotFoundError, ForbiddenError, ValidationError } from '../middleware/error';
import { AppContext, RouteHandler } from '../types';

function parseBody(ctx: AppContext) {
  try {
    return JSON.parse(ctx.event.body ?? '{}');
  } catch {
    return {};
  }
}

export const listSecrets: RouteHandler = async (ctx) => {
  const secrets = await prisma.secret.findMany({
    where: { userId: ctx.userId },
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, category: true, createdAt: true, updatedAt: true },
  });
  return { statusCode: 200, body: secrets };
};

export const createSecret: RouteHandler = async (ctx) => {
  const { name, value, category } = parseBody(ctx);
  if (!name || !value) throw new ValidationError('name and value are required');

  const { encryptedValue, iv, authTag } = await encrypt(value);
  const secret = await prisma.secret.create({
    data: { name, encryptedValue, iv, authTag, category, userId: ctx.userId! },
    select: { id: true, name: true, category: true, createdAt: true, updatedAt: true },
  });
  return { statusCode: 201, body: secret };
};

export const getSecret: RouteHandler = async (ctx, params) => {
  const secret = await prisma.secret.findUnique({ where: { id: params.id } });
  if (!secret) throw new NotFoundError('Secret not found');
  if (secret.userId !== ctx.userId) throw new ForbiddenError();

  const value = await decrypt(secret.encryptedValue, secret.iv, secret.authTag);
  return {
    statusCode: 200,
    body: { id: secret.id, name: secret.name, value, category: secret.category },
  };
};

export const updateSecret: RouteHandler = async (ctx, params) => {
  const existing = await prisma.secret.findUnique({ where: { id: params.id } });
  if (!existing) throw new NotFoundError('Secret not found');
  if (existing.userId !== ctx.userId) throw new ForbiddenError();

  const { name, value, category } = parseBody(ctx);
  const updateData: Record<string, unknown> = { name, category };

  if (value) {
    const { encryptedValue, iv, authTag } = await encrypt(value);
    updateData.encryptedValue = encryptedValue;
    updateData.iv = iv;
    updateData.authTag = authTag;
  }

  const updated = await prisma.secret.update({
    where: { id: params.id },
    data: updateData,
    select: { id: true, name: true, category: true, createdAt: true, updatedAt: true },
  });
  return { statusCode: 200, body: updated };
};

export const deleteSecret: RouteHandler = async (ctx, params) => {
  const secret = await prisma.secret.findUnique({ where: { id: params.id } });
  if (!secret) throw new NotFoundError('Secret not found');
  if (secret.userId !== ctx.userId) throw new ForbiddenError();
  await prisma.secret.delete({ where: { id: params.id } });
  return { statusCode: 204, body: null };
};
