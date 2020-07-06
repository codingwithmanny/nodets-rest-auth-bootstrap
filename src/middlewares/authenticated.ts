// Imports
// ========================================================
import { Request, Response, NextFunction } from 'express';
import { buildErrorResponse, verifyAuthToken } from '../utils';
import CONST from '../utils/constants';

// Middleware
// ========================================================
const Authenticated = (
  req: Request,
  res: Response,
  next: NextFunction,
): Response | void => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json(
      buildErrorResponse({
        msg: CONST.MIDDLEWARE.AUTHENTICATE.ERRORS.INVALID,
      }),
    );
  }

  try {
    const decodedToken = verifyAuthToken(token);
    req.user = decodedToken as Request['user'];
    next();
  } catch (error) {
    return res.status(401).json(
      buildErrorResponse({
        msg: CONST.MIDDLEWARE.AUTHENTICATE.ERRORS.AUTHORIZE,
      }),
    );
  }
};

// Exports
// ========================================================
export default Authenticated;
