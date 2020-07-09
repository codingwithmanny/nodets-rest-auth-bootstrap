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

// Interface
// ========================================================
interface SeedType {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  reset_token?: string | null;
  refresh_token?: string | null;
  confirmation_token: string;
  confirmed_at?: Date | null;
  created_at?: Date;
  updated_at?: Date;
}

// Seeder
// ========================================================
export default async function seed(data?: SeedType): Promise<User> {
  if (!data) {
    data = {
      email: faker.internet.email(),
      first_name: faker.fake('{{name.firstName}}'),
      last_name: faker.fake('{{name.firstName}}'),
      password: 'password',
      confirmation_token: getGeneratedToken(),
      confirmed_at: new Date(),
    };
  }

  if (data?.password) {
    data.password = await hashPassword(data.password);
  }

  const insert: User = await prisma.user.create({
    data: data as User,
  });

  console.log(`Create new ${insert.id}:`, insert);

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
