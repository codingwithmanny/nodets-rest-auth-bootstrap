// Imports
// ========================================================
import * as dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { getGeneratedToken } from '../../src/utils';
import faker from 'faker';

// Config
// ========================================================
dotenv.config();

// Seeds
// ========================================================
import UserSeed from './UserSeed';

// Init
// ========================================================
const prisma = new PrismaClient();

// Seeder
// ========================================================
async function seedAll(): Promise<void> {
  // UNCONFIRMED account
  await UserSeed({
    email: 'unconfirmed@account.com',
    first_name: faker.fake('{{name.firstName}}'),
    last_name: faker.fake('{{name.firstName}}'),
    password: 'password',
    confirmation_token: 'CONFIRMATION_TOKEN',
  });

  // CONFIRMED account
  await UserSeed({
    email: 'confirmed@account.com',
    first_name: faker.fake('{{name.firstName}}'),
    last_name: faker.fake('{{name.firstName}}'),
    password: 'password',
    confirmation_token: getGeneratedToken(),
    confirmed_at: new Date(),
  });

  // RESET TOKEN account
  await UserSeed({
    id: 'cfb09a6e-463d-48d4-bdbb-d0430b4e544f',
    email: 'reset@account.com',
    first_name: faker.fake('{{name.firstName}}'),
    last_name: faker.fake('{{name.firstName}}'),
    password: 'password',
    confirmation_token: getGeneratedToken(),
    confirmed_at: new Date(),
    reset_token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjZmIwOWE2ZS00NjNkLTQ4ZDQtYmRiYi1kMDQzMGI0ZTU0NGYiLCJlbWFpbCI6InJlc2V0QGFjY291bnQuY29tIiwiaXNzIjoiYXBpLmxvY2FsaG9zdCIsImF1ZCI6ImFwaS5sb2NhbGhvc3QiLCJpYXQiOjE1OTQyNTgxMTIsImV4cCI6MTg5NTA2ODI1ODExMn0.jkMjBzv9Gh8D41rHLu2e4_xMXnu5OHro_MFhgW5AbQs',
  });

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
    await prisma.$disconnect();
    process.exit();
  });
