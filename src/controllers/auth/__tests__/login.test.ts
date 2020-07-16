// Imports
// ========================================================
import { PrismaClient } from '@prisma/client';
import MockDate from 'mockdate';

import { buildErrorResponse, buildSuccessResponse } from '../../../utils';
import CONST from '../../../utils/constants';
import { buildRequest, buildResponse } from '../../../../test/utils/generate';

// Tested
// ========================================================
import { Login } from '../login';

// Mocks
// ========================================================
/**
 * @const
 */
const mockUserFindOne = jest.fn().mockName('mockUserFindOne');

/**
 * @const
 */
const mockUserUpdate = jest.fn().mockName('mockUserUpdate');

/**
 * Mock
 */
jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      user: {
        findOne: (...args: any) => mockUserFindOne(...args),
        update: (...args: any) => mockUserUpdate(...args),
      },
    })),
  };
});

/**
 * @var
 */
const mockCreateResetToken = jest.fn().mockName('mockCreateResetToken');

/**
 * @var
 */
const mockSendResetPasswordEmail = jest
  .fn()
  .mockName('mockSendResetPasswordEmail');

/**
 * @var
 */
const mockVerifyPassword = jest.fn().mockName('mockVerifyPassword');

/**
 * @var
 */
const mockCreateAuthToken = jest.fn().mockName('mockCreateAuthToken');

/**
 * @var
 */
const mockCreateRefreshToken = jest.fn().mockName('mockCreateRefreshToken');

/**
 * Mocking utils function
 */
jest.mock('../../../utils', () => ({
  ...(jest.requireActual('../../../utils') as any),
  createResetToken: (...args: any) => mockCreateResetToken(...args),
  sendResetPasswordEmail: (...args: any) => mockSendResetPasswordEmail(...args),
  verifyPassword: (...args: any) => mockVerifyPassword(...args),
  createAuthToken: (...args: any) => mockCreateAuthToken(...args),
  createRefreshToken: (...args: any) => mockCreateRefreshToken(...args),
}));

/**
 * @var
 */
const mockRequestCookie = jest.fn().mockName('mockRequestCookie');

/**
 * Reset for mocks
 */
beforeEach(() => {
  jest.clearAllMocks();
});

// Tests
// ========================================================
/**
 * Cannot find user with empty payload
 */
test('test - login - payload - {} - user not found', async () => {
  // Setup
  mockUserFindOne.mockResolvedValue(null);
  const req = buildRequest();
  const res = buildResponse({
    cookie: (...args: any) => mockRequestCookie(...args),
  });

  // Pre Expectation
  expect(res.status).not.toHaveBeenCalled();
  expect(res.send).not.toHaveBeenCalled();
  expect(res.json).not.toHaveBeenCalled();
  expect(mockUserFindOne).not.toHaveBeenCalled();
  expect(mockUserUpdate).not.toHaveBeenCalled();
  expect(mockVerifyPassword).not.toHaveBeenCalled();
  expect(mockCreateAuthToken).not.toHaveBeenCalled();
  expect(mockCreateRefreshToken).not.toHaveBeenCalled();
  expect(mockRequestCookie).not.toHaveBeenCalled();

  // Init
  await Login(req, res);

  //   Expectations
  expect(res.status).toHaveBeenCalledTimes(1);
  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledTimes(1);
  expect(mockUserFindOne).toHaveBeenCalledTimes(1);
  expect(mockUserUpdate).not.toHaveBeenCalled();
  expect(mockVerifyPassword).not.toHaveBeenCalled();
  expect(mockCreateAuthToken).not.toHaveBeenCalled();
  expect(mockCreateRefreshToken).not.toHaveBeenCalled();
  expect(mockRequestCookie).not.toHaveBeenCalled();
  expect(res.json).toHaveBeenCalledWith(
    buildErrorResponse({
      msg: CONST.AUTH.LOGIN.ERRORS.NOT_FOUND,
    }),
  );
});

/**
 * User not confirmed
 */
test('test - login - payload - { email: "test@test.com" } - account not confirmed', async () => {
  // Setup
  mockUserFindOne.mockResolvedValue({
    id: 'abcd',
    confirmed_at: null,
  });
  const req = buildRequest({
    body: {
      email: 'test@test.com',
    },
  });
  const res = buildResponse({
    cookie: (...args: any) => mockRequestCookie(...args),
  });

  // Pre Expectation
  expect(res.status).not.toHaveBeenCalled();
  expect(res.send).not.toHaveBeenCalled();
  expect(res.json).not.toHaveBeenCalled();
  expect(mockUserFindOne).not.toHaveBeenCalled();
  expect(mockUserUpdate).not.toHaveBeenCalled();
  expect(mockVerifyPassword).not.toHaveBeenCalled();
  expect(mockCreateAuthToken).not.toHaveBeenCalled();
  expect(mockCreateRefreshToken).not.toHaveBeenCalled();
  expect(mockRequestCookie).not.toHaveBeenCalled();

  // Init
  await Login(req, res);

  //   Expectations
  expect(res.status).toHaveBeenCalledTimes(1);
  expect(res.status).toHaveBeenCalledWith(401);
  expect(res.json).toHaveBeenCalledTimes(1);
  expect(mockUserFindOne).toHaveBeenCalledTimes(1);
  expect(mockUserUpdate).not.toHaveBeenCalled();
  expect(mockVerifyPassword).not.toHaveBeenCalled();
  expect(mockCreateAuthToken).not.toHaveBeenCalled();
  expect(mockCreateRefreshToken).not.toHaveBeenCalled();
  expect(mockRequestCookie).not.toHaveBeenCalled();
  expect(res.json).toHaveBeenCalledWith(
    buildErrorResponse({
      msg: CONST.AUTH.LOGIN.ERRORS.NOT_CONFIRMED,
    }),
  );
});

