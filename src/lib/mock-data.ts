// ---------------------------------------------------------------------------
// Static demo data — all entities for the single demo user.
// Reinitialised on every Lambda cold start (no persistence). OK for demo.
// ---------------------------------------------------------------------------

const NOW = new Date().toISOString();
const future = (days: number) =>
  new Date(Date.now() + days * 86400000).toISOString();

export const DEMO_USER = {
  id: 'demo-user-1',
  email: 'demo@ncodx.com',
  name: 'Demo User' as string | null,
  // Password stored as plain marker — auth.ts handles demo user specially
  password: '__demo__',
  locale: 'es',
  timezone: 'America/Mexico_City',
  createdAt: NOW,
  updatedAt: NOW,
};

export const DEMO_PROJECTS = [
  {
    id: 'proj-1',
    name: 'Website Redesign',
    description: 'Rediseño completo del sitio web corporativo',
    color: '#6366f1',
    userId: 'demo-user-1',
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'proj-2',
    name: 'Mobile App',
    description: 'Aplicación móvil para clientes',
    color: '#f59e0b',
    userId: 'demo-user-1',
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'proj-3',
    name: 'API Integration',
    description: 'Integración con servicios externos',
    color: '#10b981',
    userId: 'demo-user-1',
    createdAt: NOW,
    updatedAt: NOW,
  },
];

export const DEMO_TASKS = [
  {
    id: 'task-1', title: 'Diseñar wireframes', description: null,
    status: 'todo', priority: 'high', position: 0,
    projectId: 'proj-1', userId: 'demo-user-1',
    dueDate: future(5), createdAt: NOW, updatedAt: NOW,
  },
  {
    id: 'task-2', title: 'Setup CI/CD pipeline', description: null,
    status: 'todo', priority: 'medium', position: 1,
    projectId: 'proj-3', userId: 'demo-user-1',
    dueDate: future(10), createdAt: NOW, updatedAt: NOW,
  },
  {
    id: 'task-3', title: 'Implementar autenticación JWT', description: 'Incluir refresh tokens',
    status: 'in_progress', priority: 'high', position: 0,
    projectId: 'proj-3', userId: 'demo-user-1',
    dueDate: future(2), createdAt: NOW, updatedAt: NOW,
  },
  {
    id: 'task-4', title: 'Diseño UI componentes', description: null,
    status: 'in_progress', priority: 'medium', position: 1,
    projectId: 'proj-1', userId: 'demo-user-1',
    dueDate: future(3), createdAt: NOW, updatedAt: NOW,
  },
  {
    id: 'task-5', title: 'Pantalla de login móvil', description: null,
    status: 'in_progress', priority: 'high', position: 2,
    projectId: 'proj-2', userId: 'demo-user-1',
    dueDate: future(4), createdAt: NOW, updatedAt: NOW,
  },
  {
    id: 'task-6', title: 'Code review módulo de pagos', description: null,
    status: 'review', priority: 'high', position: 0,
    projectId: 'proj-2', userId: 'demo-user-1',
    dueDate: future(1), createdAt: NOW, updatedAt: NOW,
  },
  {
    id: 'task-7', title: 'QA testing landing page', description: null,
    status: 'review', priority: 'low', position: 1,
    projectId: 'proj-1', userId: 'demo-user-1',
    dueDate: future(2), createdAt: NOW, updatedAt: NOW,
  },
  {
    id: 'task-8', title: 'Setup repositorio GitHub', description: null,
    status: 'done', priority: 'low', position: 0,
    projectId: 'proj-3', userId: 'demo-user-1',
    dueDate: null, createdAt: NOW, updatedAt: NOW,
  },
  {
    id: 'task-9', title: 'Definición de arquitectura', description: null,
    status: 'done', priority: 'medium', position: 1,
    projectId: 'proj-1', userId: 'demo-user-1',
    dueDate: null, createdAt: NOW, updatedAt: NOW,
  },
  {
    id: 'task-10', title: 'Kickoff meeting', description: null,
    status: 'done', priority: 'low', position: 2,
    projectId: null, userId: 'demo-user-1',
    dueDate: null, createdAt: NOW, updatedAt: NOW,
  },
];

