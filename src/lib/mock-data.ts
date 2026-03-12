// ---------------------------------------------------------------------------
// Static demo data — 4 real users + rich demo data for user-arturo.
// Passwords pre-hashed with bcrypt (salt 12) at module init.
// Reinitialised on every Lambda cold start (no persistence). OK for demo.
// ---------------------------------------------------------------------------

import bcrypt from 'bcryptjs';

// Pre-hash passwords once at cold start (sync is fine here — module init)
const PWD_HASH = bcrypt.hashSync('Abc#123', 12);

const NOW = new Date().toISOString();
const past = (days: number) => new Date(Date.now() - days * 86400000).toISOString();
const future = (days: number) => new Date(Date.now() + days * 86400000).toISOString();
const pastDate = (days: number) => new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
const futureDate = (days: number) => new Date(Date.now() + days * 86400000).toISOString().slice(0, 10);

// ── Users ─────────────────────────────────────────────────────────────────

export const DEMO_USERS = [
  {
    id: 'user-arturo',
    email: 'arturo.olmedof@hotmail.com',
    passwordHash: PWD_HASH,
    name: 'Arturo Olmedo Flores',
    fullName: 'Arturo Olmedo Flores',
    company: 'NCODX Consulting',
    taxId: null as string | null,
    address: null as string | null,
    city: null as string | null,
    state: null as string | null,
    country: 'Mexico',
    zipCode: null as string | null,
    phone: null as string | null,
    avatarUrl: null as string | null,
    bankName: null as string | null,
    bankAccount: null as string | null,
    bankRouting: null as string | null,
    paymentMethod: 'bank_transfer',
    paypalEmail: null as string | null,
    role: 'admin',
    isActive: true,
    lastLogin: null as string | null,
    locale: 'es',
    timezone: 'America/Mexico_City',
    createdAt: past(90),
    updatedAt: NOW,
  },
  {
    id: 'user-gerardo',
    email: 'g.olmedof@gmail.com',
    passwordHash: PWD_HASH,
    name: 'Gerardo Olmedo Flores',
    fullName: 'Gerardo Olmedo Flores',
    company: null as string | null,
    taxId: null as string | null,
    address: null as string | null,
    city: null as string | null,
    state: null as string | null,
    country: null as string | null,
    zipCode: null as string | null,
    phone: null as string | null,
    avatarUrl: null as string | null,
    bankName: null as string | null,
    bankAccount: null as string | null,
    bankRouting: null as string | null,
    paymentMethod: 'bank_transfer',
    paypalEmail: null as string | null,
    role: 'user',
    isActive: true,
    lastLogin: null as string | null,
    locale: 'es',
    timezone: 'America/Mexico_City',
    createdAt: past(60),
    updatedAt: NOW,
  },
  {
    id: 'user-david',
    email: 'olmedoflores@gmail.com',
    passwordHash: PWD_HASH,
    name: 'David Olmedo Flores',
    fullName: 'David Olmedo Flores',
    company: null as string | null,
    taxId: null as string | null,
    address: null as string | null,
    city: null as string | null,
    state: null as string | null,
    country: null as string | null,
    zipCode: null as string | null,
    phone: null as string | null,
    avatarUrl: null as string | null,
    bankName: null as string | null,
    bankAccount: null as string | null,
    bankRouting: null as string | null,
    paymentMethod: 'bank_transfer',
    paypalEmail: null as string | null,
    role: 'user',
    isActive: true,
    lastLogin: null as string | null,
    locale: 'es',
    timezone: 'America/Mexico_City',
    createdAt: past(45),
    updatedAt: NOW,
  },
  {
    id: 'user-anastasia',
    email: 'anastasia888a@gmail.com',
    passwordHash: PWD_HASH,
    name: 'Anastasiia Lozinska',
    fullName: 'Anastasiia Lozinska',
    company: null as string | null,
    taxId: null as string | null,
    address: null as string | null,
    city: null as string | null,
    state: null as string | null,
    country: null as string | null,
    zipCode: null as string | null,
    phone: null as string | null,
    avatarUrl: null as string | null,
    bankName: null as string | null,
    bankAccount: null as string | null,
    bankRouting: null as string | null,
    paymentMethod: 'bank_transfer',
    paypalEmail: null as string | null,
    role: 'user',
    isActive: true,
    lastLogin: null as string | null,
    locale: 'en',
    timezone: 'Europe/Kiev',
    createdAt: past(30),
    updatedAt: NOW,
  },
];

