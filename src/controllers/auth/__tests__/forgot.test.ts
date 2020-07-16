// Imports
// ========================================================
import { PrismaClient } from '@prisma/client';
import { buildErrorResponse, buildSuccessResponse } from '../../../utils';
import CONST from '../../../utils/constants';
import { buildRequest, buildResponse } from '../../../../test/utils/generate';

// Tested
// ========================================================
import { Forgot } from '../forgot';

// Mocks
// ========================================================
/**
 * @const
 */
const mockUserFindOne = jest.fn();

/**
 * @const
 */
const mockUserUpdate = jest.fn();

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
const mockCreateResetToken = jest.fn();

/**
 * @var
 */
const mockSendResetPasswordEmail = jest.fn();

/**
 * Mocking utils function
 */
jest.mock('../../../utils', () => ({
  ...(jest.requireActual('../../../utils') as any),
  createResetToken: (...args: any) => mockCreateResetToken(...args),
  sendResetPasswordEmail: (...args: any) => mockSendResetPasswordEmail(...args),
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
 * Cannot find user with empty payload
 */
test('test - forgot - payload - {} - not found', async () => {
  // Setup
  mockUserFindOne.mockResolvedValue(null);
  const req = buildRequest();
  const res = buildResponse();

  // Pre Expectation
  expect(res.status).not.toHaveBeenCalled();
  expect(res.send).not.toHaveBeenCalled();
  expect(res.json).not.toHaveBeenCalled();
  expect(mockUserFindOne).not.toHaveBeenCalled();
  expect(mockCreateResetToken).not.toHaveBeenCalled();

  // Init
  await Forgot(req, res);

  //   Expectations
  expect(res.status).toHaveBeenCalledTimes(1);
  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledTimes(1);
  expect(mockUserFindOne).toHaveBeenCalledTimes(1);
  expect(mockCreateResetToken).not.toHaveBeenCalled();
  expect(res.json).toHaveBeenCalledWith(
    buildErrorResponse({
      msg: CONST.AUTH.FORGOT.ERRORS.NOT_FOUND,
    }),
  );
});

/**
 * Successfully updates user confirmation
 */
test('test - forgot - payload - { email: "test@test.com" }', async () => {
  // Setup
  mockUserFindOne.mockResolvedValue({
    id: 'abcd',
    email: 'test@test.com',
  });
  mockUserUpdate.mockResolvedValue(true);
  mockCreateResetToken.mockReturnValue('MY_TOKEN');
  const req = buildRequest({
    body: {
      email: 'test@test.com',
    },
  });
  const res = buildResponse();
  process.env.ENABLE_EMAIL = 'true';

  // Pre Expectation
  expect(res.status).not.toHaveBeenCalled();
  expect(res.send).not.toHaveBeenCalled();
  expect(res.json).not.toHaveBeenCalled();
  expect(mockUserFindOne).not.toHaveBeenCalled();
  expect(mockUserUpdate).not.toHaveBeenCalled();
  expect(mockCreateResetToken).not.toHaveBeenCalled();
  expect(mockSendResetPasswordEmail).not.toHaveBeenCalled();

  // Init
  await Forgot(req, res);

  // Expectations
  expect(res.status).not.toHaveBeenCalled();
  expect(res.send).not.toHaveBeenCalled();
  expect(res.json).toHaveBeenCalledTimes(1);
  expect(mockUserFindOne).toHaveBeenCalledTimes(1);
  expect(mockUserUpdate).toHaveBeenCalledTimes(1);
  expect(mockCreateResetToken).toHaveBeenCalledTimes(1);
  expect(mockSendResetPasswordEmail).toHaveBeenCalledTimes(1);
  expect(mockSendResetPasswordEmail).toHaveBeenCalledWith(
    'test@test.com',
    'MY_TOKEN',
  );
  expect(mockUserUpdate).toHaveBeenCalledWith({
    data: {
      reset_token: 'MY_TOKEN',
    },
    where: {
      id: 'abcd',
    },
  });
  expect(res.json).toHaveBeenCalledWith(
    buildSuccessResponse({
      msg: CONST.AUTH.FORGOT.SUCCESS.EMAIL,
    }),
  );
});
