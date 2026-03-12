import { Route, RouteHandler } from './types';

function pathToRegex(path: string): { pattern: RegExp; paramNames: string[] } {
  const paramNames: string[] = [];
  const regexStr = path
    .replace(/:([^/]+)/g, (_, name) => {
      paramNames.push(name);
      return '([^/]+)';
    })
    .replace(/\//g, '\\/');
  return { pattern: new RegExp(`^${regexStr}$`), paramNames };
}

export class Router {
  private routes: Route[] = [];

  add(method: string, path: string, handler: RouteHandler, auth = true): void {
    const { pattern, paramNames } = pathToRegex(path);
    this.routes.push({ method: method.toUpperCase(), pattern, paramNames, handler, auth });
  }

  match(method: string, path: string): { route: Route; params: Record<string, string> } | null {
    for (const route of this.routes) {
      if (route.method !== method.toUpperCase()) continue;
      const match = path.match(route.pattern);
      if (!match) continue;
      const params: Record<string, string> = {};
      route.paramNames.forEach((name, i) => {
        params[name] = match[i + 1];
      });
      return { route, params };
    }
    return null;
  }
}

export const router = new Router();

// ── Auth ──────────────────────────────────────────────────────────────────────
import * as auth from './routes/auth';
router.add('POST', '/auth/login',    auth.login,        false);
router.add('POST', '/auth/register', auth.register,     false);
router.add('GET',  '/me',            auth.me,           true);
router.add('PUT',  '/me',            auth.updateMe,     true);
router.add('POST', '/me/avatar',     auth.uploadAvatar, true);

// ── Projects ──────────────────────────────────────────────────────────────────
import * as projects from './routes/projects';
router.add('GET',    '/projects',     projects.listProjects);
router.add('POST',   '/projects',     projects.createProject);
router.add('GET',    '/projects/:id', projects.getProject);
router.add('PUT',    '/projects/:id', projects.updateProject);
router.add('DELETE', '/projects/:id', projects.deleteProject);

// ── Tasks ─────────────────────────────────────────────────────────────────────
import * as tasks from './routes/tasks';
router.add('GET',    '/tasks',         tasks.listTasks);
router.add('POST',   '/tasks',         tasks.createTask);
router.add('PUT',    '/tasks/reorder', tasks.reorderTasks); // before :id
router.add('GET',    '/tasks/:id',     tasks.getTask);
router.add('PUT',    '/tasks/:id',     tasks.updateTask);
router.add('DELETE', '/tasks/:id',     tasks.deleteTask);

// ── Goals ─────────────────────────────────────────────────────────────────────
import * as goals from './routes/goals';
router.add('GET',    '/goals',     goals.listGoals);
router.add('POST',   '/goals',     goals.createGoal);
router.add('PUT',    '/goals/:id', goals.updateGoal);
router.add('DELETE', '/goals/:id', goals.deleteGoal);

// ── Shopping ──────────────────────────────────────────────────────────────────
import * as shopping from './routes/shopping';
router.add('GET',    '/shopping-items',     shopping.listShoppingItems);
router.add('POST',   '/shopping-items',     shopping.createShoppingItem);
router.add('PUT',    '/shopping-items/:id', shopping.updateShoppingItem);
router.add('DELETE', '/shopping-items/:id', shopping.deleteShoppingItem);

// ── Notes ─────────────────────────────────────────────────────────────────────
import * as notes from './routes/notes';
router.add('GET',    '/notes',     notes.listNotes);
router.add('POST',   '/notes',     notes.createNote);
router.add('PUT',    '/notes/:id', notes.updateNote);
router.add('DELETE', '/notes/:id', notes.deleteNote);

// ── Calendar ──────────────────────────────────────────────────────────────────
import * as calendar from './routes/calendar';
router.add('GET',    '/calendar/connections',     calendar.listConnections);
router.add('POST',   '/calendar/connections',     calendar.createConnection);
router.add('DELETE', '/calendar/connections/:id', calendar.deleteConnection);
router.add('GET',    '/calendar/events',          calendar.listEvents);
router.add('POST',   '/calendar/events',          calendar.createEvent);
router.add('POST',   '/calendar/sync',            calendar.syncCalendar);

// ── Secrets ───────────────────────────────────────────────────────────────────
import * as secrets from './routes/secrets';
router.add('GET',    '/secrets',     secrets.listSecrets);
router.add('POST',   '/secrets',     secrets.createSecret);
router.add('GET',    '/secrets/:id', secrets.getSecret);
router.add('PUT',    '/secrets/:id', secrets.updateSecret);
router.add('DELETE', '/secrets/:id', secrets.deleteSecret);

// ── AI ────────────────────────────────────────────────────────────────────────
import * as ai from './routes/ai';
router.add('GET',    '/ai/conversations',              ai.listConversations);
router.add('POST',   '/ai/conversations',              ai.createConversation);
router.add('GET',    '/ai/conversations/:id',          ai.getConversation);
router.add('POST',   '/ai/conversations/:id/messages', ai.sendMessage);
router.add('DELETE', '/ai/conversations/:id',          ai.deleteConversation);

// ── Settings ──────────────────────────────────────────────────────────────────
import * as settings from './routes/settings';
router.add('GET', '/settings', settings.getSettings);
router.add('PUT', '/settings', settings.updateSettings);

// ── Contracts ─────────────────────────────────────────────────────────────────
import * as contracts from './routes/contracts';
router.add('GET',    '/contracts',     contracts.listContracts);
router.add('POST',   '/contracts',     contracts.createContract);
router.add('GET',    '/contracts/:id', contracts.getContract);
router.add('PUT',    '/contracts/:id', contracts.updateContract);
router.add('DELETE', '/contracts/:id', contracts.deleteContract);

// ── Timesheets ────────────────────────────────────────────────────────────────
import * as timesheets from './routes/timesheets';
router.add('GET',    '/timesheets/summary', timesheets.timesheetSummary); // before :id
router.add('GET',    '/timesheets',         timesheets.listTimesheets);
router.add('POST',   '/timesheets',         timesheets.createTimesheet);
router.add('PUT',    '/timesheets/:id',     timesheets.updateTimesheet);
router.add('DELETE', '/timesheets/:id',     timesheets.deleteTimesheet);

// ── Invoices ──────────────────────────────────────────────────────────────────
import * as invoices from './routes/invoices';
router.add('POST',   '/invoices/generate',      invoices.generateInvoice);  // before :id
router.add('GET',    '/invoices',               invoices.listInvoices);
router.add('POST',   '/invoices',               invoices.createInvoice);
router.add('GET',    '/invoices/:id',           invoices.getInvoice);
router.add('PUT',    '/invoices/:id',           invoices.updateInvoice);
router.add('DELETE', '/invoices/:id',           invoices.deleteInvoice);
router.add('POST',   '/invoices/:id/send',      invoices.sendInvoice);
router.add('POST',   '/invoices/:id/mark-paid', invoices.markPaidInvoice);

// ── Integrations ──────────────────────────────────────────────────────────────
import * as integrations from './routes/integrations';
router.add('GET',    '/integrations',     integrations.listIntegrations);
router.add('POST',   '/integrations',     integrations.createIntegration);
router.add('PUT',    '/integrations/:id', integrations.updateIntegration);
router.add('DELETE', '/integrations/:id', integrations.deleteIntegration);

// ── Proxy — Azure DevOps ──────────────────────────────────────────────────────
import * as proxy from './routes/proxy';
router.add('GET', '/proxy/azure-devops/projects',              proxy.azureProjects);
router.add('GET', '/proxy/azure-devops/boards/:projectId',     proxy.azureBoards);
router.add('GET', '/proxy/azure-devops/repos/:projectId',      proxy.azureRepos);
router.add('GET', '/proxy/azure-devops/pipelines/:projectId',  proxy.azurePipelines);

// ── Proxy — GitHub ────────────────────────────────────────────────────────────
router.add('GET', '/proxy/github/repos/:owner/:repo',          proxy.githubRepo);
router.add('GET', '/proxy/github/repos/:owner/:repo/branches', proxy.githubBranches);
router.add('GET', '/proxy/github/repos/:owner/:repo/pulls',    proxy.githubPulls);

// ── Proxy — AWS ───────────────────────────────────────────────────────────────
router.add('GET', '/proxy/aws/pipelines',  proxy.awsPipelines);
router.add('GET', '/proxy/aws/cloudfront', proxy.awsCloudFront);

// ── Dashboard ─────────────────────────────────────────────────────────────────
import * as dashboard from './routes/dashboard';
router.add('GET', '/dashboard/overview', dashboard.overview);
