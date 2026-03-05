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

export const listProjects: RouteHandler = async (ctx) => {
  const projects = await prisma.project.findMany({
    where: { userId: ctx.userId },
    orderBy: { createdAt: 'desc' },
  });
  return { statusCode: 200, body: projects };
};

export const createProject: RouteHandler = async (ctx) => {
  const { name, description, color } = parseBody(ctx);
  if (!name) throw new ValidationError('name is required');
  const project = await prisma.project.create({
    data: { name, description, color, userId: ctx.userId! },
  });
  return { statusCode: 201, body: project };
};

export const getProject: RouteHandler = async (ctx, params) => {
  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: { tasks: { orderBy: { position: 'asc' } } },
  });
  if (!project) throw new NotFoundError('Project not found');
  if (project.userId !== ctx.userId) throw new ForbiddenError();
  return { statusCode: 200, body: project };
};

export const updateProject: RouteHandler = async (ctx, params) => {
  const project = await prisma.project.findUnique({ where: { id: params.id } });
  if (!project) throw new NotFoundError('Project not found');
  if (project.userId !== ctx.userId) throw new ForbiddenError();

  const { name, description, color } = parseBody(ctx);
  const updated = await prisma.project.update({
    where: { id: params.id },
    data: { name, description, color },
  });
  return { statusCode: 200, body: updated };
};

export const deleteProject: RouteHandler = async (ctx, params) => {
  const project = await prisma.project.findUnique({ where: { id: params.id } });
  if (!project) throw new NotFoundError('Project not found');
  if (project.userId !== ctx.userId) throw new ForbiddenError();
  await prisma.project.delete({ where: { id: params.id } });
  return { statusCode: 204, body: null };
};