export const DEMO_GOALS = [
  {
    id: 'goal-1',
    title: 'Lanzar versión beta',
    description: 'Completar y lanzar la versión beta del producto antes de Q2',
    status: 'active',
    progress: 45,
    dueDate: future(30),
    userId: 'demo-user-1',
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'goal-2',
    title: '1000 usuarios registrados',
    description: 'Alcanzar 1000 usuarios en el primer trimestre',
    status: 'active',
    progress: 23,
    dueDate: future(60),
    userId: 'demo-user-1',
    createdAt: NOW,
    updatedAt: NOW,
  },
];

export const DEMO_SHOPPING_ITEMS = [
  {
    id: 'shop-1', name: 'Licencia Adobe XD', quantity: 1, unit: null,
    checked: true, category: 'Software',
    userId: 'demo-user-1', createdAt: NOW, updatedAt: NOW,
  },
  {
    id: 'shop-2', name: 'Servidor cloud adicional', quantity: 2, unit: 'instancias',
    checked: true, category: 'Infraestructura',
    userId: 'demo-user-1', createdAt: NOW, updatedAt: NOW,
  },
  {
    id: 'shop-3', name: 'Dominio ncodx.io', quantity: 1, unit: null,
    checked: false, category: 'Infraestructura',
    userId: 'demo-user-1', createdAt: NOW, updatedAt: NOW,
  },
  {
    id: 'shop-4', name: 'Suscripción Figma', quantity: 3, unit: 'asientos',
    checked: false, category: 'Diseño',
    userId: 'demo-user-1', createdAt: NOW, updatedAt: NOW,
  },
];

export const DEMO_NOTES = [
  {
    id: 'note-1', title: 'Reunión de equipo',
    content: 'Discutir el roadmap Q1. Incluir feedback de clientes beta.',
    color: '#fbbf24', posX: 50, posY: 80,
    userId: 'demo-user-1', createdAt: NOW, updatedAt: NOW,
  },
  {
    id: 'note-2', title: 'Ideas API',
    content: 'Agregar rate limiting y caching con Redis. Evaluar GraphQL.',
    color: '#34d399', posX: 320, posY: 120,
    userId: 'demo-user-1', createdAt: NOW, updatedAt: NOW,
  },
  {
    id: 'note-3', title: 'Pendientes diseño',
    content: 'Dark mode, animaciones de carga, responsivo en tablets.',
    color: '#818cf8', posX: 580, posY: 60,
    userId: 'demo-user-1', createdAt: NOW, updatedAt: NOW,
  },
  {
    id: 'note-4', title: 'Contactos clave',
    content: 'Carlos Mendoza - CTO\nLaura García - Design Lead\nRaúl Torres - Backend Lead',
    color: '#fb7185', posX: 180, posY: 320,
    userId: 'demo-user-1', createdAt: NOW, updatedAt: NOW,
  },
  {
    id: 'note-5', title: 'Métricas objetivo',
    content: 'NPS > 50\nTime to first value < 5 min\nChurn < 5%/mes',
    color: '#38bdf8', posX: 450, posY: 280,
    userId: 'demo-user-1', createdAt: NOW, updatedAt: NOW,
  },
];

export const DEMO_SECRETS = [
  {
    id: 'secret-1', name: 'AWS_ACCESS_KEY',
    value: 'AKIAIOSFODNN7EXAMPLE',
    category: 'Cloud',
    userId: 'demo-user-1', createdAt: NOW, updatedAt: NOW,
  },
  {
    id: 'secret-2', name: 'GITHUB_TOKEN',
    value: 'ghp_demo1234567890abcdefghijklmnopqrstuv',
    category: 'VCS',
    userId: 'demo-user-1', createdAt: NOW, updatedAt: NOW,
  },
];