// ── Projects ──────────────────────────────────────────────────────────────

export const DEMO_PROJECTS = [
  {
    id: 'proj-1',
    userId: 'user-arturo',
    name: 'Portal Bancario Santander',
    description: 'Rediseño y modernización del portal de banca en línea para clientes empresariales.',
    color: '#6366f1',
    icon: '🏦',
    status: 'active',
    clientName: 'Banco Santander México',
    clientEmail: 'digital@santander.com.mx',
    hourlyRate: 85.0,
    monthlyRate: null as number | null,
    currency: 'USD',
    startDate: past(120),
    endDate: future(60),
    azureDevopsOrg: 'santander-digital',
    azureDevopsProject: 'portal-banca',
    githubRepo: 'santander-digital/portal-banca',
    awsAccountId: '123456789012',
    awsRegion: 'us-east-1',
    jumpserverUsername: 'aolmedo',
    createdAt: past(120),
    updatedAt: past(2),
  },
  {
    id: 'proj-2',
    userId: 'user-arturo',
    name: 'OXXO Pay Mobile',
    description: 'Aplicación móvil de pagos y transferencias para red OXXO.',
    color: '#f59e0b',
    icon: '📱',
    status: 'active',
    clientName: 'FEMSA Digital',
    clientEmail: 'tech@femsa.com',
    hourlyRate: null as number | null,
    monthlyRate: 8500.0,
    currency: 'USD',
    startDate: past(60),
    endDate: future(120),
    azureDevopsOrg: 'femsa-tech',
    azureDevopsProject: 'oxxo-pay',
    githubRepo: 'femsa-tech/oxxo-pay-mobile',
    awsAccountId: '987654321098',
    awsRegion: 'us-east-1',
    jumpserverUsername: 'arturo.olmedo',
    createdAt: past(60),
    updatedAt: past(1),
  },
  {
    id: 'proj-3',
    userId: 'user-arturo',
    name: 'NCODX Platform',
    description: 'Plataforma interna de gestión de proyectos y facturación.',
    color: '#10b981',
    icon: '🚀',
    status: 'active',
    clientName: 'NCODX Consulting',
    clientEmail: 'arturo.olmedof@hotmail.com',
    hourlyRate: 0.0,
    monthlyRate: null as number | null,
    currency: 'USD',
    startDate: past(90),
    endDate: null as string | null,
    azureDevopsOrg: null as string | null,
    azureDevopsProject: null as string | null,
    githubRepo: 'aolmedof/ncodx-api',
    awsAccountId: '111222333444',
    awsRegion: 'eu-west-3',
    jumpserverUsername: null as string | null,
    createdAt: past(90),
    updatedAt: NOW,
  },
];

// ── Tasks ─────────────────────────────────────────────────────────────────

