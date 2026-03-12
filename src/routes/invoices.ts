import { store, newId } from '../lib/mock-store';
import { NotFoundError, ForbiddenError, ValidationError } from '../middleware/error';
import { AppContext, RouteHandler } from '../types';

function parseBody(ctx: AppContext) {
  try { return JSON.parse(ctx.event.body ?? '{}'); } catch { return {}; }
}

function withItems(invoice: ReturnType<typeof store.invoices.byId>) {
  if (!invoice) return null;
  const items = store.invoiceItems.find(i => i.invoiceId === invoice.id);
  return { ...invoice, items };
}

export const listInvoices: RouteHandler = async (ctx) => {
  const qs = ctx.event.queryStringParameters ?? {};
  let invoices = store.invoices.find(i => i.userId === ctx.userId);
  if (qs.project_id) invoices = invoices.filter(i => i.projectId === qs.project_id);
  if (qs.status) invoices = invoices.filter(i => i.status === qs.status);
  invoices.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return { statusCode: 200, body: invoices };
};

export const createInvoice: RouteHandler = async (ctx) => {
  const {
    projectId, invoiceNumber, issueDate, dueDate,
    subtotal, taxRate, taxAmount, total, currency,
    status, notes, items,
  } = parseBody(ctx);

  if (!projectId) throw new ValidationError('projectId is required');
  if (!issueDate) throw new ValidationError('issueDate is required');
  if (!dueDate) throw new ValidationError('dueDate is required');
  if (total === undefined) throw new ValidationError('total is required');

  const project = store.projects.byId(projectId);
  if (!project) throw new NotFoundError('Project not found');
  if (project.userId !== ctx.userId) throw new ForbiddenError();

  // Auto-generate invoice number if not provided
  const existingCount = store.invoices.find(i => i.userId === ctx.userId).length;
  const autoNumber = invoiceNumber ?? `INV-${new Date().getFullYear()}-${String(existingCount + 1).padStart(3, '0')}`;

  const now = new Date().toISOString();
  const invoice = store.invoices.insert({
    id: newId(), userId: ctx.userId!, projectId,
    invoiceNumber: autoNumber,
    issueDate, dueDate,
    subtotal: subtotal ?? total,
    taxRate: taxRate ?? 0,
    taxAmount: taxAmount ?? 0,
    total, currency: currency ?? 'USD',
    status: status ?? 'draft',
    notes: notes ?? null,
    pdfUrl: null,
    createdAt: now, updatedAt: now,
  });

  // Create invoice items if provided
  if (Array.isArray(items)) {
    for (const item of items) {
      store.invoiceItems.insert({
        id: newId(), invoiceId: invoice.id,
        description: item.description ?? '',
        quantity: item.quantity ?? 1,
        unitPrice: item.unitPrice ?? 0,
        total: item.total ?? (item.quantity ?? 1) * (item.unitPrice ?? 0),
        createdAt: now,
      });
    }
  }

  return { statusCode: 201, body: withItems(invoice) };
};

export const getInvoice: RouteHandler = async (ctx, params) => {
  const invoice = store.invoices.byId(params.id);
  if (!invoice) throw new NotFoundError('Invoice not found');
  if (invoice.userId !== ctx.userId) throw new ForbiddenError();
  return { statusCode: 200, body: withItems(invoice) };
};

export const updateInvoice: RouteHandler = async (ctx, params) => {
  const invoice = store.invoices.byId(params.id);
  if (!invoice) throw new NotFoundError('Invoice not found');
  if (invoice.userId !== ctx.userId) throw new ForbiddenError();
  const {
    issueDate, dueDate, subtotal, taxRate, taxAmount,
    total, currency, status, notes,
  } = parseBody(ctx);
  const updated = store.invoices.update(params.id, {
    issueDate, dueDate, subtotal, taxRate, taxAmount,
    total, currency, status, notes,
  });
  return { statusCode: 200, body: withItems(updated) };
};

export const deleteInvoice: RouteHandler = async (ctx, params) => {
  const invoice = store.invoices.byId(params.id);
  if (!invoice) throw new NotFoundError('Invoice not found');
  if (invoice.userId !== ctx.userId) throw new ForbiddenError();
  store.invoices.remove(params.id);
  // Remove associated items
  store.invoiceItems.find(i => i.invoiceId === params.id).forEach(i => store.invoiceItems.remove(i.id));
  return { statusCode: 204, body: null };
};

export const sendInvoice: RouteHandler = async (ctx, params) => {
  const invoice = store.invoices.byId(params.id);
  if (!invoice) throw new NotFoundError('Invoice not found');
  if (invoice.userId !== ctx.userId) throw new ForbiddenError();
  const updated = store.invoices.update(params.id, { status: 'sent' });
  return { statusCode: 200, body: { ...updated, message: 'Invoice marked as sent (demo mode)' } };
};

export const markPaidInvoice: RouteHandler = async (ctx, params) => {
  const invoice = store.invoices.byId(params.id);
  if (!invoice) throw new NotFoundError('Invoice not found');
  if (invoice.userId !== ctx.userId) throw new ForbiddenError();
  const updated = store.invoices.update(params.id, { status: 'paid' });
  return { statusCode: 200, body: updated };
};

export const generateInvoice: RouteHandler = async (ctx) => {
  const { projectId, startDate, endDate } = parseBody(ctx);
  if (!projectId) throw new ValidationError('projectId is required');
  if (!startDate || !endDate) throw new ValidationError('startDate and endDate are required');

  const project = store.projects.byId(projectId);
  if (!project) throw new NotFoundError('Project not found');
  if (project.userId !== ctx.userId) throw new ForbiddenError();

  // Gather billable timesheet entries in range
  const entries = store.timesheets.find(
    t => t.userId === ctx.userId &&
      t.projectId === projectId &&
      t.billable &&
      t.date >= startDate &&
      t.date <= endDate,
  );

  if (entries.length === 0) {
    return { statusCode: 400, body: { error: 'No billable timesheet entries found for the given date range' } };
  }

  const totalHours = entries.reduce((sum, t) => sum + t.hours, 0);
  const rate = project.hourlyRate ?? 0;
  const subtotal = parseFloat((totalHours * rate).toFixed(2));
  const taxRate = 0.16;
  const taxAmount = parseFloat((subtotal * taxRate).toFixed(2));
  const total = parseFloat((subtotal + taxAmount).toFixed(2));

  const existingCount = store.invoices.find(i => i.userId === ctx.userId).length;
  const invoiceNumber = `INV-${new Date().getFullYear()}-${String(existingCount + 1).padStart(3, '0')}`;
  const now = new Date().toISOString();
  const issueDate = new Date().toISOString().slice(0, 10);
  const dueDateObj = new Date(Date.now() + 30 * 86400000);
  const dueDate = dueDateObj.toISOString().slice(0, 10);

  const invoice = store.invoices.insert({
    id: newId(), userId: ctx.userId!, projectId,
    invoiceNumber, issueDate, dueDate,
    subtotal, taxRate, taxAmount, total,
    currency: project.currency ?? 'USD',
    status: 'draft', notes: null, pdfUrl: null,
    createdAt: now, updatedAt: now,
  });

  store.invoiceItems.insert({
    id: newId(), invoiceId: invoice.id,
    description: `${project.name} — ${startDate} to ${endDate} (${totalHours} hours × $${rate}/hr)`,
    quantity: totalHours, unitPrice: rate, total: subtotal,
    createdAt: now,
  });

  return { statusCode: 201, body: withItems(invoice) };
};
