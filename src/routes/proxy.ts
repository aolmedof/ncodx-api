import { RouteHandler } from '../types';

// ---------------------------------------------------------------------------
// Proxy routes — mock data only (demo mode).
// In production: forward requests to Azure DevOps / GitHub / AWS APIs
// using tokens from IntegrationToken store.
// ---------------------------------------------------------------------------

export const azureProjects: RouteHandler = async () => ({
  statusCode: 200,
  body: {
    count: 2,
    value: [
      { id: 'az-proj-1', name: 'portal-banca', description: 'Portal de banca en línea Santander', state: 'wellFormed', visibility: 'private', lastUpdateTime: '2025-02-28T12:00:00Z' },
      { id: 'az-proj-2', name: 'oxxo-pay', description: 'App móvil OXXO Pay FEMSA', state: 'wellFormed', visibility: 'private', lastUpdateTime: '2025-03-01T08:30:00Z' },
    ],
  },
});

export const azureBoards: RouteHandler = async (_ctx, params) => ({
  statusCode: 200,
  body: {
    count: 2,
    value: [
      { id: 'board-1', name: 'Sprint Board', projectId: params.projectId, columns: ['New', 'Active', 'Resolved', 'Closed'] },
      { id: 'board-2', name: 'Backlog', projectId: params.projectId, columns: ['Backlog', 'In Progress', 'Done'] },
    ],
  },
});

export const azureRepos: RouteHandler = async (_ctx, params) => ({
  statusCode: 200,
  body: {
    count: 1,
    value: [
      { id: 'repo-1', name: params.projectId, defaultBranch: 'refs/heads/main', remoteUrl: `https://dev.azure.com/org/${params.projectId}/_git/${params.projectId}`, size: 42580 },
    ],
  },
});

export const azurePipelines: RouteHandler = async (_ctx, params) => ({
  statusCode: 200,
  body: {
    count: 2,
    value: [
      { id: 1, name: 'CI Pipeline', folder: '\\', revision: 12, _links: { web: { href: `https://dev.azure.com/org/${params.projectId}/_build?definitionId=1` } } },
      { id: 2, name: 'CD Pipeline - Production', folder: '\\deploy', revision: 8, _links: { web: { href: `https://dev.azure.com/org/${params.projectId}/_build?definitionId=2` } } },
    ],
  },
});

export const githubRepo: RouteHandler = async (_ctx, params) => ({
  statusCode: 200,
  body: {
    id: 123456789,
    name: params.repo,
    full_name: `${params.owner}/${params.repo}`,
    private: true,
    description: 'Demo repository',
    default_branch: 'main',
    language: 'TypeScript',
    stargazers_count: 0,
    open_issues_count: 3,
    pushed_at: '2025-03-10T14:22:00Z',
    updated_at: '2025-03-10T14:22:00Z',
  },
});

export const githubBranches: RouteHandler = async (_ctx, params) => ({
  statusCode: 200,
  body: [
    { name: 'main', protected: true, commit: { sha: 'abc1234567890', url: `https://api.github.com/repos/${params.owner}/${params.repo}/commits/abc1234567890` } },
    { name: 'develop', protected: false, commit: { sha: 'def0987654321', url: `https://api.github.com/repos/${params.owner}/${params.repo}/commits/def0987654321` } },
    { name: 'feat/notifications', protected: false, commit: { sha: 'ghi1122334455', url: `https://api.github.com/repos/${params.owner}/${params.repo}/commits/ghi1122334455` } },
  ],
});

export const githubPulls: RouteHandler = async (_ctx, _params) => ({
  statusCode: 200,
  body: [
    { id: 101, number: 42, title: 'feat: add push notifications module', state: 'open', user: { login: 'aolmedof' }, base: { ref: 'main' }, head: { ref: 'feat/notifications' }, created_at: '2025-03-08T09:00:00Z', draft: false },
    { id: 102, number: 43, title: 'fix: resolve auth token expiry edge case', state: 'open', user: { login: 'aolmedof' }, base: { ref: 'develop' }, head: { ref: 'fix/auth-token' }, created_at: '2025-03-10T11:30:00Z', draft: true },
  ],
});

export const awsPipelines: RouteHandler = async () => ({
  statusCode: 200,
  body: {
    pipelines: [
      { name: 'ncodx-api-prod', status: 'Succeeded', lastExecutionId: 'exec-123', created: '2025-01-15T10:00:00Z', updated: '2025-03-10T16:45:00Z' },
      { name: 'ncodx-app-prod', status: 'Succeeded', lastExecutionId: 'exec-456', created: '2025-01-15T10:30:00Z', updated: '2025-03-10T16:50:00Z' },
      { name: 'santander-portal-staging', status: 'InProgress', lastExecutionId: 'exec-789', created: '2025-02-01T09:00:00Z', updated: '2025-03-12T08:20:00Z' },
    ],
  },
});

export const awsCloudFront: RouteHandler = async () => ({
  statusCode: 200,
  body: {
    distributions: [
      { id: 'E1ABCDEFGHIJKL', domainName: 'dxxxxxx.cloudfront.net', aliases: ['www.ncodx.com', 'ncodx.com'], status: 'Deployed', priceClass: 'PriceClass_100', enabled: true, comment: 'NCODX App CDN' },
      { id: 'E2MNOPQRSTUVWX', domainName: 'dyyyyyy.cloudfront.net', aliases: ['portal-dev.santander.com.mx'], status: 'Deployed', priceClass: 'PriceClass_All', enabled: true, comment: 'Santander Portal Staging' },
    ],
  },
});
