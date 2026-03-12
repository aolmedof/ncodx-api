import { store, newId } from '../lib/mock-store';
import { NotFoundError, ForbiddenError } from '../middleware/error';
import { AppContext, RouteHandler } from '../types';

function parseBody(ctx: AppContext) {
  try { return JSON.parse(ctx.event.body ?? '{}'); } catch { return {}; }
}

export const listNotes: RouteHandler = async (ctx) => {
  const notes = store.notes
    .find(n => n.userId === ctx.userId)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return { statusCode: 200, body: notes };
};

export const createNote: RouteHandler = async (ctx) => {
  const { title, content, color, posX, posY } = parseBody(ctx);
  const now = new Date().toISOString();
  const note = store.notes.insert({
    id: newId(),
    title: title ?? null,
    content: content ?? null,
    color: color ?? '#FEF08A',
    pinned: false,
    posX: posX ?? 0,
    posY: posY ?? 0,
    userId: ctx.userId!,
    createdAt: now, updatedAt: now,
  });
  return { statusCode: 201, body: note };
};

export const updateNote: RouteHandler = async (ctx, params) => {
  const note = store.notes.byId(params.id);
  if (!note) throw new NotFoundError('Note not found');
  if (note.userId !== ctx.userId) throw new ForbiddenError();
  const { title, content, color, posX, posY } = parseBody(ctx);
  const updated = store.notes.update(params.id, { title, content, color, posX, posY });
  return { statusCode: 200, body: updated };
};

export const deleteNote: RouteHandler = async (ctx, params) => {
  const note = store.notes.byId(params.id);
  if (!note) throw new NotFoundError('Note not found');
  if (note.userId !== ctx.userId) throw new ForbiddenError();
  store.notes.remove(params.id);
  return { statusCode: 204, body: null };
};