export const DEMO_TASKS = [
  {
    id: 'task-1', userId: 'user-arturo', projectId: 'proj-1',
    title: 'Implementar módulo de notificaciones push',
    description: 'Integrar Firebase Cloud Messaging para alertas de transacciones.',
    status: 'todo', priority: 'high', position: 0,
    dueDate: future(7), createdAt: past(5), updatedAt: past(5),
  },
  {
    id: 'task-2', userId: 'user-arturo', projectId: 'proj-2',
    title: 'Pantalla de historial de pagos',
    description: null as string | null,
    status: 'todo', priority: 'medium', position: 1,
    dueDate: future(10), createdAt: past(4), updatedAt: past(4),
  },
  {
    id: 'task-3', userId: 'user-arturo', projectId: 'proj-3',
    title: 'Configurar CI/CD en CodeBuild',
    description: 'Pipeline completo: lint → typecheck → build → deploy Lambda.',
    status: 'todo', priority: 'high', position: 2,
    dueDate: future(3), createdAt: past(3), updatedAt: past(3),
  },
  {
    id: 'task-4', userId: 'user-arturo', projectId: 'proj-1',
    title: 'Migración a React 18 + Vite',
    description: 'Actualizar build toolchain y resolver breaking changes.',
    status: 'in_progress', priority: 'high', position: 0,
    dueDate: future(2), createdAt: past(10), updatedAt: past(1),
  },
  {
    id: 'task-5', userId: 'user-arturo', projectId: 'proj-2',
    title: 'Integración biometría iOS/Android',
    description: 'Face ID, Touch ID y fingerprint para autenticación.',
    status: 'in_progress', priority: 'high', position: 1,
    dueDate: future(5), createdAt: past(8), updatedAt: past(2),
  },
  {
    id: 'task-6', userId: 'user-arturo', projectId: 'proj-3',
    title: 'Endpoints de contratos y facturación',
    description: 'REST API completa con MockStore.',
    status: 'in_progress', priority: 'medium', position: 2,
    dueDate: future(1), createdAt: past(6), updatedAt: NOW,
  },
  {
    id: 'task-7', userId: 'user-arturo', projectId: null as string | null,
    title: 'Renovar certificado SSL wildcard',
    description: null as string | null,
    status: 'in_progress', priority: 'critical',
    position: 3, dueDate: future(1), createdAt: past(2), updatedAt: past(1),
  },
  {
    id: 'task-8', userId: 'user-arturo', projectId: 'proj-1',
    title: 'Code review componentes de onboarding',
    description: 'Verificar accesibilidad WCAG 2.1 nivel AA.',
    status: 'review', priority: 'medium', position: 0,
    dueDate: future(2), createdAt: past(7), updatedAt: past(1),
  },
  {
    id: 'task-9', userId: 'user-arturo', projectId: 'proj-2',
    title: 'QA testing flujo de pagos',
    description: 'Smoke tests + regression en staging.',
    status: 'review', priority: 'high', position: 1,
    dueDate: future(2), createdAt: past(5), updatedAt: past(1),
  },
  {
    id: 'task-10', userId: 'user-arturo', projectId: 'proj-1',
    title: 'Setup repositorio Azure DevOps',
    description: null as string | null,
    status: 'done', priority: 'medium', position: 0,
    dueDate: null as string | null, createdAt: past(30), updatedAt: past(25),
  },
  {
    id: 'task-11', userId: 'user-arturo', projectId: 'proj-2',
    title: 'Kickoff meeting FEMSA',
    description: null as string | null,
    status: 'done', priority: 'low', position: 1,
    dueDate: null as string | null, createdAt: past(62), updatedAt: past(60),
  },
  {
    id: 'task-12', userId: 'user-arturo', projectId: 'proj-3',
    title: 'Definición arquitectura serverless',
    description: 'API Gateway + Lambda + SSM Parameter Store.',
    status: 'done', priority: 'high', position: 2,
    dueDate: null as string | null, createdAt: past(92), updatedAt: past(88),
  },
];

// ── Goals ─────────────────────────────────────────────────────────────────

export const DEMO_GOALS = [
  {
    id: 'goal-1', userId: 'user-arturo',
    title: 'Facturar $25,000 USD en Q1',
    description: 'Alcanzar el objetivo de facturación del primer trimestre entre Santander y FEMSA.',
    progress: 68,
    targetDate: futureDate(45),
    createdAt: past(85), updatedAt: past(2),
  },
  {
    id: 'goal-2', userId: 'user-arturo',
    title: 'Lanzar NCODX Platform v1.0',
    description: 'Completar todos los módulos: tareas, contratos, timesheets, facturación.',
    progress: 45,
    targetDate: futureDate(30),
    createdAt: past(60), updatedAt: past(1),
  },
  {
    id: 'goal-3', userId: 'user-arturo',
    title: 'Certificación AWS Solutions Architect',
    description: 'Aprobar el examen SAA-C03 antes de fin de trimestre.',
    progress: 30,
    targetDate: futureDate(60),
    createdAt: past(30), updatedAt: past(5),
  },
];

