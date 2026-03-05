# ncodx-api

Serverless backend for ncodx — **API Gateway HTTP API → Lambda (Node.js 20 / TypeScript)**.

Auth: JWT HS256 · DB: PostgreSQL via Prisma · Secrets: AES-256-GCM

---

## Stack

| | |
|---|---|
| Runtime | Node.js 20 |
| Language | TypeScript |
| ORM | Prisma (PostgreSQL) |
| Auth | jsonwebtoken (HS256) |
| Passwords | bcryptjs |
| Encryption | Node.js crypto (AES-256-GCM) |
| Bundler | esbuild |
| Infra config | SSM Parameter Store (prod) / .env (local) |

---

## Local Setup

### 1. Clone & install

```bash
git clone https://github.com/aolmedof/ncodx-api
cd ncodx-api
npm install
```

### 2. Environment variables

```bash
cp .env.example .env
# Edit .env with your values
```

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | HS256 signing secret (min 32 chars in prod) |
| `ENCRYPTION_KEY` | AES-256-GCM passphrase (min 32 chars in prod) |
| `CORS_ORIGIN` | Allowed origin (e.g. `http://localhost:5173`) |

### 3. Database

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Run locally

```bash
npm run dev
# → http://localhost:3001
```

---

## Testing endpoints

Open `api.http` with the **REST Client** VS Code extension, or use curl:

```bash
# Register
curl -s -X POST http://localhost:3001/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com","password":"secret123","name":"Test"}' | jq

# Login (auto-creates user if not exists)
TOKEN=$(curl -s -X POST http://localhost:3001/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com","password":"secret123"}' | jq -r .token)

# Me
curl -s http://localhost:3001/me -H "Authorization: Bearer $TOKEN" | jq

# Create task
curl -s -X POST http://localhost:3001/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"title":"My task","status":"todo","priority":"high"}' | jq
```

---

## Build (Lambda zip)

```bash
npm run build
# → dist/lambda.zip  (handler.js + Prisma client + query engine)
```

---

## Deploy (manual)

```bash
aws lambda update-function-code \
  --function-name ncodx-api \
  --zip-file fileb://dist/lambda.zip \
  --region eu-west-3 \
  --profile aolmedof
```

---

## SSM Parameters (production)

| Path | Env fallback |
|---|---|
| `/ncodx/prod/jwt_secret` | `JWT_SECRET` |
| `/ncodx/prod/encryption_key` | `ENCRYPTION_KEY` |

---

## API Reference

See [`openapi.yaml`](./openapi.yaml) for full spec.

### Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | /auth/login | — | Login (auto-creates user) |
| POST | /auth/register | — | Register |
| GET | /me | ✓ | Current user |
| GET | /projects | ✓ | List projects |
| POST | /projects | ✓ | Create project |
| GET | /projects/:id | ✓ | Project + tasks |
| PUT | /projects/:id | ✓ | Update project |
| DELETE | /projects/:id | ✓ | Delete project |
| GET | /tasks | ✓ | List tasks (filter: project_id, status, priority) |
| POST | /tasks | ✓ | Create task |
| GET | /tasks/:id | ✓ | Get task |
| PUT | /tasks/:id | ✓ | Update task |
| DELETE | /tasks/:id | ✓ | Delete task |
| PUT | /tasks/reorder | ✓ | Reorder (drag & drop) |
| GET | /goals | ✓ | List goals |
| POST | /goals | ✓ | Create goal |
| PUT | /goals/:id | ✓ | Update goal |
| DELETE | /goals/:id | ✓ | Delete goal |
| GET | /shopping-items | ✓ | List shopping items |
| POST | /shopping-items | ✓ | Create item |
| PUT | /shopping-items/:id | ✓ | Update item |
| DELETE | /shopping-items/:id | ✓ | Delete item |
| GET | /notes | ✓ | List notes |
| POST | /notes | ✓ | Create note |
| PUT | /notes/:id | ✓ | Update note (incl. x,y) |
| DELETE | /notes/:id | ✓ | Delete note |
| GET | /calendar/connections | ✓ | List connections |
| POST | /calendar/connections | ✓ | Add connection |
| DELETE | /calendar/connections/:id | ✓ | Remove connection |
| GET | /calendar/events | ✓ | List events (filter: start, end) |
| POST | /calendar/events | ✓ | Create manual event |
| POST | /calendar/sync | ✓ | Trigger sync |
| GET | /secrets | ✓ | List secrets (no values) |
| POST | /secrets | ✓ | Create encrypted secret |
| GET | /secrets/:id | ✓ | Get secret with value |
| PUT | /secrets/:id | ✓ | Update secret |
| DELETE | /secrets/:id | ✓ | Delete secret |
| GET | /ai/conversations | ✓ | List AI conversations |
| POST | /ai/conversations | ✓ | New conversation |
| GET | /ai/conversations/:id | ✓ | Conversation + messages |
| POST | /ai/conversations/:id/messages | ✓ | Send message |
| DELETE | /ai/conversations/:id | ✓ | Delete conversation |
| GET | /settings | ✓ | Get settings |
| PUT | /settings | ✓ | Update settings |
