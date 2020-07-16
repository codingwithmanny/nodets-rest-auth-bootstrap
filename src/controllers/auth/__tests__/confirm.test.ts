// Imports
// ========================================================
import { PrismaClient } from '@prisma/client';
import MockDate from 'mockdate';

import { buildErrorResponse, buildSuccessResponse } from '../../../utils';
import CONST from '../../../utils/constants';
import { buildRequest, buildResponse } from '../../../../test/utils/generate';

// Tested
// ========================================================
import { Confirm } from '../confirm';

// Mocks
// ========================================================
/**
 * @const
 */
const mockUserFindMany = jest.fn().mockName('mockUserFindMany');

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
        findMany: (...args: any) => mockUserFindMany(...args),
        update: (...args: any) => mockUserUpdate(...args),
      },
    })),
  };
});

/**
 * Reset mocks
 */
beforeEach(() => {
  jest.clearAllMocks();
});

// Tests
// ========================================================
/**
 * Fails confirmation when user has passed nothing as a payload
 */
test('test - confirm - payload - {}', async () => {
  // Setup
  mockUserFindMany.mockResolvedValue([]);
  const req = buildRequest();
  const res = buildResponse();

  // Pre Expectation
  expect(res.status).not.toHaveBeenCalled();
  expect(res.send).not.toHaveBeenCalled();
  expect(res.json).not.toHaveBeenCalled();
  expect(mockUserFindMany).not.toHaveBeenCalled();

  // Init
  await Confirm(req, res);

  //   Expectations
  expect(res.status).toHaveBeenCalledTimes(1);
  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledTimes(1);
  expect(mockUserFindMany).toHaveBeenCalledTimes(1);
  expect(res.json).toHaveBeenCalledWith(
    buildErrorResponse({
      msg: CONST.AUTH.CONFIRM.ERRORS.NOT_FOUND,
    }),
  );
});

/**
 * Successfully updates user confirmation
 */
test('test - confirm - payload - { confirmation_token: 1 }', async () => {
  // Setup
  const verifyDate = '2020-05-14T11:01:58.135Z';
  MockDate.set(new Date(verifyDate));
  mockUserFindMany.mockResolvedValue([{ id: 'abcd' }]);
  mockUserUpdate.mockResolvedValue(true);
  const req = buildRequest({
    body: {
      confirmation_token: 1,
    },
  });
  const res = buildResponse();

  // Pre Expectation
  expect(res.status).not.toHaveBeenCalled();
  expect(res.send).not.toHaveBeenCalled();
  expect(res.json).not.toHaveBeenCalled();
  expect(mockUserFindMany).not.toHaveBeenCalled();
  expect(mockUserUpdate).not.toHaveBeenCalled();

  // Init
  await Confirm(req, res);

  // Expectations
  expect(res.status).not.toHaveBeenCalled();
  expect(res.send).not.toHaveBeenCalled();
  expect(res.json).toHaveBeenCalledTimes(1);
  expect(mockUserFindMany).toHaveBeenCalledTimes(1);
  expect(mockUserUpdate).toHaveBeenCalledTimes(1);
  expect(mockUserUpdate).toHaveBeenCalledWith({
    data: {
      confirmed_at: new Date(verifyDate),
    },
    where: {
      id: 'abcd',
    },
  });
  expect(res.json).toHaveBeenCalledWith(
    buildSuccessResponse({
      msg: CONST.AUTH.CONFIRM.SUCCESS.CONFIRMED,
    }),
  );
});
