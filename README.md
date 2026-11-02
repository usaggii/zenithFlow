# ZenithFlow

A B2B SaaS backend built with **NestJS**, **Prisma**, and **PostgreSQL**, using a multi-tenant shared-schema architecture. ZenithFlow tackles two hard problems in an HR context: multi-tenant data isolation and state-dependent business workflows.

Multiple companies (tenants) can manage their workforce, departments, and leave policies on shared infrastructure, with a "Zero-Trust" approach to data access.

---

## Features

- **Multitenancy**: Application-level tenant isolation. Every database query is automatically scoped to the authenticated company using `AsyncLocalStorage` and Prisma extensions.
- **Auth & RBAC**: JWT-based authentication with four granular roles: `SUPER_ADMIN`, `HR_ADMIN`, `MANAGER`, and `EMPLOYEE`.
- **Company onboarding**: Atomic registration that creates the company profile and its primary `SUPER_ADMIN` account in a single transaction.
- **Employee management**: Full lifecycle support: inviting, onboarding, transferring between departments, and offboarding.
- **Department management**: Hierarchical org structures with manager assignments and nested department views.
- **Leave workflow**: A strict state machine for submitting, approving, rejecting, and cancelling leave requests.
- **Leave balances**: Real-time balance tracking per employee and leave type. Approved requests automatically deduct from allocated days.
- **Audit log**: Immutable trail of every status change, recording the who, what, and when for compliance.
- **Pagination & filtering**: Standardized query handling across all list endpoints, supporting `page`, `limit`, and multi-field filtering.
- **Rate limiting**: Brute-force protection on authentication and sensitive onboarding endpoints.
- **Input validation**: Strict DTO validation and sanitization using `class-validator`.
- **Swagger docs**: Interactive API documentation and testing UI at `/api`.
- **Dockerised**: Complete development environment with a single `docker-compose` command.

---

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | NestJS | Modular, TypeScript-first, built-in DI |
| Language | TypeScript | Type safety, better DX |
| Database | PostgreSQL 16 | Relational data, ACID transactions, strong fit for multi-tenancy. Native row-level security *(planned)* |
| ORM | Prisma 7 (with driver adapters) | Type-safe query extensions that automate tenant isolation |
| Cache / Queue *(planned)* | Redis | Background job queues, distributed locking, and caching |
| Auth | JWT + Passport | Stateless, scalable, embeds tenant context |
| Docs | Swagger (`@nestjs/swagger`) | Auto-generated and interactive |
| Containerisation | Docker + Compose | Reproducible dev environment |

---

## Architectural Highlights

**Multi-tenant isolation.** ZenithFlow uses a shared-schema approach. To prevent data leaks, a Tenant Middleware extracts the `tenantId` from each request and stores it in an `AsyncLocalStorage` context. The Prisma Client is then extended to inject a mandatory `where: { tenantId }` clause into every read and write operation automatically.

**Leave state machine.** Leave management is a controlled flow, not just a status field. Every status change must follow a defined transition, and anything else is rejected:

| From | Allowed transitions |
|------|---------------------|
| `PENDING` | `APPROVED`, `REJECTED`, `CANCELLED` |
| `APPROVED` | `CANCELLED` |
| `REJECTED` | none |
| `CANCELLED` | none  |

Approved requests deduct from the employee's leave balance, and every transition is written to the audit log. This keeps HR records consistent and prevents invalid states.

---

## Prerequisites

- Node.js v20+
- Docker and Docker Compose
- npm or yarn

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/Tee-chan/zenithFlow.git
cd zenithFlow
npm install
```

### 2. Configure the environment

```bash
cp .env.example .env
```

Make sure `DATABASE_URL` in `.env` is correct for your setup.

### 3. Start the infrastructure

```bash
docker-compose up -d
```

### 4. Initialize the database (Prisma 7)

```bash
# Generate the Prisma client
npx prisma generate

# Run migrations to sync the schema
npx prisma migrate dev --name init_schema

# Optional: seed initial data
npm run seed
```

### 5. Start the application

```bash
npm run start:dev
```

### Production

```bash
npm run build
npm run start:prod
```

---

## API Documentation

Once the server is running, open [http://localhost:3000/api](http://localhost:3000/api) to explore the interactive Swagger docs.

---

## Author

**Tenshi** — [GitHub](https://github.com/Tee-chan) · [LinkedIn](https://linkedin.com/in/georgeangel1)

---

## License

MIT
