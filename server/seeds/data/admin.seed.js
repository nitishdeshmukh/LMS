import { faker } from "@faker-js/faker";
import { Admin } from "../../models/index.js";

export const seedAdmins = async () => {
    const admins = [];

    // Main admin account
    admins.push({
        email: "admin@example.com",
        password: "Admin@123",
        name: "Admin",
        middleName: "",
        lastName: "User",
        phoneNumber: "+919876543210",
        avatar: faker.image.avatar(),
        lastLogin: faker.date.recent({ days: 1 }),
    });

    // Additional admin for testing
    admins.push({
        email: "superadmin@code2dbug.com",
        password: "Super@123",
        name: "Super",
        middleName: "",
        lastName: "Admin",
        phoneNumber: "+919876543211",
        avatar: faker.image.avatar(),
        lastLogin: faker.date.recent({ days: 3 }),
    });

    // Save all admins
    for (const adminData of admins) {
        const admin = new Admin(adminData);
        await admin.save();
    }

    console.log(`✅ ${admins.length} admins seeded`);
    console.log("   📧 Admin: admin@example.com / Admin@123");
    console.log("   📧 Super Admin: superadmin@code2dbug.com / Super@123");
};
