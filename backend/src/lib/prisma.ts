import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client.js";

// Driver adapter: the client uses @prisma/adapter-mariadb so queries go through the mariadb npm driver (not only Prisma’s built-in engine URL handling).
function normalizeDatabaseUrl(raw: string): string {
  // The mariadb npm driver rejects empty passwords written as user:@host; it expects user@host. Common .env mistake: mysql://root:@localhost/...
  return raw.replace(/^(mysql|mariadb):\/\/([^:/@]+):@/i, "$1://$2@");
}

const url = normalizeDatabaseUrl(process.env.DATABASE_URL?.trim() ?? "");
if (!url) {
  throw new Error("DATABASE_URL is not set");
}

export const prisma = new PrismaClient({
  adapter: new PrismaMariaDb(url),
});
