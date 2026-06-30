require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const bcrypt = require("bcryptjs");

const connectionString = process.env.DATABASE_URL;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = "admin@drdiettherapy.com";
  const plainPassword = "12345678";

  const existingAdmin = await prisma.user.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    console.log("Admin already exists");
    return;
  }

  const passwordHash = await bcrypt.hash(plainPassword, 10);

  const admin = await prisma.user.create({
    data: {
      fullName: "Admin User",
      email,
      passwordHash,
      role: "ADMIN",
      accountStatus: "ACTIVE",
      registrationStatus: "COMPLETED",
      isEmailVerified: true,
    },
  });

  console.log("Admin created successfully");
  console.log({
    email: admin.email,
    password: plainPassword,
    role: admin.role,
  });
}

main()
  .catch((error) => {
    console.error("Error creating admin:", error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });