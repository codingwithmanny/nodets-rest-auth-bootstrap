// Imports
// ========================================================
import { Request, Response, NextFunction } from 'express';
import { buildErrorResponse } from '../utils';
import { HttpError } from 'http-errors';
import CONST from '../utils/constants';

// Middleware
// ========================================================
const Csrf = (
  err: HttpError,
  _req: Request,
  res: Response,
  next: NextFunction,
): Response | void => {
  if (err.code !== 'EBADCSRFTOKEN') return next(err);

  return res
    .status(403)
    .json(buildErrorResponse({ msg: CONST.MIDDLEWARE.CSRF.ERRORS.INVALID }));
};

// Exports
// ========================================================
export default Csrf;
