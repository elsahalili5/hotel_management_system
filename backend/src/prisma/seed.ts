// prisma/seed.ts
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient(); // no adapter

async function main() {
  const user1 = await prisma.user.create({
    data: {
      name: "Elsa",
      email: "elsa@example.com",
      posts: {
        create: [
          { title: "My first post", content: "Hello world!" },
          { title: "Second post", content: "Prisma + Express" },
        ],
      },
    },
  });

  console.log("Seed finished:", user1);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
