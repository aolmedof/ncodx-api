import { store, newId } from '../lib/mock-store';
import { NotFoundError, ForbiddenError, ValidationError } from '../middleware/error';
import { AppContext, RouteHandler } from '../types';

function parseBody(ctx: AppContext) {
  try { return JSON.parse(ctx.event.body ?? '{}'); } catch { return {}; }
}

export const listGoals: RouteHandler = async (ctx) => {
  const goals = store.goals
    .find(g => g.userId === ctx.userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return { statusCode: 200, body: goals };
};

export const createGoal: RouteHandler = async (ctx) => {
  const { title, description, progress, targetDate } = parseBody(ctx);
  if (!title) throw new ValidationError('title is required');
  const now = new Date().toISOString();
  const goal = store.goals.insert({
    id: newId(), title,
    description: description ?? null,
    progress: progress ?? 0,
    targetDate: targetDate ?? null,
    userId: ctx.userId!,
    createdAt: now, updatedAt: now,
  });
  return { statusCode: 201, body: goal };
};

export const updateGoal: RouteHandler = async (ctx, params) => {
  const goal = store.goals.byId(params.id);
  if (!goal) throw new NotFoundError('Goal not found');
  if (goal.userId !== ctx.userId) throw new ForbiddenError();
  const { title, description, progress, targetDate } = parseBody(ctx);
  const updated = store.goals.update(params.id, {
    title, description, progress,
    targetDate: targetDate !== undefined ? (targetDate ?? null) : goal.targetDate,
  });
  return { statusCode: 200, body: updated };
};

export const deleteGoal: RouteHandler = async (ctx, params) => {
  const goal = store.goals.byId(params.id);
  if (!goal) throw new NotFoundError('Goal not found');
  if (goal.userId !== ctx.userId) throw new ForbiddenError();
  store.goals.remove(params.id);
  return { statusCode: 204, body: null };
};
