import bcrypt from 'bcryptjs';
import { store } from '../lib/mock-store';
import { signToken } from '../lib/jwt';
import { ValidationError, ForbiddenError, NotFoundError } from '../middleware/error';
import { AppContext, RouteHandler } from '../types';

function parseBody(ctx: AppContext) {
  try { return JSON.parse(ctx.event.body ?? '{}'); } catch { return {}; }
}

function safeUser(user: ReturnType<typeof store.users.byId>) {
  if (!user) return null;
  const { passwordHash: _pw, ...safe } = user;
  return safe;
}

export const login: RouteHandler = async (ctx) => {
  const { email, password } = parseBody(ctx);
  if (!email || !password) throw new ValidationError('email and password are required');

  const user = store.users.findOne(u => u.email === email);
  if (!user) throw new ValidationError('Invalid credentials');

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new ValidationError('Invalid credentials');

  store.users.update(user.id, { lastLogin: new Date().toISOString() });

  const token = await signToken({ sub: user.id, email: user.email });
  return { statusCode: 200, body: { token, user: safeUser(user) } };
};

export const register: RouteHandler = async (_ctx) => {
  // Registration disabled — only 4 predefined users can authenticate
  throw new ForbiddenError('Registration is currently disabled. Contact admin.');
};

export const me: RouteHandler = async (ctx) => {
  const user = store.users.byId(ctx.userId!);
  if (!user) throw new NotFoundError('User not found');
  return { statusCode: 200, body: safeUser(user) };
};

export const updateMe: RouteHandler = async (ctx) => {
  const user = store.users.byId(ctx.userId!);
  if (!user) throw new NotFoundError('User not found');

  const {
    fullName, name, company, taxId, address, city, state, country,
    zipCode, phone, avatarUrl, bankName, bankAccount, bankRouting,
    paymentMethod, paypalEmail, locale, timezone,
  } = parseBody(ctx);

  const patch: Partial<typeof user> = {};
  if (fullName !== undefined) patch.fullName = fullName;
  if (name !== undefined) patch.name = name;
  if (company !== undefined) patch.company = company;
  if (taxId !== undefined) patch.taxId = taxId;
  if (address !== undefined) patch.address = address;
  if (city !== undefined) patch.city = city;
  if (state !== undefined) patch.state = state;
  if (country !== undefined) patch.country = country;
  if (zipCode !== undefined) patch.zipCode = zipCode;
  if (phone !== undefined) patch.phone = phone;
  if (avatarUrl !== undefined) patch.avatarUrl = avatarUrl;
  if (bankName !== undefined) patch.bankName = bankName;
  if (bankAccount !== undefined) patch.bankAccount = bankAccount;
  if (bankRouting !== undefined) patch.bankRouting = bankRouting;
  if (paymentMethod !== undefined) patch.paymentMethod = paymentMethod;
  if (paypalEmail !== undefined) patch.paypalEmail = paypalEmail;
  if (locale !== undefined) patch.locale = locale;
  if (timezone !== undefined) patch.timezone = timezone;

  const updated = store.users.update(ctx.userId!, patch);
  return { statusCode: 200, body: safeUser(updated) };
};

export const uploadAvatar: RouteHandler = async (ctx) => {
  const user = store.users.byId(ctx.userId!);
  if (!user) throw new NotFoundError('User not found');

  const { image } = parseBody(ctx);
  if (!image) throw new ValidationError('image (base64) is required');

  // In production: upload to S3 and return real URL
  // In demo: return a fake URL
  const avatarUrl = `/avatars/${ctx.userId}.jpg`;
  store.users.update(ctx.userId!, { avatarUrl });

  return { statusCode: 200, body: { avatarUrl, message: 'Avatar updated (demo mode)' } };
};
