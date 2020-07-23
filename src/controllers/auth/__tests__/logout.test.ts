// Imports
// ========================================================
import { PrismaClient } from '@prisma/client';
import MockDate from 'mockdate';

import { buildErrorResponse, buildSuccessResponse } from '../../../utils';
import CONST from '../../../utils/constants';
import { buildRequest, buildResponse } from '../../../../test/utils/generate';

// Tested
// ========================================================
import { Logout } from '../logout';

// Mocks
// ========================================================
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
        update: (...args: any) => mockUserUpdate(args),
      },
    })),
  };
});

/**
 * @constant
 */
const mockJwtDecode = jest.fn().mockName('mockJwtDecode');

/**
 * Mock
 */
jest.mock('jwt-decode', () => {
  return (...args: any) => mockJwtDecode(args);
});

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
 * Performs logout with token
 */
test('test - logout - token', async () => {
  // Setup
  mockJwtDecode.mockReturnValue({
    sub: 'USER_ID',
  });
  const req = buildRequest({
    cookies: {
      token: 'MY_TOKEN',
    },
  });
  const res = buildResponse({
    clearCookie: (...args: any) => mockClearCookie(args),
  });

  // Pre Expectation
  expect(res.status).not.toHaveBeenCalled();
  expect(res.send).not.toHaveBeenCalled();
  expect(res.json).not.toHaveBeenCalled();
  expect(mockClearCookie).not.toHaveBeenCalled();
  expect(mockJwtDecode).not.toHaveBeenCalled();
  expect(mockUserUpdate).not.toHaveBeenCalled();
  process.env.CSRF_COOKIE_PREFIX = 'DIFFERENT_CSRF';

  // Init
  await Logout(req, res);

  //   Expectations
  expect(res.status).not.toHaveBeenCalled();
  expect(res.json).toHaveBeenCalledTimes(1);
  expect(mockJwtDecode).toHaveBeenCalledTimes(1);
  expect(mockJwtDecode).toHaveBeenCalledWith(['MY_TOKEN']);
  expect(mockUserUpdate).toHaveBeenCalledTimes(1);
  expect(mockUserUpdate).toHaveBeenCalledWith([
    {
      data: {
        refresh_token: null,
      },
      where: {
        id: 'USER_ID',
      },
    },
  ]);
  expect(mockClearCookie).toHaveBeenCalledTimes(3);
  expect(mockClearCookie).toHaveBeenCalledWith(['token']);
  expect(mockClearCookie).toHaveBeenCalledWith(['refreshToken']);
  expect(mockClearCookie).toHaveBeenCalledWith(['DIFFERENT_CSRF']);

  expect(res.json).toHaveBeenCalledWith(
    buildSuccessResponse({
      msg: CONST.AUTH.LOGOUT.SUCCESS.LOGGED_OUT,
    }),
  );
});

/**
 * Performs logout with no token
 */
test('test - logout - no token', async () => {
  // Setup
  const req = buildRequest();
  const res = buildResponse({
    clearCookie: (...args: any) => mockClearCookie(args),
  });

  // Pre Expectation
  expect(res.status).not.toHaveBeenCalled();
  expect(res.send).not.toHaveBeenCalled();
  expect(res.json).not.toHaveBeenCalled();
  expect(mockClearCookie).not.toHaveBeenCalled();
  expect(mockJwtDecode).not.toHaveBeenCalled();
  expect(mockUserUpdate).not.toHaveBeenCalled();
  process.env.CSRF_COOKIE_PREFIX = 'DIFFERENT_CSRF';

  // Init
  await Logout(req, res);

  //   Expectations
  expect(res.status).not.toHaveBeenCalled();
  expect(res.json).toHaveBeenCalledTimes(1);
  expect(mockJwtDecode).not.toHaveBeenCalled();
  expect(mockUserUpdate).not.toHaveBeenCalled();
  expect(mockClearCookie).toHaveBeenCalledTimes(3);
  expect(mockClearCookie).toHaveBeenCalledWith(['token']);
  expect(mockClearCookie).toHaveBeenCalledWith(['refreshToken']);
  expect(mockClearCookie).toHaveBeenCalledWith(['DIFFERENT_CSRF']);

  expect(res.json).toHaveBeenCalledWith(
    buildSuccessResponse({
      msg: CONST.AUTH.LOGOUT.SUCCESS.LOGGED_OUT,
    }),
  );
});
