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

export const listTasks: RouteHandler = async (ctx) => {
  const qs = ctx.event.queryStringParameters ?? {};
  const where: Record<string, unknown> = { userId: ctx.userId };
  if (qs.project_id) where.projectId = qs.project_id;
  if (qs.status) where.status = qs.status;
  if (qs.priority) where.priority = qs.priority;

  const tasks = await prisma.task.findMany({
    where,
    orderBy: [{ status: 'asc' }, { position: 'asc' }],
  });
  return { statusCode: 200, body: tasks };
};

export const createTask: RouteHandler = async (ctx) => {
  const { title, description, status, priority, position, dueDate, projectId } = parseBody(ctx);
  if (!title) throw new ValidationError('title is required');

  // Verify project ownership if provided
  if (projectId) {
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new NotFoundError('Project not found');
    if (project.userId !== ctx.userId) throw new ForbiddenError();
  }

  const task = await prisma.task.create({
    data: {
      title,
      description,
      status: status ?? 'todo',
      priority: priority ?? 'medium',
      position: position ?? 0,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      projectId,
      userId: ctx.userId!,
    },
  });
  return { statusCode: 201, body: task };
};

export const getTask: RouteHandler = async (ctx, params) => {
  const task = await prisma.task.findUnique({ where: { id: params.id } });
  if (!task) throw new NotFoundError('Task not found');
  if (task.userId !== ctx.userId) throw new ForbiddenError();
  return { statusCode: 200, body: task };
};

export const updateTask: RouteHandler = async (ctx, params) => {
  const task = await prisma.task.findUnique({ where: { id: params.id } });
  if (!task) throw new NotFoundError('Task not found');
  if (task.userId !== ctx.userId) throw new ForbiddenError();

  const { title, description, status, priority, position, dueDate, projectId } = parseBody(ctx);
  const updated = await prisma.task.update({
    where: { id: params.id },
    data: {
      title,
      description,
      status,
      priority,
      position,
      dueDate: dueDate !== undefined ? (dueDate ? new Date(dueDate) : null) : undefined,
      projectId,
    },
  });
  return { statusCode: 200, body: updated };
};

export const deleteTask: RouteHandler = async (ctx, params) => {
  const task = await prisma.task.findUnique({ where: { id: params.id } });
  if (!task) throw new NotFoundError('Task not found');
  if (task.userId !== ctx.userId) throw new ForbiddenError();
  await prisma.task.delete({ where: { id: params.id } });
  return { statusCode: 204, body: null };
};

export const reorderTasks: RouteHandler = async (ctx) => {
  const { task_id, status, position } = parseBody(ctx);
  if (!task_id) throw new ValidationError('task_id is required');

  const task = await prisma.task.findUnique({ where: { id: task_id } });
  if (!task) throw new NotFoundError('Task not found');
  if (task.userId !== ctx.userId) throw new ForbiddenError();

  const updated = await prisma.task.update({
    where: { id: task_id },
    data: { status, position },
  });
  return { statusCode: 200, body: updated };
};
