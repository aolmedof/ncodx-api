import { store, newId } from '../lib/mock-store';
import { NotFoundError, ForbiddenError, ValidationError } from '../middleware/error';
import { AppContext, RouteHandler } from '../types';

function parseBody(ctx: AppContext) {
  try { return JSON.parse(ctx.event.body ?? '{}'); } catch { return {}; }
}

export const listProjects: RouteHandler = async (ctx) => {
  const projects = store.projects
    .find(p => p.userId === ctx.userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return { statusCode: 200, body: projects };
};

export const createProject: RouteHandler = async (ctx) => {
  const {
    name, description, color, icon, status,
    clientName, clientEmail, hourlyRate, monthlyRate, currency,
    startDate, endDate,
    azureDevopsOrg, azureDevopsProject, githubRepo,
    awsAccountId, awsRegion, jumpserverUsername,
  } = parseBody(ctx);
  if (!name) throw new ValidationError('name is required');
  const now = new Date().toISOString();
  const project = store.projects.insert({
    id: newId(), userId: ctx.userId!,
    name,
    description: description ?? null,
    color: color ?? '#3B82F6',
    icon: icon ?? null,
    status: status ?? 'active',
    clientName: clientName ?? null,
    clientEmail: clientEmail ?? null,
    hourlyRate: hourlyRate ?? null,
    monthlyRate: monthlyRate ?? null,
    currency: currency ?? 'USD',
    startDate: startDate ?? null,
    endDate: endDate ?? null,
    azureDevopsOrg: azureDevopsOrg ?? null,
    azureDevopsProject: azureDevopsProject ?? null,
    githubRepo: githubRepo ?? null,
    awsAccountId: awsAccountId ?? null,
    awsRegion: awsRegion ?? null,
    jumpserverUsername: jumpserverUsername ?? null,
    createdAt: now, updatedAt: now,
  });
  return { statusCode: 201, body: project };
};

export const getProject: RouteHandler = async (ctx, params) => {
  const project = store.projects.byId(params.id);
  if (!project) throw new NotFoundError('Project not found');
  if (project.userId !== ctx.userId) throw new ForbiddenError();
  const tasks = store.tasks
    .find(t => t.projectId === params.id)
    .sort((a, b) => a.position - b.position);
  return { statusCode: 200, body: { ...project, tasks } };
};

export const updateProject: RouteHandler = async (ctx, params) => {
  const project = store.projects.byId(params.id);
  if (!project) throw new NotFoundError('Project not found');
  if (project.userId !== ctx.userId) throw new ForbiddenError();
  const {
    name, description, color, icon, status,
    clientName, clientEmail, hourlyRate, monthlyRate, currency,
    startDate, endDate,
    azureDevopsOrg, azureDevopsProject, githubRepo,
    awsAccountId, awsRegion, jumpserverUsername,
  } = parseBody(ctx);
  const updated = store.projects.update(params.id, {
    name, description, color, icon, status,
    clientName, clientEmail, hourlyRate, monthlyRate, currency,
    startDate, endDate,
    azureDevopsOrg, azureDevopsProject, githubRepo,
    awsAccountId, awsRegion, jumpserverUsername,
  });
  return { statusCode: 200, body: updated };
};

export const deleteProject: RouteHandler = async (ctx, params) => {
  const project = store.projects.byId(params.id);
  if (!project) throw new NotFoundError('Project not found');
  if (project.userId !== ctx.userId) throw new ForbiddenError();
  store.projects.remove(params.id);
  return { statusCode: 204, body: null };
};