/**
 * Invalid login credentials
 */
test('test - login - payload - { email: "test@test.com", password: "asdf1234" } - invalid credentials', async () => {
  // Setup
  mockUserFindOne.mockResolvedValue({
    id: 'abcd',
    confirmed_at: new Date(),
    password: 'asdf1234',
  });
  mockVerifyPassword.mockResolvedValue(false);
  const req = buildRequest({
    body: {
      email: 'test@test.com',
      password: '1234asdf',
    },
  });
  const res = buildResponse({
    cookie: (...args: any) => mockRequestCookie(...args),
  });

  // Pre Expectation
  expect(res.status).not.toHaveBeenCalled();
  expect(res.send).not.toHaveBeenCalled();
  expect(res.json).not.toHaveBeenCalled();
  expect(mockUserFindOne).not.toHaveBeenCalled();
  expect(mockUserUpdate).not.toHaveBeenCalled();
  expect(mockVerifyPassword).not.toHaveBeenCalled();
  expect(mockCreateAuthToken).not.toHaveBeenCalled();
  expect(mockCreateRefreshToken).not.toHaveBeenCalled();
  expect(mockRequestCookie).not.toHaveBeenCalled();

  // Init
  await Login(req, res);

  //   Expectations
  expect(res.status).toHaveBeenCalledTimes(1);
  expect(res.status).toHaveBeenCalledWith(401);
  expect(res.json).toHaveBeenCalledTimes(1);
  expect(mockUserFindOne).toHaveBeenCalledTimes(1);
  expect(mockUserUpdate).not.toHaveBeenCalled();
  expect(mockVerifyPassword).toHaveBeenCalledTimes(1);
  expect(mockCreateAuthToken).not.toHaveBeenCalled();
  expect(mockCreateRefreshToken).not.toHaveBeenCalled();
  expect(mockVerifyPassword).toHaveBeenCalledWith('1234asdf', 'asdf1234');
  expect(mockRequestCookie).not.toHaveBeenCalled();
  expect(res.json).toHaveBeenCalledWith(
    buildErrorResponse({
      msg: CONST.AUTH.LOGIN.ERRORS.INVALID,
    }),
  );
});

/**
 * Valid login credentials
 */
test('test - login - payload - { email: "test@test.com", password: "asdf1234" } - successful login', async () => {
  // Setup
  const verifyDate = '2020-05-14T11:01:58.135Z';
  const user = {
    id: 'abcd',
    first_name: 'John',
    last_name: 'Smith',
    email: 'test@test.com',
    confirmed_at: verifyDate,
    password: 'asdf1234',
  };
  const authToken = 'AUTH_TOKEN';
  const refreshToken = 'REFRESH_TOKEN';
  MockDate.set(new Date(verifyDate));
  mockUserFindOne.mockResolvedValue(user);
  mockVerifyPassword.mockResolvedValue(true);
  mockCreateAuthToken.mockReturnValue(authToken);
  mockCreateRefreshToken.mockReturnValue(refreshToken);
  const req = buildRequest({
    body: {
      email: 'test@test.com',
      password: 'asdf1234',
    },
  });
  const res = buildResponse({
    cookie: (...args: any) => mockRequestCookie(...args),
  });

  // Pre Expectation
  expect(res.status).not.toHaveBeenCalled();
  expect(res.send).not.toHaveBeenCalled();
  expect(res.json).not.toHaveBeenCalled();
  expect(mockUserFindOne).not.toHaveBeenCalled();
  expect(mockUserUpdate).not.toHaveBeenCalled();
  expect(mockVerifyPassword).not.toHaveBeenCalled();
  expect(mockCreateAuthToken).not.toHaveBeenCalled();
  expect(mockCreateRefreshToken).not.toHaveBeenCalled();
  expect(mockRequestCookie).not.toHaveBeenCalled();

  process.env.JWT_MAX_AGE = '300';
  process.env.JWT_REFRESH_MAX_AGE = '400';

  // Init
  await Login(req, res);

  //   Expectations
  expect(res.status).not.toHaveBeenCalled();
  expect(res.json).toHaveBeenCalledTimes(1);
  expect(mockUserFindOne).toHaveBeenCalledTimes(1);
  expect(mockVerifyPassword).toHaveBeenCalledWith(user.password, user.password);
  expect(mockCreateAuthToken).toHaveBeenCalledTimes(1);
  expect(mockCreateAuthToken).toHaveBeenCalledWith(user);
  expect(mockCreateRefreshToken).toHaveBeenCalledTimes(1);
  expect(mockCreateRefreshToken).toHaveBeenCalledWith(user);
  expect(mockUserUpdate).toHaveBeenCalledTimes(1);
  expect(mockUserUpdate).toHaveBeenCalledWith({
    where: {
      id: user.id,
    },
    data: { refresh_token: refreshToken },
  });
  expect(mockRequestCookie).toHaveBeenCalledTimes(2);
  expect(mockRequestCookie).toHaveBeenCalledWith('token', authToken, {
    httpOnly: true,
    maxAge: 300 * 1000,
    path: '/',
  });
  expect(mockRequestCookie).toHaveBeenCalledWith('refreshToken', refreshToken, {
    httpOnly: true,
    maxAge: 400 * 1000,
    path: '/',
  });
  expect(mockVerifyPassword).toHaveBeenCalledTimes(1);
  expect(res.json).toHaveBeenCalledWith(
    buildSuccessResponse({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    }),
  );
});
