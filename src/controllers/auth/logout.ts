// Imports
// ========================================================
import { PrismaClient } from '@prisma/client';
import { Router, Request, Response } from 'express';
import jwtDecode from 'jwt-decode';
import { buildSuccessResponse } from '../../utils';
import CONST from '../../utils/constants';

// Config
// ========================================================
const router = Router();
const prisma = new PrismaClient();

// Function
// ========================================================
export const Logout = async (req: Request, res: Response) => {
  // If token present clear refresh token
  const token = req?.cookies?.token;

  if (token) {
    const decodedToken = jwtDecode(token) as Request['user'] | null;

    if (decodedToken) {
      await prisma.user.update({
        where: {
          id: decodedToken.sub,
        },
        data: {
          refresh_token: null,
        },
      });
    }
  }

  // Clear cookies
  res.clearCookie('token');
  res.clearCookie('refreshToken');
  res.clearCookie(process.env.CSRF_COOKIE_PREFIX || '_csrf');

  return res.json(
    buildSuccessResponse({
      msg: CONST.AUTH.LOGOUT.SUCCESS.LOGGED_OUT,
    }),
  );
};

// Route
// ========================================================
router.get('/', Logout);

// Exports
// ========================================================
export default router;
