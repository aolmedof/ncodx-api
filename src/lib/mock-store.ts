// ---------------------------------------------------------------------------
// In-memory store — survives Lambda warm invocations, resets on cold start.
// ---------------------------------------------------------------------------

import { randomUUID } from 'crypto';
import {
  DEMO_USER, DEMO_PROJECTS, DEMO_TASKS, DEMO_GOALS,
  DEMO_SHOPPING_ITEMS, DEMO_NOTES, DEMO_SECRETS,
  DEMO_AI_CONVERSATIONS, DEMO_AI_MESSAGES,
  DEMO_CALENDAR_CONNECTIONS, DEMO_CALENDAR_EVENTS,
  DEMO_SETTINGS,
} from './mock-data';

// ── type helpers ─────────────────────────────────────────────────────────────

export type User = typeof DEMO_USER;
export type Project = typeof DEMO_PROJECTS[0];
export type Task = typeof DEMO_TASKS[0];
export type Goal = typeof DEMO_GOALS[0];
export type ShoppingItem = typeof DEMO_SHOPPING_ITEMS[0];
export type Note = typeof DEMO_NOTES[0];
export type Secret = typeof DEMO_SECRETS[0];
export type AiConversation = typeof DEMO_AI_CONVERSATIONS[0];
export type AiMessage = typeof DEMO_AI_MESSAGES[0];
export type CalendarConnection = typeof DEMO_CALENDAR_CONNECTIONS[0];
export type CalendarEvent = typeof DEMO_CALENDAR_EVENTS[0];
export type UserSettings = typeof DEMO_SETTINGS;

// ── generic collection helper ─────────────────────────────────────────────────

class Collection<T extends { id: string }> {
  private items: T[];

  constructor(seed: T[]) {
    // Deep clone so mutations don't affect the seed constants
    this.items = seed.map(i => ({ ...i }));
  }

  all(): T[] { return [...this.items]; }

  find(predicate: (item: T) => boolean): T[] {
    return this.items.filter(predicate);
  }

  findOne(predicate: (item: T) => boolean): T | undefined {
    return this.items.find(predicate);
  }

  byId(id: string): T | undefined {
    return this.items.find(i => i.id === id);
  }

  insert(data: T): T {
    this.items.push(data);
    return data;
  }

  update(id: string, patch: Partial<T>): T | undefined {
    const idx = this.items.findIndex(i => i.id === id);
    if (idx === -1) return undefined;
    this.items[idx] = { ...this.items[idx], ...patch, updatedAt: new Date().toISOString() } as T;
    return this.items[idx];
  }

  remove(id: string): boolean {
    const idx = this.items.findIndex(i => i.id === id);
    if (idx === -1) return false;
    this.items.splice(idx, 1);
    return true;
  }
}

// ── store singleton ───────────────────────────────────────────────────────────

class MockStore {
  users = new Collection<User>([DEMO_USER]);
  projects = new Collection<Project>(DEMO_PROJECTS);
  tasks = new Collection<Task>(DEMO_TASKS);
  goals = new Collection<Goal>(DEMO_GOALS);
  shoppingItems = new Collection<ShoppingItem>(DEMO_SHOPPING_ITEMS);
  notes = new Collection<Note>(DEMO_NOTES);
  secrets = new Collection<Secret>(DEMO_SECRETS);
  conversations = new Collection<AiConversation>(DEMO_AI_CONVERSATIONS);
  aiMessages = new Collection<AiMessage>(DEMO_AI_MESSAGES);
  calendarConnections = new Collection<CalendarConnection>(DEMO_CALENDAR_CONNECTIONS);
  calendarEvents = new Collection<CalendarEvent>(DEMO_CALENDAR_EVENTS);
  settings = new Collection<UserSettings>([DEMO_SETTINGS]);
}

export const store = new MockStore();
export { randomUUID as newId };
