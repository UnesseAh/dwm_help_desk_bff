import { PrismaClient } from "../src/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";
import { hashPassword } from "../src/utils/hashPassword";
import { Role } from "../src/generated/enums";

dotenv.config();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL as string,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const serviceCatalog = [
    {
      department: "IT Service Desk",
      services: [
        { name: "Workstation & Hardware Faults" },
        { name: "Identity & Access Management" },
        { name: "Network & Corporate VPN" },
        { name: "Software Installation & Licensing" },
      ],
    },
    {
      department: "Human Resources (HR)",
      services: [
        { name: "Onboarding & Offboarding Lifecycle" },
        { name: "Benefits, Payroll & Pension Enquiries" },
        { name: "Leave, Absence & Attendance Tracking" },
      ],
    },
    {
      department: "Facilities & Workplace Operations",
      services: [
        { name: "HVAC, Climate Control & Lighting" },
        { name: "Physical Security & Access Badges" },
        { name: "Office Relocation & Workspace Ergonomics" },
      ],
    },
    {
      department: "Finance & Procurement",
      services: [
        { name: "Expense Reimbursement Enquiries" },
        { name: "Supplier Invoicing & Vendor Management" },
        { name: "Corporate Cards & Business Travel Booking" },
      ],
    },
    {
      department: "Legal & Compliance Operations",
      services: [
        { name: "Contract Review & NDAs Lifecycle" },
        { name: "Data Privacy & GDPR Subject Requests" },
        { name: "Intellectual Property & Copyrights" },
      ],
    },
  ];

  for (const catalogItem of serviceCatalog) {
    const existingDept = await prisma.department.findUnique({
      where: { name: catalogItem.department },
      include: { services: true },
    });

    if (!existingDept) {
      await prisma.department.create({
        data: {
          name: catalogItem.department,
          services: { create: catalogItem.services },
        },
      });
    } else {
      for (const serviceItem of catalogItem.services) {
        await prisma.service.upsert({
          where: {
            name_departmentId: {
              name: serviceItem.name,
              departmentId: existingDept.id,
            },
          },
          update: {},
          create: {
            name: serviceItem.name,
            departmentId: existingDept.id,
          },
        });
      }
    }
  }

  // Seed Users
  const adminPassword = hashPassword("admin123");
  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@example.com",
      passwordHash: adminPassword,
      role: Role.ADMIN,
      isActivated: true,
    },
  });

  const clientPassword = hashPassword("client123");
  await prisma.user.upsert({
    where: { email: "client@example.com" },
    update: {},
    create: {
      name: "Client User",
      email: "client@example.com",
      passwordHash: clientPassword,
      role: Role.USER,
      isActivated: true,
    },
  });

  // Get a service to assign to the agent
  const itService = await prisma.service.findFirst({
    where: { name: "Workstation & Hardware Faults" }
  });

  if (itService) {
    const agentPassword = hashPassword("agent123");
    await prisma.user.upsert({
      where: { email: "agent@example.com" },
      update: {},
      create: {
        name: "Agent User",
        email: "agent@example.com",
        passwordHash: agentPassword,
        role: Role.AGENT,
        isActivated: true,
        serviceId: itService.id
      },
    });
  }

}

main()
  .catch((e) => {
    console.error("[SEEDER ERROR]:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
