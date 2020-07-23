// Imports
// ========================================================
import { buildErrorResponse, buildSuccessResponse } from '../../../utils';
import CONST from '../../../utils/constants';
import { buildRequest, buildResponse } from '../../../../test/utils/generate';

// Tested
// ========================================================
import { Refresh } from '../refresh';

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
const mockCreateAuthToken = jest.fn().mockName('mockCreateAuthToken');

/**
 * @constant
 */
const mockCreateRefreshToken = jest.fn().mockName('mockCreateRefreshToken');

/**
 * @constant
 */
const mockVerifyRefreshToken = jest.fn().mockName('mockVerifyRefreshToken');

/**
 * Mocking utils function
 */
jest.mock('../../../utils', () => ({
  ...(jest.requireActual('../../../utils') as any),
  verifyRefreshToken: (...args: any) => mockVerifyRefreshToken(args),
  createRefreshToken: (...args: any) => mockCreateRefreshToken(args),
  createAuthToken: (...args: any) => mockCreateAuthToken(args),
}));

/**
 * @constant
 */
const mockRequestCookie = jest.fn().mockName('mockRequestCookie');

/**
 * @constant
 */
const mockClearCookie = jest.fn().mockName('mockClearCookie');

/**
 * Reset for mocks
 */
beforeEach(() => {
  jest.clearAllMocks();
});

// Tests
// ========================================================
/**
 * Token not set throw error
 */
test('test - refresh  - token not set - throw error', async () => {
  // Setup
  const req = buildRequest();
  const res = buildResponse({
    clearCookie: (...args: any) => mockClearCookie(args),
  });

  // Pre Expectation
  expect(res.status).not.toHaveBeenCalled();
  expect(res.send).not.toHaveBeenCalled();
  expect(res.json).not.toHaveBeenCalled();
  expect(mockVerifyRefreshToken).not.toHaveBeenCalled();
  expect(mockUserFindMany).not.toHaveBeenCalled();
  expect(mockCreateRefreshToken).not.toHaveBeenCalled();
  expect(mockCreateAuthToken).not.toHaveBeenCalled();
  expect(mockUserUpdate).not.toHaveBeenCalled();
  expect(mockRequestCookie).not.toHaveBeenCalled();
  expect(mockClearCookie).not.toHaveBeenCalled();

  process.env.CSRF_COOKIE_PREFIX = 'DIFFERENT_CSRF';

  // Init
  await Refresh(req, res);

  // Expectations
  expect(res.send).not.toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledTimes(1);
  expect(res.status).toHaveBeenCalledWith(401);
  expect(mockUserFindMany).not.toHaveBeenCalled();
  expect(mockVerifyRefreshToken).not.toHaveBeenCalled();
  expect(mockCreateAuthToken).not.toHaveBeenCalled();
  expect(mockUserUpdate).not.toHaveBeenCalled();
  expect(mockRequestCookie).not.toHaveBeenCalled();
  expect(mockClearCookie).toHaveBeenCalledTimes(3);
  expect(mockCreateRefreshToken).not.toHaveBeenCalled();
  expect(mockClearCookie).toHaveBeenCalledWith(['token']);
  expect(mockClearCookie).toHaveBeenCalledWith(['refreshToken']);
  expect(mockClearCookie).toHaveBeenCalledWith(['DIFFERENT_CSRF']);
  expect(res.json).toHaveBeenCalledWith(
    buildErrorResponse({
      msg: CONST.AUTH.REFRESH.ERRORS.INVALID,
    }),
  );
});

/**
 * Token set throw error
 */
test('test - refresh - invalid token - throw error', async () => {
  // Setup
  mockVerifyRefreshToken.mockReturnValue(null);
  const req = buildRequest({
    cookies: {
      refreshToken: 'REFRESH_TOKEN',
    },
  });
  const res = buildResponse({
    clearCookie: (...args: any) => mockClearCookie(args),
  });

  // Pre Expectation
  expect(res.status).not.toHaveBeenCalled();
  expect(res.send).not.toHaveBeenCalled();
  expect(res.json).not.toHaveBeenCalled();
  expect(mockVerifyRefreshToken).not.toHaveBeenCalled();
  expect(mockUserFindMany).not.toHaveBeenCalled();
  expect(mockCreateRefreshToken).not.toHaveBeenCalled();
  expect(mockCreateAuthToken).not.toHaveBeenCalled();
  expect(mockUserUpdate).not.toHaveBeenCalled();
  expect(mockRequestCookie).not.toHaveBeenCalled();
  expect(mockClearCookie).not.toHaveBeenCalled();
  process.env.CSRF_COOKIE_PREFIX = 'DIFFERENT_CSRF';

  // Init
  await Refresh(req, res);

  // Expectations
  expect(res.send).not.toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledTimes(1);
  expect(res.status).toHaveBeenCalledWith(401);
  expect(mockUserFindMany).toHaveBeenCalledTimes(1);
  expect(mockUserFindMany).toHaveBeenCalledWith([
    {
      take: 1,
      where: {
        id: undefined,
        refresh_token: 'REFRESH_TOKEN',
      },
    },
  ]);
  expect(mockVerifyRefreshToken).toHaveBeenCalledTimes(1);
  expect(mockVerifyRefreshToken).toHaveBeenCalledWith(['REFRESH_TOKEN']);
  expect(mockCreateAuthToken).not.toHaveBeenCalled();
  expect(mockUserUpdate).not.toHaveBeenCalled();
  expect(mockRequestCookie).not.toHaveBeenCalled();
  expect(mockClearCookie).toHaveBeenCalledTimes(3);
  expect(mockClearCookie).toHaveBeenCalledWith(['token']);
  expect(mockClearCookie).toHaveBeenCalledWith(['refreshToken']);
  expect(mockClearCookie).toHaveBeenCalledWith(['DIFFERENT_CSRF']);
  expect(mockCreateRefreshToken).not.toHaveBeenCalled();
  expect(res.json).toHaveBeenCalledWith(
    buildErrorResponse({
      msg: CONST.AUTH.REFRESH.ERRORS.INVALID,
    }),
  );
});

