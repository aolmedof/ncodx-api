import prisma from '../lib/prisma';
import { NotFoundError, ForbiddenError } from '../middleware/error';
import { AppContext, RouteHandler } from '../types';

function parseBody(ctx: AppContext) {
  try {
    return JSON.parse(ctx.event.body ?? '{}');
  } catch {
    return {};
  }
}

export const listNotes: RouteHandler = async (ctx) => {
  const notes = await prisma.note.findMany({
    where: { userId: ctx.userId },
    orderBy: { updatedAt: 'desc' },
  });
  return { statusCode: 200, body: notes };
};

export const createNote: RouteHandler = async (ctx) => {
  const { title, content, color, posX, posY } = parseBody(ctx);
  const note = await prisma.note.create({
    data: {
      title,
      content,
      color,
      posX: posX ?? 0,
      posY: posY ?? 0,
      userId: ctx.userId!,
    },
  });
  return { statusCode: 201, body: note };
};

export const updateNote: RouteHandler = async (ctx, params) => {
  const note = await prisma.note.findUnique({ where: { id: params.id } });
  if (!note) throw new NotFoundError('Note not found');
  if (note.userId !== ctx.userId) throw new ForbiddenError();

  const { title, content, color, posX, posY } = parseBody(ctx);
  const updated = await prisma.note.update({
    where: { id: params.id },
    data: { title, content, color, posX, posY },
  });
  return { statusCode: 200, body: updated };
};

export const deleteNote: RouteHandler = async (ctx, params) => {
  const note = await prisma.note.findUnique({ where: { id: params.id } });
  if (!note) throw new NotFoundError('Note not found');
  if (note.userId !== ctx.userId) throw new ForbiddenError();
  await prisma.note.delete({ where: { id: params.id } });
  return { statusCode: 204, body: null };
};
