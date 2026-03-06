import { store, newId } from '../lib/mock-store';
import { NotFoundError, ForbiddenError, ValidationError } from '../middleware/error';
import { AppContext, RouteHandler } from '../types';

function parseBody(ctx: AppContext) {
  try { return JSON.parse(ctx.event.body ?? '{}'); } catch { return {}; }
}

const MOCK_RESPONSES = [
  'Entendido. Basándome en los datos disponibles, te recomendaría revisar la arquitectura actual y considerar optimizaciones incrementales.',
  'Excelente pregunta. Para este tipo de problema, la mejor práctica es dividirlo en partes más pequeñas y abordarlo iterativamente.',
  'Con gusto te ayudo con eso. La clave aquí es mantener la simplicidad y evitar la sobre-ingeniería en las primeras etapas.',
  'Interesante perspectiva. Te sugiero explorar las alternativas disponibles y elegir la que mejor se alinee con tus objetivos de negocio.',
];

export const listConversations: RouteHandler = async (ctx) => {
  const convs = store.conversations
    .find(c => c.userId === ctx.userId)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  const result = convs.map(c => {
    const messages = store.aiMessages
      .find(m => m.conversationId === c.id)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 1);
    return { ...c, messages };
  });

  return { statusCode: 200, body: result };
};

export const createConversation: RouteHandler = async (ctx) => {
  const { title } = parseBody(ctx);
  const now = new Date().toISOString();
  const conversation = store.conversations.insert({
    id: newId(), title: title ?? null,
    userId: ctx.userId!,
    createdAt: now, updatedAt: now,
  });
  return { statusCode: 201, body: conversation };
};

export const getConversation: RouteHandler = async (ctx, params) => {
  const conversation = store.conversations.byId(params.id);
  if (!conversation) throw new NotFoundError('Conversation not found');
  if (conversation.userId !== ctx.userId) throw new ForbiddenError();
  const messages = store.aiMessages
    .find(m => m.conversationId === params.id)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  return { statusCode: 200, body: { ...conversation, messages } };
};

export const sendMessage: RouteHandler = async (ctx, params) => {
  const { content } = parseBody(ctx);
  if (!content) throw new ValidationError('content is required');

  const conversation = store.conversations.byId(params.id);
  if (!conversation) throw new NotFoundError('Conversation not found');
  if (conversation.userId !== ctx.userId) throw new ForbiddenError();

  const now = new Date().toISOString();

  store.aiMessages.insert({ id: newId(), role: 'user', content, conversationId: params.id, createdAt: now });

  const mockResponse = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
  const assistantMessage = store.aiMessages.insert({
    id: newId(), role: 'assistant', content: mockResponse,
    conversationId: params.id, createdAt: now,
  });

  store.conversations.update(params.id, { updatedAt: now });

  return { statusCode: 200, body: assistantMessage };
};

export const deleteConversation: RouteHandler = async (ctx, params) => {
  const conversation = store.conversations.byId(params.id);
  if (!conversation) throw new NotFoundError('Conversation not found');
  if (conversation.userId !== ctx.userId) throw new ForbiddenError();
  store.conversations.remove(params.id);
  return { statusCode: 204, body: null };
};
