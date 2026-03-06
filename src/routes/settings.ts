import { store, newId } from '../lib/mock-store';
import { AppContext, RouteHandler } from '../types';

function parseBody(ctx: AppContext) {
  try { return JSON.parse(ctx.event.body ?? '{}'); } catch { return {}; }
}

export const getSettings: RouteHandler = async (ctx) => {
  let settings = store.settings.findOne(s => s.userId === ctx.userId!);
  if (!settings) {
    const now = new Date().toISOString();
    settings = store.settings.insert({
      id: newId(), userId: ctx.userId!,
      locale: 'es', timezone: 'UTC', theme: 'dark', metadata: null,
      createdAt: now, updatedAt: now,
    });
  }
  return { statusCode: 200, body: settings };
};

export const updateSettings: RouteHandler = async (ctx) => {
  const { locale, timezone, theme, metadata } = parseBody(ctx);
  let settings = store.settings.findOne(s => s.userId === ctx.userId!);
  if (!settings) {
    const now = new Date().toISOString();
    settings = store.settings.insert({
      id: newId(), userId: ctx.userId!,
      locale: locale ?? 'es', timezone: timezone ?? 'UTC',
      theme: theme ?? 'dark', metadata: metadata ?? null,
      createdAt: now, updatedAt: now,
    });
  } else {
    settings = store.settings.update(settings.id, { locale, timezone, theme, metadata })!;
  }
  return { statusCode: 200, body: settings };
};