// ── Shopping Items ────────────────────────────────────────────────────────

export const DEMO_SHOPPING_ITEMS = [
  {
    id: 'shop-1', userId: 'user-arturo',
    name: 'Licencia JetBrains All Products', quantity: 1,
    unit: null as string | null, checked: false, category: 'Software',
    createdAt: past(10), updatedAt: past(10),
  },
  {
    id: 'shop-2', userId: 'user-arturo',
    name: 'Monitor 4K LG 27"', quantity: 1,
    unit: null as string | null, checked: false, category: 'Hardware',
    createdAt: past(8), updatedAt: past(8),
  },
  {
    id: 'shop-3', userId: 'user-arturo',
    name: 'Dominio ncodx.io', quantity: 1,
    unit: null as string | null, checked: true, category: 'Infraestructura',
    createdAt: past(20), updatedAt: past(15),
  },
  {
    id: 'shop-4', userId: 'user-arturo',
    name: 'Figma Professional', quantity: 2,
    unit: 'asientos', checked: true, category: 'Diseño',
    createdAt: past(25), updatedAt: past(20),
  },
  {
    id: 'shop-5', userId: 'user-arturo',
    name: 'AWS Reserved Instance t3.medium', quantity: 2,
    unit: 'instancias', checked: false, category: 'Cloud',
    createdAt: past(5), updatedAt: past(5),
  },
];

// ── Notes ─────────────────────────────────────────────────────────────────

export const DEMO_NOTES = [
  {
    id: 'note-1', userId: 'user-arturo',
    title: 'Reunión Santander — Próximos hitos',
    content: 'Sprint 12: Notificaciones push\nSprint 13: Módulo de inversiones\nEntrega final: 15 mayo',
    color: '#fbbf24', pinned: true, posX: 50, posY: 80,
    createdAt: past(3), updatedAt: past(1),
  },
  {
    id: 'note-2', userId: 'user-arturo',
    title: 'Ideas arquitectura NCODX v2',
    content: 'Migrar a tRPC para type safety end-to-end.\nAgregar Redis para sessions y caché.\nEvaluar Bun runtime en Lambda.',
    color: '#34d399', pinned: false, posX: 320, posY: 120,
    createdAt: past(7), updatedAt: past(3),
  },
  {
    id: 'note-3', userId: 'user-arturo',
    title: 'Tarifas 2025',
    content: 'Santander: $85/hr USD\nFEMSA: $8,500/mo USD\nRate nuevo cliente: $95/hr',
    color: '#818cf8', pinned: true, posX: 580, posY: 60,
    createdAt: past(15), updatedAt: past(10),
  },
  {
    id: 'note-4', userId: 'user-arturo',
    title: 'Credenciales staging',
    content: 'Portal Santander staging:\nURL: https://portal-dev.santander.com.mx\nUser: qa_arturo',
    color: '#fb7185', pinned: false, posX: 180, posY: 320,
    createdAt: past(20), updatedAt: past(20),
  },
  {
    id: 'note-5', userId: 'user-arturo',
    title: 'KPIs Q1 2025',
    content: 'Horas facturadas: 340/400 objetivo\nNPS clientes: 72\nBugs críticos en prod: 0',
    color: '#38bdf8', pinned: false, posX: 450, posY: 280,
    createdAt: past(12), updatedAt: past(4),
  },
  {
    id: 'note-6', userId: 'user-arturo',
    title: 'Checklist deploy producción',
    content: '✅ Run tests\n✅ Review bundle size\n⬜ Update changelog\n⬜ Notify Slack #deploys',
    color: '#f97316', pinned: false, posX: 700, posY: 150,
    createdAt: past(6), updatedAt: past(2),
  },
];

// ── Secrets ───────────────────────────────────────────────────────────────

