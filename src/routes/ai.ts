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

export const listConversations: RouteHandler = async (ctx) => {
  const conversations = await prisma.aiConversation.findMany({
    where: { userId: ctx.userId },
    orderBy: { updatedAt: 'desc' },
    include: { messages: { take: 1, orderBy: { createdAt: 'desc' } } },
  });
  return { statusCode: 200, body: conversations };
};

export const createConversation: RouteHandler = async (ctx) => {
  const { title } = parseBody(ctx);
  const conversation = await prisma.aiConversation.create({
    data: { title, userId: ctx.userId! },
  });
  return { statusCode: 201, body: conversation };
};

export const getConversation: RouteHandler = async (ctx, params) => {
  const conversation = await prisma.aiConversation.findUnique({
    where: { id: params.id },
    include: { messages: { orderBy: { createdAt: 'asc' } } },
  });
  if (!conversation) throw new NotFoundError('Conversation not found');
  if (conversation.userId !== ctx.userId) throw new ForbiddenError();
  return { statusCode: 200, body: conversation };
};

export const sendMessage: RouteHandler = async (ctx, params) => {
  const { content } = parseBody(ctx);
  if (!content) throw new ValidationError('content is required');

  const conversation = await prisma.aiConversation.findUnique({ where: { id: params.id } });
  if (!conversation) throw new NotFoundError('Conversation not found');
  if (conversation.userId !== ctx.userId) throw new ForbiddenError();

  // Save user message
  await prisma.aiMessage.create({
    data: { role: 'user', content, conversationId: params.id },
  });

  // Mock AI response — replace with real AI call
  const assistantContent = `Mock response to: "${content}"`;
  const assistantMessage = await prisma.aiMessage.create({
    data: { role: 'assistant', content: assistantContent, conversationId: params.id },
  });

  // Update conversation timestamp
  await prisma.aiConversation.update({
    where: { id: params.id },
    data: { updatedAt: new Date() },
  });

  return { statusCode: 200, body: assistantMessage };
};

export const deleteConversation: RouteHandler = async (ctx, params) => {
  const conversation = await prisma.aiConversation.findUnique({ where: { id: params.id } });
  if (!conversation) throw new NotFoundError('Conversation not found');
  if (conversation.userId !== ctx.userId) throw new ForbiddenError();
  await prisma.aiConversation.delete({ where: { id: params.id } });
  return { statusCode: 204, body: null };
};
