import { prisma } from "./utils/lib/prisma";

export async function seedData() {
  try {
    // Seed Departments if none exist
    const deptCount = await prisma.department.count();
    if (deptCount === 0) {
      await prisma.department.createMany({
        data: [
          { name: "IT Support" },
          { name: "HR" },
          { name: "Facilities" }
        ]
      });
      console.log("✅ Seeded default departments");
    }
    // Seed Services if none exist
    const serviceCount = await prisma.service.count();
    if (serviceCount === 0) {
      // Assuming department IDs start at 1 in order of creation
      await prisma.service.createMany({
        data: [
          { name: "Computer Repair", departmentId: 1 },
          { name: "Password Reset", departmentId: 1 },
          { name: "Onboarding", departmentId: 2 },
          { name: "Maintenance Request", departmentId: 3 }
        ]
      });
      console.log("✅ Seeded default services");
    }
  } catch (error) {
    console.error("⚠️ Seeding error:", error);
  }
}
