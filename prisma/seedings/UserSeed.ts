// Imports
// ========================================================
import { PrismaClient, User } from '@prisma/client';
import faker from 'faker';

// Utils
import { hashPassword, getGeneratedToken } from '../../src/utils';

// Init
// ========================================================
const prisma = new PrismaClient();
const modelName = 'User';

// Seeder
// ========================================================
export default async function seed(): Promise<User> {
  const hashedPassword = await hashPassword('password');

  const insert: User = await prisma.user.create({
    data: {
      email: faker.internet.email(),
      first_name: faker.fake('{{name.firstName}}'),
      last_name: faker.fake('{{name.firstName}}'),
      password: hashedPassword,
      confirmation_token: getGeneratedToken(),
    },
  });

  console.log(`Create new ${modelName}:`, insert);

  return insert;
}

// Execute
// ========================================================
(async () => {
  if (process.argv[2] === '--seed') {
    seed()
      .catch((error) => {
        console.log(`Error seeding: ${modelName}`);
        throw error;
      })
      .finally(async () => {
        await prisma.disconnect();
        process.exit();
      });
  }
})();
