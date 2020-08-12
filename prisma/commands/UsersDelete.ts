// Imports
// ========================================================
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

// Config
// ========================================================
dotenv.config();

// Init
// ========================================================
const prisma = new PrismaClient();
const modelName = 'User';

// Seeder
// ========================================================
export default async function deleteAll() {
  await prisma.user.deleteMany({
    where: {
      created_at: {
        not: undefined,
      },
    },
  });
}

// Execute
// ========================================================
(async () => {
  if (process.argv[2] === '--delete') {
    deleteAll()
      .catch((error) => {
        console.log(`Error deleting: ${modelName}`);
        throw error;
      })
      .finally(async () => {
        await prisma.disconnect();
        process.exit();
      });
  }
})();
