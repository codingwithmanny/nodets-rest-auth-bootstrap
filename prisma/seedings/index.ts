// Imports
// ========================================================
import { PrismaClient } from '@prisma/client';

// Seeds
// ========================================================
import UserSeed from './UserSeed';

// Init
// ========================================================
const prisma = new PrismaClient();

// Seeder
// ========================================================
async function seedAll(): Promise<void> {
  await UserSeed();

  console.log(`Seeded all.`);
}

// Execute
// ========================================================
seedAll()
  .catch((error) => {
    console.log(`Error seeding all`);
    throw error;
  })
  .finally(async () => {
    await prisma.disconnect();
    process.exit();
  });
