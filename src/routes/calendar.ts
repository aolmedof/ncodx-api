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

// --- Connections ---

export const listConnections: RouteHandler = async (ctx) => {
  const connections = await prisma.calendarConnection.findMany({
    where: { userId: ctx.userId },
    orderBy: { createdAt: 'desc' },
    select: { id: true, provider: true, expiresAt: true, metadata: true, createdAt: true, updatedAt: true },
  });
  return { statusCode: 200, body: connections };
};

export const createConnection: RouteHandler = async (ctx) => {
  const { provider, access_token, refresh_token, expires_at, metadata } = parseBody(ctx);
  if (!provider || !access_token) throw new ValidationError('provider and access_token are required');
  const conn = await prisma.calendarConnection.create({
    data: {
      provider,
      accessToken: access_token,
      refreshToken: refresh_token,
      expiresAt: expires_at ? new Date(expires_at) : undefined,
      metadata,
      userId: ctx.userId!,
    },
  });
  const { accessToken: _at, refreshToken: _rt, ...safe } = conn;
  return { statusCode: 201, body: safe };
};

export const deleteConnection: RouteHandler = async (ctx, params) => {
  const conn = await prisma.calendarConnection.findUnique({ where: { id: params.id } });
  if (!conn) throw new NotFoundError('Connection not found');
  if (conn.userId !== ctx.userId) throw new ForbiddenError();
  await prisma.calendarConnection.delete({ where: { id: params.id } });
  return { statusCode: 204, body: null };
};

// --- Events ---

export const listEvents: RouteHandler = async (ctx) => {
  const qs = ctx.event.queryStringParameters ?? {};
  const where: Record<string, unknown> = { userId: ctx.userId };
  if (qs.start) where.startAt = { gte: new Date(qs.start) };
  if (qs.end) where.endAt = { lte: new Date(qs.end) };

  const events = await prisma.calendarEvent.findMany({
    where,
    orderBy: { startAt: 'asc' },
  });
  return { statusCode: 200, body: events };
};

export const createEvent: RouteHandler = async (ctx) => {
  const { title, description, startAt, endAt, allDay, location } = parseBody(ctx);
  if (!title || !startAt || !endAt) throw new ValidationError('title, startAt, and endAt are required');
  const event = await prisma.calendarEvent.create({
    data: {
      title,
      description,
      startAt: new Date(startAt),
      endAt: new Date(endAt),
      allDay: allDay ?? false,
      location,
      userId: ctx.userId!,
    },
  });
  return { statusCode: 201, body: event };
};

export const syncCalendar: RouteHandler = async (ctx) => {
  // Placeholder: trigger sync logic per provider
  const connections = await prisma.calendarConnection.findMany({
    where: { userId: ctx.userId },
  });
  // In a real implementation, each provider's OAuth token would be used
  // to fetch events and upsert CalendarEvent records.
  return {
    statusCode: 200,
    body: { synced: connections.length, message: 'Sync triggered (mock)' },
  };
};