export const DEMO_SECRETS = [
  {
    id: 'secret-1', userId: 'user-arturo',
    name: 'AWS_ACCESS_KEY_ID',
    value: 'AKIAIOSFODNN7EXAMPLE',
    category: 'Cloud',
    createdAt: past(90), updatedAt: past(90),
  },
  {
    id: 'secret-2', userId: 'user-arturo',
    name: 'GITHUB_TOKEN',
    value: 'ghp_demo1234567890abcdefghijklmnopqrstuv',
    category: 'VCS',
    createdAt: past(60), updatedAt: past(30),
  },
  {
    id: 'secret-3', userId: 'user-arturo',
    name: 'AZURE_DEVOPS_PAT',
    value: 'azp_demo_pat_9876543210fedcbazyxwvutsrqponmlkjihgfedcba',
    category: 'DevOps',
    createdAt: past(45), updatedAt: past(10),
  },
];

// ── AI Conversations & Messages ───────────────────────────────────────────

export const DEMO_AI_CONVERSATIONS = [
  {
    id: 'conv-1', userId: 'user-arturo',
    title: 'Arquitectura serverless vs containers',
    createdAt: past(20), updatedAt: past(15),
  },
  {
    id: 'conv-2', userId: 'user-arturo',
    title: 'Estrategia de precios para freelance',
    createdAt: past(10), updatedAt: past(8),
  },
];

export const DEMO_AI_MESSAGES = [
  {
    id: 'msg-1', conversationId: 'conv-1', role: 'user',
    content: '¿Cuáles son las ventajas de una arquitectura serverless sobre containers para una API REST con tráfico variable?',
    createdAt: past(20),
  },
  {
    id: 'msg-2', conversationId: 'conv-1', role: 'assistant',
    content: 'Para una API REST con tráfico variable, serverless tiene ventajas: **1) Escalado automático** sin configuración. **2) Costo proporcional al uso**. **3) Menor overhead operacional**. La principal desventaja son los cold starts (~200-500ms), mitigable con provisioned concurrency.',
    createdAt: past(20),
  },
  {
    id: 'msg-3', conversationId: 'conv-1', role: 'user',
    content: '¿Cómo manejo el estado en una arquitectura serverless?',
    createdAt: past(19),
  },
  {
    id: 'msg-4', conversationId: 'conv-1', role: 'assistant',
    content: 'El estado en serverless se externaliza completamente: **Base de datos** para estado persistente, **Caché Redis** para sesiones, **S3** para archivos. El hecho de que Lambda sea stateless es una ventaja para el escalado horizontal.',
    createdAt: past(19),
  },
  {
    id: 'msg-5', conversationId: 'conv-2', role: 'user',
    content: 'Cobro $85/hr a Santander y $8,500/mes fijo a FEMSA. ¿Cómo debería estructurar mis tarifas para nuevos clientes?',
    createdAt: past(10),
  },
  {
    id: 'msg-6', conversationId: 'conv-2', role: 'assistant',
    content: 'Tu estructura actual es sólida. Para nuevos clientes: **Tarifa horaria**: $95-105/hr. **Tarifa mensual**: $9,000-10,000/mo con mínimo 80hrs. **Precio por proyecto**: horas estimadas × 1.3 para absorber scope creep.',
    createdAt: past(10),
  },
];

// ── Calendar Connections & Events ─────────────────────────────────────────

export const DEMO_CALENDAR_CONNECTIONS = [
  {
    id: 'conn-1', userId: 'user-arturo',
    provider: 'google',
    expiresAt: future(30),
    metadata: { email: 'arturo.olmedof@hotmail.com' } as Record<string, unknown> | null,
    createdAt: past(60), updatedAt: past(5),
  },
  {
    id: 'conn-2', userId: 'user-arturo',
    provider: 'outlook',
    expiresAt: future(60),
    metadata: { email: 'arturo@ncodx.com' } as Record<string, unknown> | null,
    createdAt: past(30), updatedAt: past(2),
  },
];

const dayDate = (daysOffset: number, time: string) => {
  const d = new Date(Date.now() + daysOffset * 86400000);
  return `${d.toISOString().slice(0, 10)}T${time}`;
};