export const DEMO_AI_MESSAGES = [
  {
    id: 'msg-1', role: 'user',
    content: '¿Cuáles son las ventajas de una arquitectura serverless?',
    conversationId: 'conv-1', createdAt: NOW,
  },
  {
    id: 'msg-2', role: 'assistant',
    content: 'Las principales ventajas son: 1) Escalado automático, 2) Pago por uso, 3) Menor overhead operacional, 4) Despliegue más rápido. Para NCODX, Lambda te permite manejar picos de tráfico sin configurar servidores.',
    conversationId: 'conv-1', createdAt: NOW,
  },
  {
    id: 'msg-3', role: 'user',
    content: '¿Y cuáles serían las desventajas?',
    conversationId: 'conv-1', createdAt: NOW,
  },
  {
    id: 'msg-4', role: 'assistant',
    content: 'Las principales desventajas son: 1) Cold starts, 2) Límites de tiempo de ejecución, 3) Debugging más complejo. Sin embargo, para tu carga de trabajo los beneficios superan los inconvenientes.',
    conversationId: 'conv-1', createdAt: NOW,
  },
];

export const DEMO_AI_CONVERSATIONS = [
  {
    id: 'conv-1',
    title: 'Arquitectura serverless',
    userId: 'demo-user-1',
    createdAt: NOW,
    updatedAt: NOW,
  },
];

export const DEMO_CALENDAR_CONNECTIONS = [
  {
    id: 'conn-1', provider: 'google',
    expiresAt: future(30),
    metadata: { email: 'demo@gmail.com' },
    userId: 'demo-user-1', createdAt: NOW, updatedAt: NOW,
  },
  {
    id: 'conn-2', provider: 'outlook',
    expiresAt: future(30),
    metadata: { email: 'demo@outlook.com' },
    userId: 'demo-user-1', createdAt: NOW, updatedAt: NOW,
  },
];

const dayDate = (daysOffset: number, time: string) => {
  const d = new Date(Date.now() + daysOffset * 86400000);
  return `${d.toISOString().slice(0, 10)}T${time}`;
};

export const DEMO_CALENDAR_EVENTS = [
  {
    id: 'event-1', title: 'Sprint Planning Q1', description: null,
    startAt: dayDate(1, '10:00:00'), endAt: dayDate(1, '11:30:00'),
    allDay: false, location: 'Zoom' as string | null, source: 'google' as string | null,
    userId: 'demo-user-1', createdAt: NOW, updatedAt: NOW,
  },
  {
    id: 'event-2', title: 'Demo con inversores',
    description: 'Presentar MVP y métricas de crecimiento',
    startAt: dayDate(3, '16:00:00'), endAt: dayDate(3, '17:00:00'),
    allDay: false, location: 'Oficina CDMX', source: 'google',
    userId: 'demo-user-1', createdAt: NOW, updatedAt: NOW,
  },
  {
    id: 'event-3', title: 'All hands meeting', description: null,
    startAt: dayDate(5, '09:00:00'), endAt: dayDate(5, '10:00:00'),
    allDay: false, location: null, source: 'outlook',
    userId: 'demo-user-1', createdAt: NOW, updatedAt: NOW,
  },
  {
    id: 'event-4', title: 'Revisión de diseño',
    description: 'Review final de UI/UX antes del lanzamiento',
    startAt: dayDate(7, '14:00:00'), endAt: dayDate(7, '15:30:00'),
    allDay: false, location: 'Figma', source: 'outlook',
    userId: 'demo-user-1', createdAt: NOW, updatedAt: NOW,
  },
  {
    id: 'event-5', title: 'Lanzamiento beta', description: '¡Go live!',
    startAt: dayDate(14, '00:00:00'), endAt: dayDate(14, '23:59:00'),
    allDay: true, location: null, source: 'google',
    userId: 'demo-user-1', createdAt: NOW, updatedAt: NOW,
  },
];

export const DEMO_SETTINGS = {
  id: 'settings-1',
  userId: 'demo-user-1',
  locale: 'es',
  timezone: 'America/Mexico_City',
  theme: 'dark',
  metadata: null,
  createdAt: NOW,
  updatedAt: NOW,
};
