// Imports
// ========================================================
import { PrismaClient, User } from '@prisma/client';
import { Router, Request, Response } from 'express';
import { check } from 'express-validator';
import {
  buildErrorResponse,
  buildSuccessResponse,
  verifyPassword,
  createAuthToken,
  createRefreshToken,
} from '../../utils';
import CONST from '../../utils/constants';

// Midddlewares
// ========================================================
import validation from '../../middlewares/validation';

// Config
// ========================================================
const router = Router();
const prisma = new PrismaClient();

// Routes
// ========================================================
router.post(
  '/',
  [check('email').isString(), check('password').isLength({ min: 8 })],
  validation,
  async (req: Request, res: Response) => {
    // Get body
    const { body } = req;

    // 1. Find user
    const user: User | null = await prisma.user.findOne({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      return res.status(404).json(
        buildErrorResponse({
          msg: CONST.AUTH.LOGIN.ERRORS.NOT_FOUND,
        }),
      );
    }

    if (!user.confirmed_at) {
      return res.status(401).json(
        buildErrorResponse({
          msg: CONST.AUTH.LOGIN.ERRORS.NOT_CONFIRMED,
        }),
      );
    }

    // 2. Validate password
    const passwordValid = await verifyPassword(body.password, user.password);

    if (passwordValid) {
      // 3. Create jwt + refresh token
      const token = createAuthToken(user);
      const refreshToken = createRefreshToken(user);
      const useInfo = {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      };

      // 4. Update user's refresh token
      await prisma.user.update({
        where: { id: user.id },
        data: { refresh_token: refreshToken },
      });

      // 5. Set token cookie
      res.cookie('token', token, {
        httpOnly: true,
        maxAge: parseInt(process.env.JWT_MAX_AGE || '900') * 1000,
        // domain: '.app.local',
        path: '/',
        secure: process.env.NODE_ENV === 'production' ? true : false,
      });

      // 6. Set refresh token cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: parseInt(process.env.JWT_REFRESH_MAX_AGE || '604800') * 1000,
        // domain: '.app.local',
        path: '/',
        secure: process.env.NODE_ENV === 'production' ? true : false,
      });

      // 7. Send token data
      return res.json(buildSuccessResponse(useInfo));
    }

    // Invalid credentials
    return res.status(401).json(
      buildErrorResponse({
        msg: CONST.AUTH.LOGIN.ERRORS.INVALID,
      }),
    );
  },
);

// Exports
// ========================================================
export default router;