export const DEMO_CALENDAR_EVENTS = [
  {
    id: 'event-1', userId: 'user-arturo',
    title: 'Sprint Planning — Portal Santander',
    description: 'Sprint 12 planning: notificaciones push y módulo inversiones.',
    startAt: dayDate(1, '10:00:00'), endAt: dayDate(1, '11:30:00'),
    allDay: false, location: 'Zoom', source: 'google' as string | null,
    createdAt: past(3), updatedAt: past(3),
  },
  {
    id: 'event-2', userId: 'user-arturo',
    title: 'Daily Standup FEMSA',
    description: null as string | null,
    startAt: dayDate(0, '09:30:00'), endAt: dayDate(0, '09:45:00'),
    allDay: false, location: 'Teams', source: 'outlook' as string | null,
    createdAt: past(60), updatedAt: past(1),
  },
  {
    id: 'event-3', userId: 'user-arturo',
    title: 'Entrega factura Santander — Enero',
    description: 'Enviar invoice #INV-2025-001.',
    startAt: dayDate(2, '14:00:00'), endAt: dayDate(2, '14:30:00'),
    allDay: false, location: null as string | null, source: 'google' as string | null,
    createdAt: past(5), updatedAt: past(5),
  },
  {
    id: 'event-4', userId: 'user-arturo',
    title: 'Revisión trimestral FEMSA',
    description: 'Review de métricas Q1, roadmap Q2 y renovación contrato.',
    startAt: dayDate(5, '16:00:00'), endAt: dayDate(5, '17:30:00'),
    allDay: false, location: 'Oficina FEMSA CDMX', source: 'outlook' as string | null,
    createdAt: past(10), updatedAt: past(10),
  },
  {
    id: 'event-5', userId: 'user-arturo',
    title: 'Vacaciones',
    description: null as string | null,
    startAt: dayDate(20, '00:00:00'), endAt: dayDate(24, '23:59:00'),
    allDay: true, location: null as string | null, source: 'google' as string | null,
    createdAt: past(15), updatedAt: past(15),
  },
  {
    id: 'event-6', userId: 'user-arturo',
    title: 'AWS re:Invent 2025 — Keynote',
    description: 'Ver keynote en vivo y tomar notas.',
    startAt: dayDate(30, '11:00:00'), endAt: dayDate(30, '13:00:00'),
    allDay: false, location: 'Online', source: 'google' as string | null,
    createdAt: past(20), updatedAt: past(20),
  },
  {
    id: 'event-7', userId: 'user-arturo',
    title: 'Examen AWS SAA-C03',
    description: 'Pearson Vue — Centro de pruebas Polanco.',
    startAt: dayDate(45, '08:00:00'), endAt: dayDate(45, '11:00:00'),
    allDay: false, location: 'Centro Pearson Vue, Polanco CDMX', source: 'google' as string | null,
    createdAt: past(25), updatedAt: past(25),
  },
  {
    id: 'event-8', userId: 'user-arturo',
    title: 'Llamada con nuevo cliente potencial',
    description: 'Discovery call — empresa fintech startup serie A.',
    startAt: dayDate(3, '17:00:00'), endAt: dayDate(3, '18:00:00'),
    allDay: false, location: 'Zoom', source: 'google' as string | null,
    createdAt: past(1), updatedAt: past(1),
  },
];

// ── Settings ──────────────────────────────────────────────────────────────

export const DEMO_SETTINGS = {
  id: 'settings-arturo',
  userId: 'user-arturo',
  locale: 'es',
  timezone: 'America/Mexico_City',
  theme: 'dark',
  metadata: null as Record<string, unknown> | null,
  createdAt: past(90),
  updatedAt: NOW,
};

// ── Contracts ─────────────────────────────────────────────────────────────

