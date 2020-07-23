// Imports
// ========================================================
import { PrismaClient, User } from '@prisma/client';
import { Router, Request, Response } from 'express';
import {
  buildSuccessResponse,
  buildErrorResponse,
  verifyRefreshToken,
  createRefreshToken,
  createAuthToken,
} from '../../utils';
import CONST from '../../utils/constants';

// Config
// ========================================================
const router = Router();
const prisma = new PrismaClient();

// Function
// ========================================================
export const Refresh = async (req: Request, res: Response) => {
  const token: string | null = req?.cookies?.refreshToken ?? null;

  try {
    if (!token) {
      throw new Error(CONST.AUTH.REFRESH.ERRORS.INVALID);
    }
    const verify = verifyRefreshToken(token);

    const users: User[] | null = await prisma.user.findMany({
      take: 1,
      where: {
        id: verify?.sub,
        refresh_token: token,
      },
    });

    if (!users || users.length === 0) {
      throw new Error(CONST.AUTH.REFRESH.ERRORS.INVALID);
    }

    const refreshToken = createRefreshToken(users[0]);
    const newToken = createAuthToken(users[0]);

    await prisma.user.update({
      where: {
        id: users[0].id,
      },
      data: {
        refresh_token: refreshToken,
      },
    });

    res.cookie('token', newToken, {
      httpOnly: true,
      maxAge: parseInt(process.env.JWT_MAX_AGE || '900') * 1000,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: parseInt(process.env.JWT_REFRESH_MAX_AGE || '604800') * 1000,
    });

    return res.json(
      buildSuccessResponse({
        msg: CONST.AUTH.REFRESH.SUCCESS.REFRESHED,
      }),
    );
  } catch (error) {
    // Clear cookies
    res.clearCookie('token');
    res.clearCookie('refreshToken');
    res.clearCookie(process.env.CSRF_COOKIE_PREFIX || '_csrf');

    return res.status(401).json(
      buildErrorResponse({
        msg: error.message || CONST.AUTH.REFRESH.ERRORS.INVALID,
      }),
    );
  }
};

// Route
// ========================================================
router.get('/', Refresh);

// Exports
// ========================================================
export default router;
