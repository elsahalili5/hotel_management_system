# Mansio backend

Express API with Prisma and MySQL/MariaDB.

## Prerequisites

- **Node.js** (LTS is fine; align with the team if needed)
- **MySQL** or **MariaDB** reachable from your machine

## First-time setup

1. **Install dependencies**

   ```bash
   cd backend
   npm install
   ```

2. **Create a database**  
   Create an empty database (for example `mansio`) in MySQL/MariaDB.

3. **Configure environment**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and set `DATABASE_URL`. See `.env.example` for the format. If the username or password contains special characters (`@`, `#`, `:`, `/`, `?`, or spaces), URL-encode that segment.

4. **Apply migrations and generate the Prisma client**

   ```bash
   npm run db:migrate
   ```

   This runs `prisma migrate dev` (applies everything under `prisma/migrations/`) and then `prisma generate`.

   To **only** apply existing migrations (no interactive dev flow, closer to production):

   ```bash
   npx prisma migrate deploy
   npm run db:generate
   ```

5. **Seed (optional)**

   ```bash

   ```

   Seeding is configured in `prisma.config.ts` to run `tsx prisma/seed.ts`.

6. **Start the server**

   ```bash
   npm run dev
   ```

   Default port is **5000**, or set `PORT` in `.env`.

## npm scripts

| Script                | Purpose                                                                     |
| --------------------- | --------------------------------------------------------------------------- |
| `npm run dev`         | Run the API with `tsx`                                                      |
| `npm run db:generate` | Regenerate the Prisma client from `schema.prisma`                           |
| `npm run db:migrate`  | Create/apply dev migrations and regenerate the client                       |
| `npm run db:push`     | Push schema to the DB without a new migration file (quick experiments only) |
| `npm run db:seed`     | Run the seed script                                                         |
| `npm run db:studio`   | Open Prisma Studio                                                          |

## Changing the database schema

1. Edit `prisma/schema.prisma`.
2. Run `npm run db:migrate` and enter a short migration name when prompted.
3. Commit both `schema.prisma` and the new folder under `prisma/migrations/`.

For **production or CI**, apply committed migrations with:

```bash
npx prisma migrate deploy
```

## Troubleshooting

- **`DATABASE_URL` errors** — Check user, password, host, port, and database name; ensure special characters in credentials are encoded.
- **Connection refused** — Confirm MySQL/MariaDB is running and listening on the host/port in the URL.
- **Database does not exist** — Create the database before running migrations.

## API routes

- `/api/users` — user routes
- `/api/posts` — post routes
- `/api/ping` — health-style check