export const DEMO_CONTRACTS = [
  {
    id: 'contract-1', userId: 'user-arturo', projectId: 'proj-1',
    title: 'Contrato Desarrollo Portal Bancario — 2025',
    type: 'hourly',
    rate: 85.0,
    currency: 'USD',
    startDate: past(120),
    endDate: future(60),
    status: 'active',
    documentUrl: null as string | null,
    notes: 'Facturación mensual los primeros 5 días hábiles. Mínimo 80 horas/mes.',
    createdAt: past(120), updatedAt: past(10),
  },
  {
    id: 'contract-2', userId: 'user-arturo', projectId: 'proj-2',
    title: 'Contrato Mensual OXXO Pay — 2025',
    type: 'monthly',
    rate: 8500.0,
    currency: 'USD',
    startDate: past(60),
    endDate: future(120),
    status: 'active',
    documentUrl: null as string | null,
    notes: 'Retainer mensual. Incluye hasta 100 horas. Horas adicionales a $85/hr.',
    createdAt: past(60), updatedAt: past(5),
  },
  {
    id: 'contract-3', userId: 'user-arturo', projectId: 'proj-1',
    title: 'Contrato Discovery Phase — Santander 2024',
    type: 'fixed',
    rate: 12000.0,
    currency: 'USD',
    startDate: past(180),
    endDate: past(121),
    status: 'completed',
    documentUrl: null as string | null,
    notes: 'Fase de descubrimiento y definición arquitectural completada.',
    createdAt: past(185), updatedAt: past(120),
  },
];

// ── Timesheet Entries ─────────────────────────────────────────────────────

const mkTs = (
  id: string, daysAgo: number, hours: number,
  projectId: string, contractId: string | null,
  desc: string, billable = true,
) => ({
  id,
  userId: 'user-arturo', projectId, contractId,
  date: pastDate(daysAgo),
  hours, description: desc,
  billable, approved: daysAgo > 7,
  approvedBy: daysAgo > 7 ? 'user-arturo' : null as string | null,
  approvedAt: daysAgo > 7 ? past(daysAgo - 2) : null as string | null,
  createdAt: past(daysAgo), updatedAt: past(daysAgo),
});

export const DEMO_TIMESHEETS = [
  mkTs('ts-01', 1,  8, 'proj-1', 'contract-1', 'Desarrollo componentes tabla de transacciones'),
  mkTs('ts-02', 2,  6, 'proj-2', 'contract-2', 'Integración SDK biometría iOS'),
  mkTs('ts-03', 2,  2, 'proj-3', null, 'Setup endpoints contracts API', false),
  mkTs('ts-04', 3,  8, 'proj-1', 'contract-1', 'Implementación filtros y paginación'),
  mkTs('ts-05', 4,  7, 'proj-2', 'contract-2', 'Pantalla onboarding usuario nuevo'),
  mkTs('ts-06', 5,  8, 'proj-1', 'contract-1', 'Code review y corrección bugs críticos'),
  mkTs('ts-07', 6,  4, 'proj-2', 'contract-2', 'Testing automatizado flujo de pagos'),
  mkTs('ts-08', 6,  4, 'proj-3', null, 'Documentación API OpenAPI spec', false),
  mkTs('ts-09', 7,  8, 'proj-1', 'contract-1', 'Sprint review y retrospectiva'),
  mkTs('ts-10', 8,  8, 'proj-2', 'contract-2', 'Integración pasarela de pagos Conekta'),
  mkTs('ts-11', 9,  6, 'proj-1', 'contract-1', 'Módulo de cuentas y saldos'),
  mkTs('ts-12', 10, 8, 'proj-1', 'contract-1', 'Performance optimization lazy loading'),
  mkTs('ts-13', 11, 7, 'proj-2', 'contract-2', 'Notificaciones push Android FCM'),
  mkTs('ts-14', 12, 8, 'proj-1', 'contract-1', 'Diseño sistema de permisos y roles'),
  mkTs('ts-15', 13, 5, 'proj-2', 'contract-2', 'Reunion planificacion Q2 roadmap'),
  mkTs('ts-16', 14, 8, 'proj-1', 'contract-1', 'Implementación módulo transferencias'),
  mkTs('ts-17', 15, 8, 'proj-2', 'contract-2', 'Deep link handling y universal links'),
  mkTs('ts-18', 16, 6, 'proj-1', 'contract-1', 'Security audit y pen testing básico'),
  mkTs('ts-19', 17, 8, 'proj-2', 'contract-2', 'Animaciones y micro-interacciones UI'),
  mkTs('ts-20', 18, 4, 'proj-3', null, 'Configuración AWS Lambda + API Gateway', false),
];

