// Imports
// ========================================================
import { buildErrorResponse, buildSuccessResponse } from '../../../utils';
import CONST from '../../../utils/constants';
import { buildRequest, buildResponse } from '../../../../test/utils/generate';

// Tested
// ========================================================
import { Register } from '../register';

// Mocks
// ========================================================
/**
 * @constant
 */
const mockUserCreate = jest.fn().mockName('mockUserCreate');

/**
 * Mock
 */
jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      user: {
        create: (...args: any) => mockUserCreate(args),
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
 * @constant
 */
const mockHashPassword = jest.fn().mockName('mockHashPassword');

/**
 * @constant
 */
const mockGetGeneratedToken = jest.fn().mockName('mockGetGeneratedToken');

/**
 * @constant
 */
const mockSendConfirmAccountEmail = jest
  .fn()
  .mockName('mockSendConfirmAccountEmail');

/**
 * @constant
 */
const mockErrorDefinition = jest.fn().mockName('mockErrorDefinition');

/**
 * Mocking utils function
 */
jest.mock('../../../utils', () => ({
  ...(jest.requireActual('../../../utils') as any),
  verifyRefreshToken: (...args: any) => mockVerifyRefreshToken(args),
  createRefreshToken: (...args: any) => mockCreateRefreshToken(args),
  createAuthToken: (...args: any) => mockCreateAuthToken(args),
  hashPassword: (...args: any) => mockHashPassword(args),
  getGeneratedToken: (...args: any) => mockGetGeneratedToken(args),
  sendConfirmAccountEmail: (...args: any) => mockSendConfirmAccountEmail(args),
  ErrorDefinition: (...args: any) => mockErrorDefinition(args),
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
 * Register create throw error
 */
test('test - register - duplicate user', async () => {
  // Setup
  mockHashPassword.mockResolvedValue('HASHED_PASSWORD');
  mockGetGeneratedToken.mockReturnValue('GENERATED_TOKEN');
  mockUserCreate.mockImplementation(() => {
    throw new Error('ERROR_MESSAGE');
  });
  mockErrorDefinition.mockReturnValue('ANOTHER_ERROR_MESSAGE');
  const req = buildRequest({
    body: {
      email: 'EMAIL@ADDRESS.COM',
      first_name: 'FIRST_NAME',
      last_name: 'LAST_NAME',
      password: 'PASSWORD',
    },
  });
  const res = buildResponse();

  // Pre Expectation
  expect(res.status).not.toHaveBeenCalled();
  expect(res.send).not.toHaveBeenCalled();
  expect(res.json).not.toHaveBeenCalled();
  expect(mockHashPassword).not.toHaveBeenCalled();
  expect(mockGetGeneratedToken).not.toHaveBeenCalled();
  expect(mockUserCreate).not.toHaveBeenCalled();
  expect(mockSendConfirmAccountEmail).not.toHaveBeenCalled();
  expect(mockErrorDefinition).not.toHaveBeenCalled();

  process.env.ENABLE_EMAIL = 'false';

  // Init
  await Register(req, res);

  // Expectations
  expect(res.send).not.toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledTimes(1);
  expect(res.status).toHaveBeenCalledWith(400);
  expect(mockHashPassword).toHaveBeenCalledTimes(1);
  expect(mockHashPassword).toHaveBeenCalledWith(['PASSWORD']);
  expect(mockGetGeneratedToken).toHaveBeenCalledTimes(1);
  expect(mockUserCreate).toHaveBeenCalledTimes(1);
  expect(mockUserCreate).toHaveBeenCalledWith([
    {
      data: {
        email: 'EMAIL@ADDRESS.COM',
        first_name: 'FIRST_NAME',
        last_name: 'LAST_NAME',
        password: 'HASHED_PASSWORD',
        confirmation_token: 'GENERATED_TOKEN',
      },
    },
  ]);
  expect(mockSendConfirmAccountEmail).not.toHaveBeenCalled();
  expect(mockErrorDefinition).toHaveBeenCalledTimes(1);
  expect(res.json).toHaveBeenCalledWith(
    buildErrorResponse({
      msg: 'ANOTHER_ERROR_MESSAGE',
    }),
  );
});

/**
 * Register email error
 */
test('test - register - email error ', async () => {
  // Setup
  mockHashPassword.mockResolvedValue('HASHED_PASSWORD');
  mockGetGeneratedToken.mockReturnValue('GENERATED_TOKEN');
  mockUserCreate.mockResolvedValue(true);
  mockErrorDefinition.mockReturnValue('ANOTHER_ERROR_MESSAGE');
  mockSendConfirmAccountEmail.mockImplementation(() => {
    throw new Error('ERROR_MESSAGE');
  });
  const req = buildRequest({
    body: {
      email: 'EMAIL@ADDRESS.COM',
      first_name: 'FIRST_NAME',
      last_name: 'LAST_NAME',
      password: 'PASSWORD',
    },
  });
  const res = buildResponse();

  // Pre Expectation
  expect(res.status).not.toHaveBeenCalled();
  expect(res.send).not.toHaveBeenCalled();
  expect(res.json).not.toHaveBeenCalled();
  expect(mockHashPassword).not.toHaveBeenCalled();
  expect(mockGetGeneratedToken).not.toHaveBeenCalled();
  expect(mockUserCreate).not.toHaveBeenCalled();
  expect(mockSendConfirmAccountEmail).not.toHaveBeenCalled();
  expect(mockErrorDefinition).not.toHaveBeenCalled();

  process.env.ENABLE_EMAIL = 'true';

  // Init
  await Register(req, res);

  // Expectations
  expect(res.send).not.toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledTimes(1);
  expect(res.status).toHaveBeenCalledWith(400);
  expect(mockHashPassword).toHaveBeenCalledTimes(1);
  expect(mockHashPassword).toHaveBeenCalledWith(['PASSWORD']);
  expect(mockGetGeneratedToken).toHaveBeenCalledTimes(1);
  expect(mockUserCreate).toHaveBeenCalledTimes(1);
  expect(mockUserCreate).toHaveBeenCalledWith([
    {
      data: {
        email: 'EMAIL@ADDRESS.COM',
        first_name: 'FIRST_NAME',
        last_name: 'LAST_NAME',
        password: 'HASHED_PASSWORD',
        confirmation_token: 'GENERATED_TOKEN',
      },
    },
  ]);
  expect(mockSendConfirmAccountEmail).toHaveBeenCalledTimes(1);
  expect(mockSendConfirmAccountEmail).toHaveBeenCalledWith([
    'EMAIL@ADDRESS.COM',
    'GENERATED_TOKEN',
  ]);
  expect(mockErrorDefinition).toHaveBeenCalledTimes(1);
  expect(res.json).toHaveBeenCalledWith(
    buildErrorResponse({
      msg: 'ANOTHER_ERROR_MESSAGE',
    }),
  );
});

/**
 * Register success
 */
test('test - register - success ', async () => {
  // Setup
  mockHashPassword.mockResolvedValue('HASHED_PASSWORD');
  mockGetGeneratedToken.mockReturnValue('GENERATED_TOKEN');
  mockUserCreate.mockResolvedValue(true);
  mockSendConfirmAccountEmail.mockResolvedValue(true);
  const req = buildRequest({
    body: {
      email: 'EMAIL@ADDRESS.COM',
      first_name: 'FIRST_NAME',
      last_name: 'LAST_NAME',
      password: 'PASSWORD',
    },
  });
  const res = buildResponse();

  // Pre Expectation
  expect(res.status).not.toHaveBeenCalled();
  expect(res.send).not.toHaveBeenCalled();
  expect(res.json).not.toHaveBeenCalled();
  expect(mockHashPassword).not.toHaveBeenCalled();
  expect(mockGetGeneratedToken).not.toHaveBeenCalled();
  expect(mockUserCreate).not.toHaveBeenCalled();
  expect(mockSendConfirmAccountEmail).not.toHaveBeenCalled();
  expect(mockErrorDefinition).not.toHaveBeenCalled();

  process.env.ENABLE_EMAIL = 'true';

  // Init
  await Register(req, res);

  // Expectations
  expect(res.send).not.toHaveBeenCalled();
  expect(res.status).not.toHaveBeenCalled();
  expect(mockHashPassword).toHaveBeenCalledTimes(1);
  expect(mockHashPassword).toHaveBeenCalledWith(['PASSWORD']);
  expect(mockGetGeneratedToken).toHaveBeenCalledTimes(1);
  expect(mockUserCreate).toHaveBeenCalledTimes(1);
  expect(mockUserCreate).toHaveBeenCalledWith([
    {
      data: {
        email: 'EMAIL@ADDRESS.COM',
        first_name: 'FIRST_NAME',
        last_name: 'LAST_NAME',
        password: 'HASHED_PASSWORD',
        confirmation_token: 'GENERATED_TOKEN',
      },
    },
  ]);
  expect(mockSendConfirmAccountEmail).toHaveBeenCalledTimes(1);
  expect(mockSendConfirmAccountEmail).toHaveBeenCalledWith([
    'EMAIL@ADDRESS.COM',
    'GENERATED_TOKEN',
  ]);
  expect(mockErrorDefinition).not.toHaveBeenCalled();
  expect(res.json).toHaveBeenCalledWith(
    buildSuccessResponse({
      msg: CONST.AUTH.REGISTER.SUCCESS.PENDING,
    }),
  );
});
