import { store, newId } from '../lib/mock-store';
import { NotFoundError, ForbiddenError, ValidationError } from '../middleware/error';
import { AppContext, RouteHandler } from '../types';

function parseBody(ctx: AppContext) {
  try { return JSON.parse(ctx.event.body ?? '{}'); } catch { return {}; }
}

export const listShoppingItems: RouteHandler = async (ctx) => {
  const items = store.shoppingItems
    .find(i => i.userId === ctx.userId)
    .sort((a, b) => Number(a.checked) - Number(b.checked) || b.createdAt.localeCompare(a.createdAt));
  return { statusCode: 200, body: items };
};

export const createShoppingItem: RouteHandler = async (ctx) => {
  const { name, quantity, unit, checked, category } = parseBody(ctx);
  if (!name) throw new ValidationError('name is required');
  const now = new Date().toISOString();
  const item = store.shoppingItems.insert({
    id: newId(), name,
    quantity: quantity ?? 1,
    unit: unit ?? null,
    checked: checked ?? false,
    category: category ?? null,
    userId: ctx.userId!,
    createdAt: now, updatedAt: now,
  });
  return { statusCode: 201, body: item };
};

export const updateShoppingItem: RouteHandler = async (ctx, params) => {
  const item = store.shoppingItems.byId(params.id);
  if (!item) throw new NotFoundError('Shopping item not found');
  if (item.userId !== ctx.userId) throw new ForbiddenError();
  const { name, quantity, unit, checked, category } = parseBody(ctx);
  const updated = store.shoppingItems.update(params.id, { name, quantity, unit, checked, category });
  return { statusCode: 200, body: updated };
};

export const deleteShoppingItem: RouteHandler = async (ctx, params) => {
  const item = store.shoppingItems.byId(params.id);
  if (!item) throw new NotFoundError('Shopping item not found');
  if (item.userId !== ctx.userId) throw new ForbiddenError();
  store.shoppingItems.remove(params.id);
  return { statusCode: 204, body: null };
};