/**
 * Token set user found
 */
test('test - refresh - valid token', async () => {
  // Setup
  mockVerifyRefreshToken.mockReturnValue({
    sub: 'USER_ID',
    email: 'EMAIL@ADDRESS.COM',
  });
  mockUserFindMany.mockResolvedValue([
    {
      id: 'USER_ID',
      email: 'EMAIL@ADDRESS.COM',
    },
  ]);
  mockCreateRefreshToken.mockReturnValue('NEW_REFRESH_TOKEN');
  mockCreateAuthToken.mockReturnValue('NEW_AUTH_TOKEN');
  const req = buildRequest({
    cookies: {
      refreshToken: 'REFRESH_TOKEN',
    },
  });
  const res = buildResponse({
    clearCookie: (...args: any) => mockClearCookie(args),
    cookie: (...args: any) => mockRequestCookie(args),
  });

  // Pre Expectation
  expect(res.status).not.toHaveBeenCalled();
  expect(res.send).not.toHaveBeenCalled();
  expect(res.json).not.toHaveBeenCalled();
  expect(mockVerifyRefreshToken).not.toHaveBeenCalled();
  expect(mockUserFindMany).not.toHaveBeenCalled();
  expect(mockCreateRefreshToken).not.toHaveBeenCalled();
  expect(mockCreateAuthToken).not.toHaveBeenCalled();
  expect(mockUserUpdate).not.toHaveBeenCalled();
  expect(mockRequestCookie).not.toHaveBeenCalled();
  expect(mockClearCookie).not.toHaveBeenCalled();

  process.env.JWT_ISSUER = 'JWT_ISSUER';
  process.env.JWT_AUDIENCE = 'JWT_AUDIENCE';
  process.env.CSRF_COOKIE_PREFIX = 'DIFFERENT_CSRF';
  process.env.JWT_MAX_AGE = '10';
  process.env.JWT_REFRESH_MAX_AGE = '100';

  // Init
  await Refresh(req, res);

  // Expectations
  expect(res.send).not.toHaveBeenCalled();
  expect(res.status).not.toHaveBeenCalled();
  expect(mockUserFindMany).toHaveBeenCalledTimes(1);
  expect(mockUserFindMany).toHaveBeenCalledWith([
    {
      take: 1,
      where: {
        id: 'USER_ID',
        refresh_token: 'REFRESH_TOKEN',
      },
    },
  ]);
  expect(mockVerifyRefreshToken).toHaveBeenCalledTimes(1);
  expect(mockVerifyRefreshToken).toHaveBeenCalledWith(['REFRESH_TOKEN']);
  expect(mockCreateAuthToken).toHaveBeenCalledTimes(1);
  expect(mockCreateAuthToken).toHaveBeenCalledWith([
    { email: 'EMAIL@ADDRESS.COM', id: 'USER_ID' },
  ]);
  expect(mockUserUpdate).toHaveBeenCalledTimes(1);
  expect(mockUserUpdate).toHaveBeenCalledWith([
    { where: { id: 'USER_ID' }, data: { refresh_token: 'NEW_REFRESH_TOKEN' } },
  ]);
  expect(mockRequestCookie).toHaveBeenCalledTimes(2);
  expect(mockRequestCookie).toHaveBeenCalledWith([
    'token',
    'NEW_AUTH_TOKEN',
    { httpOnly: true, maxAge: 10000 },
  ]);
  expect(mockRequestCookie).toHaveBeenCalledWith([
    'refreshToken',
    'NEW_REFRESH_TOKEN',
    { httpOnly: true, maxAge: 100000 },
  ]);
  expect(mockClearCookie).not.toHaveBeenCalled();
  expect(mockCreateRefreshToken).toHaveBeenCalledTimes(1);
  expect(mockCreateRefreshToken).toHaveBeenCalledWith([
    { email: 'EMAIL@ADDRESS.COM', id: 'USER_ID' },
  ]);
  expect(res.json).toHaveBeenCalledWith(
    buildSuccessResponse({
      msg: CONST.AUTH.REFRESH.SUCCESS.REFRESHED,
    }),
  );
});
