import prisma from '../lib/prisma';
import { NotFoundError, ForbiddenError, ValidationError } from '../middleware/error';
import { AppContext, RouteHandler } from '../types';

function parseBody(ctx: AppContext) {
  try {
    return JSON.parse(ctx.event.body ?? '{}');
  } catch {
    return {};
  }
}

export const listShoppingItems: RouteHandler = async (ctx) => {
  const items = await prisma.shoppingItem.findMany({
    where: { userId: ctx.userId },
    orderBy: [{ checked: 'asc' }, { createdAt: 'desc' }],
  });
  return { statusCode: 200, body: items };
};

export const createShoppingItem: RouteHandler = async (ctx) => {
  const { name, quantity, unit, checked, category } = parseBody(ctx);
  if (!name) throw new ValidationError('name is required');
  const item = await prisma.shoppingItem.create({
    data: {
      name,
      quantity: quantity ?? 1,
      unit,
      checked: checked ?? false,
      category,
      userId: ctx.userId!,
    },
  });
  return { statusCode: 201, body: item };
};

export const updateShoppingItem: RouteHandler = async (ctx, params) => {
  const item = await prisma.shoppingItem.findUnique({ where: { id: params.id } });
  if (!item) throw new NotFoundError('Shopping item not found');
  if (item.userId !== ctx.userId) throw new ForbiddenError();

  const { name, quantity, unit, checked, category } = parseBody(ctx);
  const updated = await prisma.shoppingItem.update({
    where: { id: params.id },
    data: { name, quantity, unit, checked, category },
  });
  return { statusCode: 200, body: updated };
};

export const deleteShoppingItem: RouteHandler = async (ctx, params) => {
  const item = await prisma.shoppingItem.findUnique({ where: { id: params.id } });
  if (!item) throw new NotFoundError('Shopping item not found');
  if (item.userId !== ctx.userId) throw new ForbiddenError();
  await prisma.shoppingItem.delete({ where: { id: params.id } });
  return { statusCode: 204, body: null };
};
