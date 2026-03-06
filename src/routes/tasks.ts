import { store, newId } from '../lib/mock-store';
import { NotFoundError, ForbiddenError, ValidationError } from '../middleware/error';
import { AppContext, RouteHandler } from '../types';

function parseBody(ctx: AppContext) {
  try { return JSON.parse(ctx.event.body ?? '{}'); } catch { return {}; }
}

export const listTasks: RouteHandler = async (ctx) => {
  const qs = ctx.event.queryStringParameters ?? {};
  let tasks = store.tasks.find(t => t.userId === ctx.userId);
  if (qs.project_id) tasks = tasks.filter(t => t.projectId === qs.project_id);
  if (qs.status)     tasks = tasks.filter(t => t.status === qs.status);
  if (qs.priority)   tasks = tasks.filter(t => t.priority === qs.priority);
  tasks.sort((a, b) => a.status.localeCompare(b.status) || a.position - b.position);
  return { statusCode: 200, body: tasks };
};

export const createTask: RouteHandler = async (ctx) => {
  const { title, description, status, priority, position, dueDate, projectId } = parseBody(ctx);
  if (!title) throw new ValidationError('title is required');
  if (projectId) {
    const project = store.projects.byId(projectId);
    if (!project) throw new NotFoundError('Project not found');
    if (project.userId !== ctx.userId) throw new ForbiddenError();
  }
  const now = new Date().toISOString();
  const task = store.tasks.insert({
    id: newId(), title,
    description: description ?? null,
    status: status ?? 'todo',
    priority: priority ?? 'medium',
    position: position ?? 0,
    dueDate: dueDate ?? null,
    projectId: projectId ?? null,
    userId: ctx.userId!,
    createdAt: now, updatedAt: now,
  });
  return { statusCode: 201, body: task };
};

export const getTask: RouteHandler = async (ctx, params) => {
  const task = store.tasks.byId(params.id);
  if (!task) throw new NotFoundError('Task not found');
  if (task.userId !== ctx.userId) throw new ForbiddenError();
  return { statusCode: 200, body: task };
};

export const updateTask: RouteHandler = async (ctx, params) => {
  const task = store.tasks.byId(params.id);
  if (!task) throw new NotFoundError('Task not found');
  if (task.userId !== ctx.userId) throw new ForbiddenError();
  const { title, description, status, priority, position, dueDate, projectId } = parseBody(ctx);
  const updated = store.tasks.update(params.id, {
    title, description, status, priority, position,
    dueDate: dueDate !== undefined ? (dueDate ?? null) : task.dueDate,
    projectId,
  });
  return { statusCode: 200, body: updated };
};

export const deleteTask: RouteHandler = async (ctx, params) => {
  const task = store.tasks.byId(params.id);
  if (!task) throw new NotFoundError('Task not found');
  if (task.userId !== ctx.userId) throw new ForbiddenError();
  store.tasks.remove(params.id);
  return { statusCode: 204, body: null };
};

export const reorderTasks: RouteHandler = async (ctx) => {
  const { task_id, status, position } = parseBody(ctx);
  if (!task_id) throw new ValidationError('task_id is required');
  const task = store.tasks.byId(task_id);
  if (!task) throw new NotFoundError('Task not found');
  if (task.userId !== ctx.userId) throw new ForbiddenError();
  const updated = store.tasks.update(task_id, { status, position });
  return { statusCode: 200, body: updated };
};
