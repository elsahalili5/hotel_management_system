import "dotenv/config";
import { prisma } from "../src/lib/prisma.ts";

async function main() {
  // Create Elsa
  const elsa = await prisma.user.create({
    data: {
      name: "Elsa",
      email: "elsa@example.com",
      address: "123 Arendelle Way",
    },
  });

  // Associate posts with Elsa
  await prisma.post.createMany({
    data: [
      {
        title: "Elsa's First Post",
        content: "Hello world!",
        authorId: elsa.id,
      },
      {
        title: "Elsa's Second Post",
        content: "Prisma + Express",
        authorId: elsa.id,
      },
    ],
  });

  // Create Anjesa
  const anjesa = await prisma.user.create({
    data: {
      name: "Anjesa",
      email: "anjesa@example.com",
      address: "456 Castle Rd",
    },
  });

  // Associate posts with Anjesa
  await prisma.post.createMany({
    data: [
      {
        title: "Anjesa's First Post",
        content: "Anjesa says hi!",
        authorId: anjesa.id,
      },
      {
        title: "Anjesa's Second Post",
        content: "Testing posts for Anjesa",
        authorId: anjesa.id,
      },
    ],
  });
}

main()
  .then(() => console.log("Seed finished"))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