// ── Invoice Items ─────────────────────────────────────────────────────────

export const DEMO_INVOICE_ITEMS = [
  {
    id: 'invitem-1', invoiceId: 'invoice-1',
    description: 'Desarrollo Portal Bancario — Febrero 2025 (88 horas × $85/hr)',
    quantity: 88, unitPrice: 85.0, total: 7480.0,
    createdAt: past(15),
  },
  {
    id: 'invitem-2', invoiceId: 'invoice-1',
    description: 'Gastos de infraestructura cloud (reembolsable)',
    quantity: 1, unitPrice: 320.0, total: 320.0,
    createdAt: past(15),
  },
  {
    id: 'invitem-3', invoiceId: 'invoice-2',
    description: 'Retainer mensual OXXO Pay — Febrero 2025',
    quantity: 1, unitPrice: 8500.0, total: 8500.0,
    createdAt: past(14),
  },
  {
    id: 'invitem-4', invoiceId: 'invoice-2',
    description: 'Horas adicionales (12 horas × $85/hr)',
    quantity: 12, unitPrice: 85.0, total: 1020.0,
    createdAt: past(14),
  },
];

// ── Invoices ──────────────────────────────────────────────────────────────

export const DEMO_INVOICES = [
  {
    id: 'invoice-1', userId: 'user-arturo', projectId: 'proj-1',
    invoiceNumber: 'INV-2025-001',
    issueDate: pastDate(15),
    dueDate: futureDate(15),
    subtotal: 7800.0,
    taxRate: 0.16,
    taxAmount: 1248.0,
    total: 9048.0,
    currency: 'USD',
    status: 'sent',
    notes: 'Pago por transferencia bancaria. Incluir número de factura en la referencia.' as string | null,
    pdfUrl: null as string | null,
    createdAt: past(15), updatedAt: past(14),
  },
  {
    id: 'invoice-2', userId: 'user-arturo', projectId: 'proj-2',
    invoiceNumber: 'INV-2025-002',
    issueDate: pastDate(14),
    dueDate: futureDate(16),
    subtotal: 9520.0,
    taxRate: 0.16,
    taxAmount: 1523.2,
    total: 11043.2,
    currency: 'USD',
    status: 'draft',
    notes: 'Retainer + horas adicionales sprint 8.',
    pdfUrl: null as string | null,
    createdAt: past(14), updatedAt: past(1),
  },
];

// ── Integration Tokens ────────────────────────────────────────────────────

export const DEMO_INTEGRATIONS = [
  {
    id: 'int-1', projectId: 'proj-1',
    provider: 'azure_devops',
    tokenEncrypted: 'demo_encrypted_azp_token_santander',
    refreshTokenEncrypted: null as string | null,
    tokenExpiry: future(90),
    scopes: 'vso.code vso.work vso.build',
    metadataJson: JSON.stringify({ org: 'santander-digital', project: 'portal-banca' }),
    createdAt: past(120), updatedAt: past(10),
  },
  {
    id: 'int-2', projectId: 'proj-2',
    provider: 'azure_devops',
    tokenEncrypted: 'demo_encrypted_azp_token_femsa',
    refreshTokenEncrypted: null as string | null,
    tokenExpiry: future(60),
    scopes: 'vso.code vso.work vso.build',
    metadataJson: JSON.stringify({ org: 'femsa-tech', project: 'oxxo-pay' }),
    createdAt: past(60), updatedAt: past(5),
  },
  {
    id: 'int-3', projectId: 'proj-3',
    provider: 'github',
    tokenEncrypted: 'demo_encrypted_gh_token_ncodx',
    refreshTokenEncrypted: null as string | null,
    tokenExpiry: null as string | null,
    scopes: 'repo read:org',
    metadataJson: JSON.stringify({ owner: 'aolmedof', repo: 'ncodx-api' }),
    createdAt: past(90), updatedAt: past(30),
  },
];
