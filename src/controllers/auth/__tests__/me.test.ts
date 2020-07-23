// Imports
// ========================================================
import MockDate from 'mockdate';

import { buildErrorResponse, buildSuccessResponse } from '../../../utils';
import CONST from '../../../utils/constants';
import { buildRequest, buildResponse } from '../../../../test/utils/generate';

// Tested
// ========================================================
import { Me } from '../me';

// Mocks
// ========================================================
/**
 * @constant
 */
const mockUserFindOne = jest.fn().mockName('mockUserFindOne');

/**
 * Mock
 */
jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      user: {
        findOne: (...args: any) => mockUserFindOne(args),
      },
    })),
  };
});

/**
 * Reset for mocks
 */
beforeEach(() => {
  jest.clearAllMocks();
});

// Tests
// ========================================================
/**
 * User not set returns 404 error
 */
test('test - me  - user not set', async () => {
  // Setup
  const req = buildRequest();
  const res = buildResponse();

  // Pre Expectation
  expect(res.status).not.toHaveBeenCalled();
  expect(res.send).not.toHaveBeenCalled();
  expect(res.json).not.toHaveBeenCalled();
  expect(mockUserFindOne).not.toHaveBeenCalled();

  // Init
  await Me(req, res);

  //   Expectations
  expect(res.send).not.toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledTimes(1);
  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledTimes(1);
  expect(mockUserFindOne).not.toHaveBeenCalled();
  expect(res.json).toHaveBeenCalledWith(
    buildErrorResponse({
      msg: CONST.AUTH.ME.ERRORS.NOT_FOUND,
    }),
  );
});

/**
 * User set db user not found
 */
test('test - me  - user set - db user not found', async () => {
  // Setup
  mockUserFindOne.mockResolvedValue(null);
  const req = buildRequest({
    user: {
      sub: 'USER_ID',
    },
  });
  const res = buildResponse();

  // Pre Expectation
  expect(res.status).not.toHaveBeenCalled();
  expect(res.send).not.toHaveBeenCalled();
  expect(res.json).not.toHaveBeenCalled();
  expect(mockUserFindOne).not.toHaveBeenCalled();

  // Init
  await Me(req, res);

  //   Expectations
  expect(res.send).not.toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledTimes(1);
  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledTimes(1);
  expect(mockUserFindOne).toHaveBeenCalledTimes(1);
  expect(mockUserFindOne).toHaveBeenCalledWith([
    {
      where: {
        id: 'USER_ID',
      },
    },
  ]);
  expect(res.json).toHaveBeenCalledWith(
    buildErrorResponse({
      msg: CONST.AUTH.ME.ERRORS.NOT_FOUND,
    }),
  );
});

/**
 * User set and db user found
 */
test('test - me  - user set - db user found', async () => {
  // Setup
  mockUserFindOne.mockResolvedValue({
    id: 'USER_ID',
    first_name: 'FIRST_NAME',
    last_name: 'LAST_NAME',
    email: 'EMAIL@ADDRESS.COM',
  });
  const req = buildRequest({
    user: {
      sub: 'USER_ID',
    },
  });
  const res = buildResponse();

  // Pre Expectation
  expect(res.status).not.toHaveBeenCalled();
  expect(res.send).not.toHaveBeenCalled();
  expect(res.json).not.toHaveBeenCalled();
  expect(mockUserFindOne).not.toHaveBeenCalled();

  // Init
  await Me(req, res);

  //   Expectations
  expect(res.send).not.toHaveBeenCalled();
  expect(res.status).not.toHaveBeenCalled();
  expect(res.json).toHaveBeenCalledTimes(1);
  expect(mockUserFindOne).toHaveBeenCalledTimes(1);
  expect(mockUserFindOne).toHaveBeenCalledWith([
    {
      where: {
        id: 'USER_ID',
      },
    },
  ]);
  expect(res.json).toHaveBeenCalledWith(
    buildSuccessResponse({
      id: 'USER_ID',
      first_name: 'FIRST_NAME',
      last_name: 'LAST_NAME',
      email: 'EMAIL@ADDRESS.COM',
    }),
  );
});
