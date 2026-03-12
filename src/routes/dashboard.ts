import { store } from '../lib/mock-store';
import { RouteHandler } from '../types';

export const overview: RouteHandler = async (ctx) => {
  const uid = ctx.userId!;

  const projects = store.projects.find(p => p.userId === uid);
  const tasks = store.tasks.find(t => t.userId === uid);
  const timesheets = store.timesheets.find(t => t.userId === uid);
  const invoices = store.invoices.find(i => i.userId === uid);
  const contracts = store.contracts.find(c => c.userId === uid);
  const goals = store.goals.find(g => g.userId === uid);

  // Task stats
  const tasksByStatus = {
    todo: tasks.filter(t => t.status === 'todo').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    review: tasks.filter(t => t.status === 'review').length,
    done: tasks.filter(t => t.status === 'done').length,
  };

  // Hours this month
  const now = new Date();
  const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const hoursThisMonth = timesheets
    .filter(t => t.date.startsWith(monthPrefix) && t.billable)
    .reduce((sum, t) => sum + t.hours, 0);

  // Total billable hours all time
  const totalBillableHours = timesheets
    .filter(t => t.billable)
    .reduce((sum, t) => sum + t.hours, 0);

  // Invoice stats
  const invoiceStats = {
    draft: invoices.filter(i => i.status === 'draft').length,
    sent: invoices.filter(i => i.status === 'sent').length,
    paid: invoices.filter(i => i.status === 'paid').length,
    totalPending: invoices
      .filter(i => i.status === 'sent')
      .reduce((sum, i) => sum + i.total, 0),
    totalPaid: invoices
      .filter(i => i.status === 'paid')
      .reduce((sum, i) => sum + i.total, 0),
  };

  // Active contracts
  const activeContracts = contracts.filter(c => c.status === 'active');

  // Upcoming calendar events (next 7 days)
  const today = new Date().toISOString().slice(0, 10);
  const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);
  const upcomingEvents = store.calendarEvents
    .find(e => e.userId === uid && e.startAt.slice(0, 10) >= today && e.startAt.slice(0, 10) <= nextWeek)
    .sort((a, b) => a.startAt.localeCompare(b.startAt))
    .slice(0, 5);

  // Recent tasks (in_progress + review)
  const activeTasks = tasks
    .filter(t => t.status === 'in_progress' || t.status === 'review')
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 5);

  return {
    statusCode: 200,
    body: {
      projects: {
        total: projects.length,
        active: projects.filter(p => p.status === 'active').length,
      },
      tasks: {
        total: tasks.length,
        byStatus: tasksByStatus,
      },
      time: {
        hoursThisMonth: parseFloat(hoursThisMonth.toFixed(1)),
        totalBillableHours: parseFloat(totalBillableHours.toFixed(1)),
        totalEntries: timesheets.length,
      },
      invoices: invoiceStats,
      contracts: {
        total: contracts.length,
        active: activeContracts.length,
      },
      goals: {
        total: goals.length,
        avgProgress: goals.length
          ? Math.round(goals.reduce((s, g) => s + g.progress, 0) / goals.length)
          : 0,
      },
      upcomingEvents,
      activeTasks,
    },
  };
};
