import prisma from '../lib/prisma';
import { AppContext, RouteHandler } from '../types';

function parseBody(ctx: AppContext) {
  try {
    return JSON.parse(ctx.event.body ?? '{}');
  } catch {
    return {};
  }
}

export const getSettings: RouteHandler = async (ctx) => {
  const settings = await prisma.userSettings.upsert({
    where: { userId: ctx.userId! },
    update: {},
    create: { userId: ctx.userId! },
  });
  return { statusCode: 200, body: settings };
};

export const updateSettings: RouteHandler = async (ctx) => {
  const { locale, timezone, theme, metadata } = parseBody(ctx);
  const settings = await prisma.userSettings.upsert({
    where: { userId: ctx.userId! },
    update: { locale, timezone, theme, metadata },
    create: { userId: ctx.userId!, locale, timezone, theme, metadata },
  });
  return { statusCode: 200, body: settings };
};
