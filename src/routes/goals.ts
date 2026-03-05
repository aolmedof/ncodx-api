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

export const listGoals: RouteHandler = async (ctx) => {
  const goals = await prisma.goal.findMany({
    where: { userId: ctx.userId },
    orderBy: { createdAt: 'desc' },
  });
  return { statusCode: 200, body: goals };
};

export const createGoal: RouteHandler = async (ctx) => {
  const { title, description, status, progress, dueDate } = parseBody(ctx);
  if (!title) throw new ValidationError('title is required');
  const goal = await prisma.goal.create({
    data: {
      title,
      description,
      status: status ?? 'active',
      progress: progress ?? 0,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      userId: ctx.userId!,
    },
  });
  return { statusCode: 201, body: goal };
};

export const updateGoal: RouteHandler = async (ctx, params) => {
  const goal = await prisma.goal.findUnique({ where: { id: params.id } });
  if (!goal) throw new NotFoundError('Goal not found');
  if (goal.userId !== ctx.userId) throw new ForbiddenError();

  const { title, description, status, progress, dueDate } = parseBody(ctx);
  const updated = await prisma.goal.update({
    where: { id: params.id },
    data: {
      title,
      description,
      status,
      progress,
      dueDate: dueDate !== undefined ? (dueDate ? new Date(dueDate) : null) : undefined,
    },
  });
  return { statusCode: 200, body: updated };
};

export const deleteGoal: RouteHandler = async (ctx, params) => {
  const goal = await prisma.goal.findUnique({ where: { id: params.id } });
  if (!goal) throw new NotFoundError('Goal not found');
  if (goal.userId !== ctx.userId) throw new ForbiddenError();
  await prisma.goal.delete({ where: { id: params.id } });
  return { statusCode: 204, body: null };
};
