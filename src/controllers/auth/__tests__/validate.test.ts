// Imports
// ========================================================
import { buildErrorResponse, buildSuccessResponse } from '../../../utils';
import CONST from '../../../utils/constants';
import { buildRequest, buildResponse } from '../../../../test/utils/generate';

// Tested
// ========================================================
import { Validate } from '../validate';

// Mocks
// ========================================================
/**
 * @constant
 */
const mockUserFindMany = jest.fn().mockName('mockUserFindMany');

/**
 * Mock
 */
jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      user: {
        findMany: (...args: any) => mockUserFindMany(args),
      },
    })),
  };
});

/**
 * @constant
 */
const mockVerifyResetToken = jest.fn().mockName('mockVerifyResetToken');

/**
 * Mocking utils function
 */
jest.mock('../../../utils', () => ({
  ...(jest.requireActual('../../../utils') as any),
  verifyResetToken: (...args: any) => mockVerifyResetToken(args),
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
 * Validate token not set
 */
test('test - validate - token not set', async () => {
  // Setup
  mockVerifyResetToken.mockResolvedValue(true);
  const req = buildRequest();
  const res = buildResponse();

  // Pre Expectation
  expect(res.status).not.toHaveBeenCalled();
  expect(res.send).not.toHaveBeenCalled();
  expect(res.json).not.toHaveBeenCalled();
  expect(mockVerifyResetToken).not.toHaveBeenCalled();
  expect(mockUserFindMany).not.toHaveBeenCalled();

  // Init
  await Validate(req, res);

  // Expectations
  expect(res.send).not.toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledTimes(1);
  expect(res.status).toHaveBeenCalledWith(400);
  expect(mockVerifyResetToken).not.toHaveBeenCalled();
  expect(mockUserFindMany).not.toHaveBeenCalled();
  expect(res.json).toHaveBeenCalledTimes(1);
  expect(res.json).toHaveBeenCalledWith(
    buildErrorResponse({
      msg: CONST.AUTH.VALIDATE.ERRORS.INVALID,
    }),
  );
});

/**
 * Validate invalid token
 */
test('test - validate - invalid token', async () => {
  // Setup
  mockVerifyResetToken.mockImplementation(() => {
    throw new Error('ERROR_MESSAGE');
  });
  mockUserFindMany.mockResolvedValue([]);
  const req = buildRequest({
    query: {
      token: 'TOKEN',
    },
  });
  const res = buildResponse();

  // Pre Expectation
  expect(res.status).not.toHaveBeenCalled();
  expect(res.send).not.toHaveBeenCalled();
  expect(res.json).not.toHaveBeenCalled();
  expect(mockVerifyResetToken).not.toHaveBeenCalled();
  expect(mockUserFindMany).not.toHaveBeenCalled();

  // Init
  await Validate(req, res);

  // Expectations
  expect(res.send).not.toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledTimes(1);
  expect(res.status).toHaveBeenCalledWith(404);
  expect(mockUserFindMany).not.toHaveBeenCalled();
  expect(mockVerifyResetToken).toHaveBeenCalledTimes(1);
  expect(mockVerifyResetToken).toHaveBeenCalledWith(['TOKEN']);
  expect(res.json).toHaveBeenCalledTimes(1);
  expect(res.json).toHaveBeenCalledWith(
    buildErrorResponse({
      msg: CONST.AUTH.VALIDATE.ERRORS.INVALID,
    }),
  );
});

/**
 * Validate user not found
 */
test('test - validate - user not found', async () => {
  // Setup
  mockVerifyResetToken.mockResolvedValue(true);
  mockUserFindMany.mockResolvedValue([]);
  const req = buildRequest({
    query: {
      token: 'TOKEN',
    },
  });
  const res = buildResponse();

  // Pre Expectation
  expect(res.status).not.toHaveBeenCalled();
  expect(res.send).not.toHaveBeenCalled();
  expect(res.json).not.toHaveBeenCalled();
  expect(mockVerifyResetToken).not.toHaveBeenCalled();
  expect(mockUserFindMany).not.toHaveBeenCalled();

  // Init
  await Validate(req, res);

  // Expectations
  expect(res.send).not.toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledTimes(1);
  expect(res.status).toHaveBeenCalledWith(404);
  expect(mockVerifyResetToken).toHaveBeenCalledTimes(1);
  expect(mockVerifyResetToken).toHaveBeenCalledWith(['TOKEN']);
  expect(mockUserFindMany).toHaveBeenCalledTimes(1);
  expect(mockUserFindMany).toHaveBeenCalledWith([
    {
      take: 1,
      where: {
        reset_token: 'TOKEN',
      },
    },
  ]);
  expect(res.json).toHaveBeenCalledTimes(1);
  expect(res.json).toHaveBeenCalledWith(
    buildErrorResponse({
      msg: CONST.AUTH.VALIDATE.ERRORS.INVALID,
    }),
  );
});

/**
 * Validate user success
 */
test('test - validate - success', async () => {
  // Setup
  mockVerifyResetToken.mockResolvedValue(true);
  mockUserFindMany.mockResolvedValue([
    {
      id: 'USER_ID',
    },
  ]);
  const req = buildRequest({
    query: {
      token: 'TOKEN',
    },
  });
  const res = buildResponse();

  // Pre Expectation
  expect(res.status).not.toHaveBeenCalled();
  expect(res.send).not.toHaveBeenCalled();
  expect(res.json).not.toHaveBeenCalled();
  expect(mockVerifyResetToken).not.toHaveBeenCalled();
  expect(mockUserFindMany).not.toHaveBeenCalled();

  // Init
  await Validate(req, res);

  // Expectations
  expect(res.send).not.toHaveBeenCalled();
  expect(res.status).not.toHaveBeenCalled();
  expect(mockVerifyResetToken).toHaveBeenCalledTimes(1);
  expect(mockVerifyResetToken).toHaveBeenCalledWith(['TOKEN']);
  expect(mockUserFindMany).toHaveBeenCalledTimes(1);
  expect(mockUserFindMany).toHaveBeenCalledWith([
    {
      take: 1,
      where: {
        reset_token: 'TOKEN',
      },
    },
  ]);
  expect(res.json).toHaveBeenCalledTimes(1);
  expect(res.json).toHaveBeenCalledWith(
    buildSuccessResponse({ msg: CONST.AUTH.VALIDATE.SUCCESS.VALID }),
  );
});
