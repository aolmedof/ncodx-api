import { store, newId } from '../lib/mock-store';
import { NotFoundError, ForbiddenError, ValidationError } from '../middleware/error';
import { AppContext, RouteHandler } from '../types';

function parseBody(ctx: AppContext) {
  try { return JSON.parse(ctx.event.body ?? '{}'); } catch { return {}; }
}

export const listIntegrations: RouteHandler = async (ctx) => {
  const qs = ctx.event.queryStringParameters ?? {};
  // Return integrations for projects owned by this user
  const userProjectIds = store.projects
    .find(p => p.userId === ctx.userId)
    .map(p => p.id);

  let integrations = store.integrations.find(i => userProjectIds.includes(i.projectId));
  if (qs.project_id) integrations = integrations.filter(i => i.projectId === qs.project_id);

  // Strip encrypted tokens from list response
  return {
    statusCode: 200,
    body: integrations.map(({ tokenEncrypted: _t, refreshTokenEncrypted: _r, ...safe }) => safe),
  };
};

export const createIntegration: RouteHandler = async (ctx) => {
  const { projectId, provider, token, refreshToken, tokenExpiry, scopes, metadataJson } = parseBody(ctx);
  if (!projectId) throw new ValidationError('projectId is required');
  if (!provider) throw new ValidationError('provider is required');
  if (!token) throw new ValidationError('token is required');

  const project = store.projects.byId(projectId);
  if (!project) throw new NotFoundError('Project not found');
  if (project.userId !== ctx.userId) throw new ForbiddenError();

  const now = new Date().toISOString();
  const integration = store.integrations.insert({
    id: newId(), projectId, provider,
    tokenEncrypted: `demo_encrypted_${token}`,
    refreshTokenEncrypted: refreshToken ? `demo_encrypted_${refreshToken}` : null,
    tokenExpiry: tokenExpiry ?? null,
    scopes: scopes ?? null,
    metadataJson: metadataJson ?? null,
    createdAt: now, updatedAt: now,
  });

  const { tokenEncrypted: _t, refreshTokenEncrypted: _r, ...safe } = integration;
  return { statusCode: 201, body: safe };
};

export const updateIntegration: RouteHandler = async (ctx, params) => {
  const integration = store.integrations.byId(params.id);
  if (!integration) throw new NotFoundError('Integration not found');

  const project = store.projects.byId(integration.projectId);
  if (!project || project.userId !== ctx.userId) throw new ForbiddenError();

  const { token, refreshToken, tokenExpiry, scopes, metadataJson } = parseBody(ctx);
  const patch: Partial<typeof integration> = {};
  if (token !== undefined) patch.tokenEncrypted = `demo_encrypted_${token}`;
  if (refreshToken !== undefined) patch.refreshTokenEncrypted = `demo_encrypted_${refreshToken}`;
  if (tokenExpiry !== undefined) patch.tokenExpiry = tokenExpiry;
  if (scopes !== undefined) patch.scopes = scopes;
  if (metadataJson !== undefined) patch.metadataJson = metadataJson;

  const updated = store.integrations.update(params.id, patch);
  if (!updated) throw new NotFoundError('Integration not found');
  const { tokenEncrypted: _t, refreshTokenEncrypted: _r, ...safe } = updated;
  return { statusCode: 200, body: safe };
};

export const deleteIntegration: RouteHandler = async (ctx, params) => {
  const integration = store.integrations.byId(params.id);
  if (!integration) throw new NotFoundError('Integration not found');

  const project = store.projects.byId(integration.projectId);
  if (!project || project.userId !== ctx.userId) throw new ForbiddenError();

  store.integrations.remove(params.id);
  return { statusCode: 204, body: null };
};
