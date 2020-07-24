// Imports
// ========================================================
import { buildErrorResponse, buildSuccessResponse } from '../../../utils';
import CONST from '../../../utils/constants';
import { buildRequest, buildResponse } from '../../../../test/utils/generate';

// Tested
// ========================================================
import { Reset } from '../reset';

// Mocks
// ========================================================
/**
 * @constant
 */
const mockUserFindMany = jest.fn().mockName('mockUserFindMany');

/**
 * @constant
 */
const mockUserUpdate = jest.fn().mockName('mockUserUpdate');

/**
 * Mock
 */
jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      user: {
        findMany: (...args: any) => mockUserFindMany(args),
        update: (...args: any) => mockUserUpdate(args),
      },
    })),
  };
});

/**
 * @constant
 */
const mockVerifyResetToken = jest.fn().mockName('mockVerifyResetToken');

/**
 * @constant
 */
const mockHashPassword = jest.fn().mockName('mockHashPassword');

/**
 * Mocking utils function
 */
jest.mock('../../../utils', () => ({
  ...(jest.requireActual('../../../utils') as any),
  verifyResetToken: (...args: any) => mockVerifyResetToken(args),
  hashPassword: (...args: any) => mockHashPassword(args),
}));

/**
 * Reset for mocks
 */
beforeEach(() => {
  jest.clearAllMocks();
});

// Tests
// ========================================================
/**
 * Reset invalid reset token
 */
test('test - reset - verify reset token throw error', async () => {
  // Setup
  mockHashPassword.mockResolvedValue('HASHED_PASSWORD');
  mockVerifyResetToken.mockImplementation(() => {
    throw new Error('ERROR_MESSAGE');
  });
  const req = buildRequest({
    body: {
      reset_token: 'RESET_TOKEN',
    },
  });
  const res = buildResponse();

  // Pre Expectation
  expect(res.status).not.toHaveBeenCalled();
  expect(res.send).not.toHaveBeenCalled();
  expect(res.json).not.toHaveBeenCalled();
  expect(mockVerifyResetToken).not.toHaveBeenCalled();
  expect(mockHashPassword).not.toHaveBeenCalled();
  expect(mockUserFindMany).not.toHaveBeenCalled();
  expect(mockUserUpdate).not.toHaveBeenCalled();

  // Init
  await Reset(req, res);

  // Expectations
  expect(res.send).not.toHaveBeenCalled();
  expect(res.json).toHaveBeenCalledTimes(1);
  expect(res.status).toHaveBeenCalledTimes(1);
  expect(res.status).toHaveBeenCalledWith(401);
  expect(mockVerifyResetToken).toHaveBeenCalledTimes(1);
  expect(mockVerifyResetToken).toHaveBeenCalledWith(['RESET_TOKEN']);
  expect(mockHashPassword).not.toHaveBeenCalled();
  expect(mockUserFindMany).not.toHaveBeenCalled();
  expect(mockUserUpdate).not.toHaveBeenCalled();
  expect(res.json).toHaveBeenCalledWith(
    buildErrorResponse({
      msg: CONST.AUTH.RESET.ERRORS.RESTART,
    }),
  );
});

/**
 * Reset user not found
 */
test('test - reset - user not found', async () => {
  // Setup
  mockHashPassword.mockResolvedValue('HASHED_PASSWORD');
  mockVerifyResetToken.mockResolvedValue(true);
  mockUserFindMany.mockResolvedValue([]);
  const req = buildRequest({
    body: {
      new_password: 'NEW_PASSWORD',
      reset_token: 'RESET_TOKEN',
    },
  });
  const res = buildResponse();

  // Pre Expectation
  expect(res.status).not.toHaveBeenCalled();
  expect(res.send).not.toHaveBeenCalled();
  expect(res.json).not.toHaveBeenCalled();
  expect(mockVerifyResetToken).not.toHaveBeenCalled();
  expect(mockHashPassword).not.toHaveBeenCalled();
  expect(mockUserFindMany).not.toHaveBeenCalled();
  expect(mockUserUpdate).not.toHaveBeenCalled();

  // Init
  await Reset(req, res);

  // Expectations
  expect(res.send).not.toHaveBeenCalled();
  expect(res.json).toHaveBeenCalledTimes(1);
  expect(res.status).toHaveBeenCalledTimes(1);
  expect(res.status).toHaveBeenCalledWith(404);
  expect(mockVerifyResetToken).toHaveBeenCalledTimes(1);
  expect(mockVerifyResetToken).toHaveBeenCalledWith(['RESET_TOKEN']);
  expect(mockHashPassword).toHaveBeenCalledTimes(1);
  expect(mockHashPassword).toHaveBeenCalledWith(['NEW_PASSWORD']);
  expect(mockUserFindMany).toHaveBeenCalledTimes(1);
  expect(mockUserFindMany).toHaveBeenCalledWith([
    {
      take: 1,
      where: {
        reset_token: 'RESET_TOKEN',
      },
    },
  ]);
  expect(mockUserUpdate).not.toHaveBeenCalled();
  expect(res.json).toHaveBeenCalledWith(
    buildErrorResponse({
      msg: CONST.AUTH.RESET.ERRORS.INVALID,
    }),
  );
});

/**
 * Reset success
 */
test('test - reset - success', async () => {
  // Setup
  mockHashPassword.mockResolvedValue('HASHED_PASSWORD');
  mockVerifyResetToken.mockResolvedValue(true);
  mockUserFindMany.mockResolvedValue([
    {
      id: 'USER_ID',
    },
  ]);
  mockUserUpdate.mockResolvedValue(null);
  const req = buildRequest({
    body: {
      new_password: 'NEW_PASSWORD',
      reset_token: 'RESET_TOKEN',
    },
  });
  const res = buildResponse();

  // Pre Expectation
  expect(res.status).not.toHaveBeenCalled();
  expect(res.send).not.toHaveBeenCalled();
  expect(res.json).not.toHaveBeenCalled();
  expect(mockVerifyResetToken).not.toHaveBeenCalled();
  expect(mockHashPassword).not.toHaveBeenCalled();
  expect(mockUserFindMany).not.toHaveBeenCalled();
  expect(mockUserUpdate).not.toHaveBeenCalled();

  // Init
  await Reset(req, res);

  // Expectations
  expect(res.send).not.toHaveBeenCalled();
  expect(res.status).not.toHaveBeenCalled();
  expect(res.json).toHaveBeenCalledTimes(1);
  expect(mockVerifyResetToken).toHaveBeenCalledTimes(1);
  expect(mockVerifyResetToken).toHaveBeenCalledWith(['RESET_TOKEN']);
  expect(mockHashPassword).toHaveBeenCalledTimes(1);
  expect(mockHashPassword).toHaveBeenCalledWith(['NEW_PASSWORD']);
  expect(mockUserFindMany).toHaveBeenCalledTimes(1);
  expect(mockUserFindMany).toHaveBeenCalledWith([
    {
      take: 1,
      where: {
        reset_token: 'RESET_TOKEN',
      },
    },
  ]);
  expect(mockUserUpdate).toHaveBeenCalledTimes(1);
  expect(mockUserUpdate).toHaveBeenCalledWith([
    {
      where: {
        id: 'USER_ID',
      },
      data: {
        password: 'HASHED_PASSWORD',
        reset_token: null,
        refresh_token: null,
      },
    },
  ]);
  expect(res.json).toHaveBeenCalledWith(
    buildSuccessResponse({
      msg: CONST.AUTH.RESET.SUCCESS.RESET,
    }),
  );
});
