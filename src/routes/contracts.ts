import { store, newId } from '../lib/mock-store';
import { NotFoundError, ForbiddenError, ValidationError } from '../middleware/error';
import { AppContext, RouteHandler } from '../types';

function parseBody(ctx: AppContext) {
  try { return JSON.parse(ctx.event.body ?? '{}'); } catch { return {}; }
}

export const listContracts: RouteHandler = async (ctx) => {
  const qs = ctx.event.queryStringParameters ?? {};
  let contracts = store.contracts.find(c => c.userId === ctx.userId);
  if (qs.project_id) contracts = contracts.filter(c => c.projectId === qs.project_id);
  if (qs.status) contracts = contracts.filter(c => c.status === qs.status);
  contracts.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return { statusCode: 200, body: contracts };
};

export const createContract: RouteHandler = async (ctx) => {
  const { title, projectId, type, rate, currency, startDate, endDate, status, documentUrl, notes } = parseBody(ctx);
  if (!title) throw new ValidationError('title is required');
  if (!projectId) throw new ValidationError('projectId is required');
  if (!rate) throw new ValidationError('rate is required');
  if (!startDate) throw new ValidationError('startDate is required');

  const project = store.projects.byId(projectId);
  if (!project) throw new NotFoundError('Project not found');
  if (project.userId !== ctx.userId) throw new ForbiddenError();

  const now = new Date().toISOString();
  const contract = store.contracts.insert({
    id: newId(), userId: ctx.userId!, projectId,
    title, type: type ?? 'hourly',
    rate, currency: currency ?? 'USD',
    startDate, endDate: endDate ?? null,
    status: status ?? 'active',
    documentUrl: documentUrl ?? null,
    notes: notes ?? null,
    createdAt: now, updatedAt: now,
  });
  return { statusCode: 201, body: contract };
};

export const getContract: RouteHandler = async (ctx, params) => {
  const contract = store.contracts.byId(params.id);
  if (!contract) throw new NotFoundError('Contract not found');
  if (contract.userId !== ctx.userId) throw new ForbiddenError();
  return { statusCode: 200, body: contract };
};

export const updateContract: RouteHandler = async (ctx, params) => {
  const contract = store.contracts.byId(params.id);
  if (!contract) throw new NotFoundError('Contract not found');
  if (contract.userId !== ctx.userId) throw new ForbiddenError();
  const { title, type, rate, currency, startDate, endDate, status, documentUrl, notes } = parseBody(ctx);
  const updated = store.contracts.update(params.id, {
    title, type, rate, currency, startDate, endDate, status, documentUrl, notes,
  });
  return { statusCode: 200, body: updated };
};

export const deleteContract: RouteHandler = async (ctx, params) => {
  const contract = store.contracts.byId(params.id);
  if (!contract) throw new NotFoundError('Contract not found');
  if (contract.userId !== ctx.userId) throw new ForbiddenError();
  store.contracts.remove(params.id);
  return { statusCode: 204, body: null };
};
