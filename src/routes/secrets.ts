import { store, newId } from '../lib/mock-store';
import { NotFoundError, ForbiddenError, ValidationError } from '../middleware/error';
import { AppContext, RouteHandler } from '../types';

function parseBody(ctx: AppContext) {
  try { return JSON.parse(ctx.event.body ?? '{}'); } catch { return {}; }
}

const safeSecret = (s: ReturnType<typeof store.secrets.byId>) =>
  s ? { id: s.id, name: s.name, category: s.category, createdAt: s.createdAt, updatedAt: s.updatedAt } : null;

export const listSecrets: RouteHandler = async (ctx) => {
  const secrets = store.secrets
    .find(s => s.userId === ctx.userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map(s => safeSecret(s));
  return { statusCode: 200, body: secrets };
};

export const createSecret: RouteHandler = async (ctx) => {
  const { name, value, category } = parseBody(ctx);
  if (!name || !value) throw new ValidationError('name and value are required');
  const now = new Date().toISOString();
  const secret = store.secrets.insert({
    id: newId(), name, value,
    category: category ?? null,
    userId: ctx.userId!,
    createdAt: now, updatedAt: now,
  });
  return { statusCode: 201, body: safeSecret(secret) };
};

export const getSecret: RouteHandler = async (ctx, params) => {
  const secret = store.secrets.byId(params.id);
  if (!secret) throw new NotFoundError('Secret not found');
  if (secret.userId !== ctx.userId) throw new ForbiddenError();
  return { statusCode: 200, body: { id: secret.id, name: secret.name, value: secret.value, category: secret.category } };
};

export const updateSecret: RouteHandler = async (ctx, params) => {
  const existing = store.secrets.byId(params.id);
  if (!existing) throw new NotFoundError('Secret not found');
  if (existing.userId !== ctx.userId) throw new ForbiddenError();
  const { name, value, category } = parseBody(ctx);
  const patch: Partial<typeof existing> = {};
  if (name !== undefined) patch.name = name;
  if (category !== undefined) patch.category = category;
  if (value !== undefined) patch.value = value;
  const updated = store.secrets.update(params.id, patch);
  return { statusCode: 200, body: safeSecret(updated) };
};

export const deleteSecret: RouteHandler = async (ctx, params) => {
  const secret = store.secrets.byId(params.id);
  if (!secret) throw new NotFoundError('Secret not found');
  if (secret.userId !== ctx.userId) throw new ForbiddenError();
  store.secrets.remove(params.id);
  return { statusCode: 204, body: null };
};
