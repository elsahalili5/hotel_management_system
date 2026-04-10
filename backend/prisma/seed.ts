import "dotenv/config";
import bcrypt from "bcrypt";
import { prisma } from "../src/lib/prisma.ts";

async function main() {
  await prisma.role.createMany({
    data: [
      { name: "ADMIN", normalized_name: "admin", description: "Full access" },
      {
        name: "MANAGER",
        normalized_name: "manager",
        description: "Hotel manager",
      },
      {
        name: "RECEPTIONIST",
        normalized_name: "receptionist",
        description: "Front desk",
      },
      {
        name: "HOUSEKEEPING",
        normalized_name: "housekeeping",
        description: "Room management",
      },
      { name: "GUEST", normalized_name: "guest", description: "Hotel guest" },
    ],
    skipDuplicates: true,
  });

  console.log(" Roles created");

  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@mansio.com" },
    update: {},
    create: {
      first_name: "Super",
      last_name: "Admin",
      email: "admin@mansio.com",
      password_hash: adminPassword,
      status: "ACTIVE",
      email_confirmed: true,
    },
  });

  console.log(" Admin user created");

  const adminRole = await prisma.role.findUnique({ where: { name: "ADMIN" } });
  await prisma.userRole.upsert({
    where: { user_id_role_id: { user_id: admin.id, role_id: adminRole!.id } },
    update: {},
    create: { user_id: admin.id, role_id: adminRole!.id },
  });

  console.log("Admin role assigned");
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
