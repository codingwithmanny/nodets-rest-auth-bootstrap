// Imports
// ========================================================
import { buildRequest, buildResponse } from '../../../../test/utils/generate';
import { buildSuccessResponse } from '../../../utils';

// Tested
// ========================================================
import { Csrf } from '../csrf';

// Tests
// ========================================================
/**
 * Fails confirmation when user has passed nothing as a payload
 */
test('test - csrf - returns - { token: "abcd" }', async () => {
  // Setup
  const req = buildRequest({
    csrfToken: () => 'abcd',
  });
  const res = buildResponse();

  // Pre Expectation
  expect(res.status).not.toHaveBeenCalled();
  expect(res.send).not.toHaveBeenCalled();
  expect(res.json).not.toHaveBeenCalled();

  // Init
  await Csrf(req, res);

  //   Expectations
  expect(res.status).not.toHaveBeenCalled();
  expect(res.send).not.toHaveBeenCalled();
  expect(res.json).toHaveBeenCalledTimes(1);
  expect(res.json).toHaveBeenCalledWith(
    buildSuccessResponse({
      token: 'abcd',
    }),
  );
});
