// Imports
// ========================================================
import { PrismaClient } from '@prisma/client';
import { Confirm } from '../confirm';
import { buildErrorResponse } from '../../../utils';
import CONST from '../../../utils/constants';
import { buildRequest, buildResponse } from '../../../../test/utils/generate';

const prisma = new PrismaClient();

// Mocks
// ========================================================
// const { PrismaClient } = jest.requireActual('node-fetch');
// jest.mock('@prisma/client');

// jest.mock('@prisma/client', () => {
//   return {
//     PrismaClient: jest.fn(),
//   };
// });
jest.mock('@prisma/client');

// jest.mock('@prisma/client', () => jest.fn());
//   return {
//     PrismaClient: jest.fn().mockImplementation(() => ({
//       user: {
//         findMany: jest.fn(() => []),
//       },
//     })),
//   };
// });

beforeEach(() => {
  jest.clearAllMocks();
});

// Tests
// ========================================================
/**
 * Validates if password is successfully hashed
 */
// beforeAll(() => {
// jest.mock('@prisma/client', () => {
//   return {
//     PrismaClient: jest.fn().mockImplementation(() => ({
//       user: {
//         findMany: jest.fn(() => []),
//       },
//     })),
//   };
// });
// });

// jest.mock('axios', () => {
//     return Object.assign(jest.fn(), {
//         post: jest.fn().mockReturnValue({ success: true }),
//     });
// });

test('test - confirm - payload - {}', async () => {
  //   jest.mock('@prisma/client', () => {
  //     return {
  //       PrismaClient: jest.fn().mockImplementation(() => ({
  //         user: {
  //           findMany: jest.fn(() => []),
  //         },
  //       })),
  //     };
  //   });
  //   const client = (PrismaClient as jest.Mocked<any>).mock.instances[0];
  //   const user = client.user as jest.Mocked<any>;
  //   const mockPrisma = PrismaClient as jest.MockedClass<any>;
  //   mockPrisma.user = jest.fn().mockImplementation(() => ({
  //     findByMany: jest.fn(() => []),
  //   }));
  // const clinet = new PrismaClient();
  // PrismaClient.user = {};
  //   (PrismaClient.user as jest.Mocked<any>).findMany.mockResolvedValue([]);

  //   expect(PrismaClient.user.findMany).toHaveBeenCalledWith({
  //     take: 1,
  //     where: {
  //       confirmation_token: '',
  //     },
  //   });

  // Setup
  const req = buildRequest();
  const res = buildResponse();

  // Pre Expectation
  expect(res.status).not.toHaveBeenCalled();
  expect(res.send).not.toHaveBeenCalled();
  expect(res.json).not.toHaveBeenCalled();

  // Init
  await Confirm(req, res);

  //   Expectations
  expect(res.status).toHaveBeenCalledTimes(1);
  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledTimes(1);
  expect(res.json).toHaveBeenCalledWith(
    buildErrorResponse({
      msg: CONST.AUTH.CONFIRM.ERRORS.NOT_FOUND,
    }),
  );
  //   expect(PrismaClient.user.findMany).toBeCalledTimes(2);
});
