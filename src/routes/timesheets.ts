import { store, newId } from '../lib/mock-store';
import { NotFoundError, ForbiddenError, ValidationError } from '../middleware/error';
import { AppContext, RouteHandler } from '../types';

function parseBody(ctx: AppContext) {
  try { return JSON.parse(ctx.event.body ?? '{}'); } catch { return {}; }
}

export const listTimesheets: RouteHandler = async (ctx) => {
  const qs = ctx.event.queryStringParameters ?? {};
  let entries = store.timesheets.find(t => t.userId === ctx.userId);
  if (qs.project_id) entries = entries.filter(t => t.projectId === qs.project_id);
  if (qs.billable !== undefined) entries = entries.filter(t => String(t.billable) === qs.billable);
  if (qs.start_date) entries = entries.filter(t => t.date >= qs.start_date!);
  if (qs.end_date) entries = entries.filter(t => t.date <= qs.end_date!);
  entries.sort((a, b) => b.date.localeCompare(a.date));
  return { statusCode: 200, body: entries };
};

export const createTimesheet: RouteHandler = async (ctx) => {
  const { projectId, contractId, date, hours, description, billable } = parseBody(ctx);
  if (!projectId) throw new ValidationError('projectId is required');
  if (!date) throw new ValidationError('date is required');
  if (hours === undefined) throw new ValidationError('hours is required');

  const project = store.projects.byId(projectId);
  if (!project) throw new NotFoundError('Project not found');
  if (project.userId !== ctx.userId) throw new ForbiddenError();

  const now = new Date().toISOString();
  const entry = store.timesheets.insert({
    id: newId(), userId: ctx.userId!, projectId,
    contractId: contractId ?? null,
    date, hours,
    description: description ?? null,
    billable: billable !== undefined ? billable : true,
    approved: false, approvedBy: null, approvedAt: null,
    createdAt: now, updatedAt: now,
  });
  return { statusCode: 201, body: entry };
};

export const updateTimesheet: RouteHandler = async (ctx, params) => {
  const entry = store.timesheets.byId(params.id);
  if (!entry) throw new NotFoundError('Timesheet entry not found');
  if (entry.userId !== ctx.userId) throw new ForbiddenError();
  const { date, hours, description, billable, contractId } = parseBody(ctx);
  const updated = store.timesheets.update(params.id, {
    date, hours, description, billable, contractId,
  });
  return { statusCode: 200, body: updated };
};

export const deleteTimesheet: RouteHandler = async (ctx, params) => {
  const entry = store.timesheets.byId(params.id);
  if (!entry) throw new NotFoundError('Timesheet entry not found');
  if (entry.userId !== ctx.userId) throw new ForbiddenError();
  store.timesheets.remove(params.id);
  return { statusCode: 204, body: null };
};

export const timesheetSummary: RouteHandler = async (ctx) => {
  const qs = ctx.event.queryStringParameters ?? {};
  let entries = store.timesheets.find(t => t.userId === ctx.userId && t.billable);

  if (qs.project_id) entries = entries.filter(t => t.projectId === qs.project_id);

  if (qs.month) {
    // qs.month = "2025-03"
    entries = entries.filter(t => t.date.startsWith(qs.month!));
  }

  const totalHours = entries.reduce((sum, t) => sum + t.hours, 0);
  const billableHours = entries.filter(t => t.billable).reduce((sum, t) => sum + t.hours, 0);

  // Group by project
  const byProject: Record<string, { projectId: string; hours: number; entries: number }> = {};
  for (const e of entries) {
    if (!byProject[e.projectId]) {
      byProject[e.projectId] = { projectId: e.projectId, hours: 0, entries: 0 };
    }
    byProject[e.projectId].hours += e.hours;
    byProject[e.projectId].entries += 1;
  }

  return {
    statusCode: 200,
    body: {
      totalHours,
      billableHours,
      totalEntries: entries.length,
      byProject: Object.values(byProject),
    },
  };
};
