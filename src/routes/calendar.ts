import { store, newId } from '../lib/mock-store';
import { NotFoundError, ForbiddenError, ValidationError } from '../middleware/error';
import { AppContext, RouteHandler } from '../types';

function parseBody(ctx: AppContext) {
  try { return JSON.parse(ctx.event.body ?? '{}'); } catch { return {}; }
}

// --- Connections ---

export const listConnections: RouteHandler = async (ctx) => {
  const connections = store.calendarConnections
    .find(c => c.userId === ctx.userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return { statusCode: 200, body: connections };
};

export const createConnection: RouteHandler = async (ctx) => {
  const { provider, access_token, expires_at, metadata } = parseBody(ctx);
  if (!provider || !access_token) throw new ValidationError('provider and access_token are required');
  const now = new Date().toISOString();
  const conn = store.calendarConnections.insert({
    id: newId(), provider,
    expiresAt: expires_at ?? null,
    metadata: metadata ?? null,
    userId: ctx.userId!,
    createdAt: now, updatedAt: now,
  });
  return { statusCode: 201, body: conn };
};

export const deleteConnection: RouteHandler = async (ctx, params) => {
  const conn = store.calendarConnections.byId(params.id);
  if (!conn) throw new NotFoundError('Connection not found');
  if (conn.userId !== ctx.userId) throw new ForbiddenError();
  store.calendarConnections.remove(params.id);
  return { statusCode: 204, body: null };
};

// --- Events ---

export const listEvents: RouteHandler = async (ctx) => {
  const qs = ctx.event.queryStringParameters ?? {};
  let events = store.calendarEvents.find(e => e.userId === ctx.userId);
  if (qs.start) events = events.filter(e => e.startAt >= qs.start!);
  if (qs.end)   events = events.filter(e => e.endAt <= qs.end!);
  events.sort((a, b) => a.startAt.localeCompare(b.startAt));
  return { statusCode: 200, body: events };
};

export const createEvent: RouteHandler = async (ctx) => {
  const { title, description, startAt, endAt, allDay, location } = parseBody(ctx);
  if (!title || !startAt || !endAt) throw new ValidationError('title, startAt, and endAt are required');
  const now = new Date().toISOString();
  const event = store.calendarEvents.insert({
    id: newId(), title,
    description: description ?? null,
    startAt, endAt,
    allDay: allDay ?? false,
    location: location ?? null,
    source: null,
    userId: ctx.userId!,
    createdAt: now, updatedAt: now,
  });
  return { statusCode: 201, body: event };
};

export const syncCalendar: RouteHandler = async (ctx) => {
  const connections = store.calendarConnections.find(c => c.userId === ctx.userId);
  return {
    statusCode: 200,
    body: { synced: connections.length, message: 'Sync triggered (demo mode — mock data only)' },
  };
};
